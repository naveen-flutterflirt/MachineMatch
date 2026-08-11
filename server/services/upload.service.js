import path from 'path';
import { BaseService } from './base.service.js';
import uploadRepository from '../repositories/upload.repository.js';
import machineRepository from '../repositories/machine.repository.js';
import categoryRepository from '../repositories/category.repository.js';
import specificationRepository from '../repositories/specification.repository.js';
import attributeMasterRepository from '../repositories/attributeMaster.repository.js';
import categoryAttributeTemplateRepository from '../repositories/categoryAttributeTemplate.repository.js';
import Vendor from '../models/Vendor.js';
import { getFilePublicUrl } from '../utils/s3Upload.js';
import { extractSpecsFromPdf } from './ai/pdfSpecExtractor.js';
import { convertToStandardUnit } from '../utils/unitConverter.js';
import { AppError } from '../utils/AppError.js';

export class UploadService extends BaseService {
  constructor() {
    super(uploadRepository);
    this.uploadRepo = uploadRepository;
  }

  async processFileUpload(file, userId = null) {
    if (!file) {
      throw new AppError('No file uploaded. Please attach a file.', 400);
    }

    const fileUrl = getFilePublicUrl(file);

    const newUpload = await this.uploadRepo.create({
      uploadedByUserId: userId || null,
      originalName: file.originalname,
      fileName: file.filename || file.key || file.originalname,
      fileUrl,
      mimeType: file.mimetype,
      fileSize: file.size,
      status: 'processing',
      ocrExtractedData: {},
    });

    try {
      const processedRecord = await this.extractAndCreateMachineFromPdf(newUpload, file.path);
      return processedRecord;
    } catch (err) {
      console.error(`⚠️ PDF Processing notice for ${file.originalname}:`, err.message);
      return await newUpload.update({ status: 'processed' });
    }
  }

  async processMultipleFileUploads(files = [], userId = null) {
    if (!files || files.length === 0) {
      throw new AppError('No files uploaded. Please attach at least one file.', 400);
    }

    const uploadRecords = [];
    for (const file of files) {
      const record = await this.processFileUpload(file, userId);
      uploadRecords.push(record);
    }

    return uploadRecords;
  }

  async extractAndCreateMachineFromPdf(uploadRecord, filePathOnDisk = null) {
    const targetPath = filePathOnDisk || path.join(process.cwd(), 'uploads', uploadRecord.fileName);
    const extractionResult = await extractSpecsFromPdf(targetPath, uploadRecord.originalName);
    const { vendor: vendorInfo, machine: machineInfo, attrSpecs } = extractionResult;
    const textToScan = `${uploadRecord.originalName} ${machineInfo.modelName || ''}`.toLowerCase();

    // Generic Category Resolution
    let detectedCategoryName = machineInfo.categoryName || '';
    if (!detectedCategoryName) {
      if (textToScan.includes('wheel loader') || textToScan.includes('front loader') || textToScan.includes('sem')) {
        detectedCategoryName = 'Wheel Loaders';
      } else if (textToScan.includes('backhoe') || textToScan.includes('3dx')) {
        detectedCategoryName = 'Backhoe Loaders';
      } else if (textToScan.includes('dozer') || textToScan.includes('bulldozer')) {
        detectedCategoryName = 'Bulldozers';
      } else if (textToScan.includes('crane')) {
        detectedCategoryName = 'Cranes';
      } else if (textToScan.includes('excavator') || textToScan.includes('digger') || textToScan.includes('crawler')) {
        detectedCategoryName = 'Excavators';
      } else {
        detectedCategoryName = 'Heavy Machinery';
      }
    }

    const computedSlug = detectedCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'general-machinery';

    let category = await categoryRepository.findOne({ where: { slug: computedSlug } });
    if (!category) {
      category = await categoryRepository.findOne({ where: { name: detectedCategoryName } });
    }

    if (!category) {
      // Create new Category in DB dynamically for unknown/new machinery categories
      category = await categoryRepository.create({
        name: detectedCategoryName,
        slug: computedSlug,
        description: `Dynamically registered category for ${detectedCategoryName}`,
        isActive: true,
      });
      console.log(`✨ Dynamically registered new Category: "${detectedCategoryName}" (${computedSlug})`);
    }

    // 1. Create or Find Vendor with full contact details & update if necessary
    let vendorRecord = null;
    try {
      const [v, created] = await Vendor.findOrCreate({
        where: { name: vendorInfo.name },
        defaults: {
          name: vendorInfo.name,
          contactEmail: vendorInfo.contactEmail,
          contactPhone: vendorInfo.contactPhone,
          website: vendorInfo.website,
          country: vendorInfo.country,
          isVerified: true,
        },
      });
      vendorRecord = v;

      if (!created && vendorRecord) {
        await vendorRecord.update({
          contactEmail: vendorInfo.contactEmail || vendorRecord.contactEmail,
          contactPhone: vendorInfo.contactPhone || vendorRecord.contactPhone,
          website: vendorInfo.website || vendorRecord.website,
          country: vendorInfo.country || vendorRecord.country,
        });
      }
    } catch (err) {
      console.warn('Vendor creation notice:', err.message);
    }

    // 2. Create Machine Model Entry
    const cleanModelName = uploadRecord.originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/_/g, ' ')
      .trim();

    const newMachine = await machineRepository.create({
      categoryId: category ? category.id : null,
      vendorId: vendorRecord ? vendorRecord.id : null,
      modelName: cleanModelName,
      variant: machineInfo.variant || 'Brochure Variant',
      manufacturingYear: new Date().getFullYear(),
      status: 'published',
      isFeatured: false,
    });

    // 3. Register Attribute Masters (if new) and Machine Specifications
    const metadataExcludeRegex = /customer|quotation|quote|signatory|authorized|address|phone|email|model|variant|vendor|manufacturer|date|price|cost|warranty|delivery|terms|gst|tax|payment|page|category|serial/i;

    for (const specDef of attrSpecs) {
      if (metadataExcludeRegex.test(specDef.code) || metadataExcludeRegex.test(specDef.name)) {
        continue; // EXCLUDE DOCUMENT METADATA
      }

      const [attrRecord] = await attributeMasterRepository.model.findOrCreate({
        where: { code: specDef.code },
        defaults: {
          name: specDef.name,
          code: specDef.code,
          dataType: specDef.dataType || 'number',
          standardUnit: specDef.rawUnit,
          higherIsBetter: specDef.higherIsBetter !== undefined ? specDef.higherIsBetter : true,
          defaultWeight: 1.0,
        },
      });

      if (attrRecord) {
        // Generic Unit Normalization
        const { normalizedValue, normalizedUnit } = convertToStandardUnit(
          specDef.norm,
          specDef.rawUnit,
          attrRecord.standardUnit
        );

        await specificationRepository.create({
          machineId: newMachine.id,
          attributeId: attrRecord.id,
          rawValue: specDef.rawValue,
          rawUnit: specDef.rawUnit,
          normalizedValue: normalizedValue !== null ? normalizedValue : specDef.norm,
          normalizedUnit: normalizedUnit || specDef.rawUnit,
          source: 'ai_ocr',
        });
      }
    }

    return await uploadRecord.update({
      status: 'processed',
      ocrExtractedData: {
        machineId: newMachine.id,
        categoryId: category ? category.id : null,
        categorySlug: category ? category.slug : null,
        vendorId: vendorRecord ? vendorRecord.id : null,
        vendorName: vendorInfo.name,
        modelName: newMachine.modelName,
        extractedSpecs: attrSpecs,
      },
    });
  }

  async updateUploadStatus(id, status, ocrData = null, errorMessage = null) {
    const upload = await this.uploadRepo.findById(id);

    const validStatuses = ['pending', 'processing', 'processed', 'failed'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid upload status '${status}'`, 400);
    }

    const updateData = { status };
    if (ocrData) {
      updateData.ocrExtractedData = ocrData;
    }
    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    return await upload.update(updateData);
  }

  async getUserUploads(userId) {
    return await this.uploadRepo.findByUser(userId);
  }

  async getPendingUploads() {
    return await this.uploadRepo.findPending();
  }

  async getAllUploadsWithUploader(options = {}) {
    return await this.uploadRepo.findAllWithUploader(options);
  }
}

export default new UploadService();
