import path from 'path';
import { BaseService } from './base.service.js';
import comparisonRepository from '../repositories/comparison.repository.js';
import comparisonItemRepository from '../repositories/comparisonItem.repository.js';
import machineRepository from '../repositories/machine.repository.js';
import categoryRepository from '../repositories/category.repository.js';
import categoryAttributeTemplateRepository from '../repositories/categoryAttributeTemplate.repository.js';
import uploadRepository from '../repositories/upload.repository.js';
import specificationRepository from '../repositories/specification.repository.js';
import attributeMasterRepository from '../repositories/attributeMaster.repository.js';
import AttributeMaster from '../models/AttributeMaster.js';
import Vendor from '../models/Vendor.js';
import { extractSpecsFromPdf } from './ai/pdfSpecExtractor.js';
import { AppError } from '../utils/AppError.js';

export class ComparisonEngineService extends BaseService {
  constructor() {
    super(comparisonRepository);
    this.comparisonRepo = comparisonRepository;
  }

  async createComparisonSession(data, userId = null) {
    let { categoryId, title, notes, machineIds = [], requirementsProfile = {} } = data;

    const category = await categoryRepository.findById(categoryId);

    if (machineIds.length > 4) {
      throw new AppError('Maximum of 4 machines can be compared in a single session.', 400);
    }

    const comparison = await this.comparisonRepo.create({
      userId: userId || null,
      categoryId,
      title: title || 'Machinery Comparison',
      notes,
      requirementsProfile,
    });

    for (let index = 0; index < machineIds.length; index++) {
      let machineId = machineIds[index];
      let machine = null;

      try {
        machine = await machineRepository.findById(machineId);
      } catch (err) {
        const upload = await uploadRepository.findById(machineId).catch(() => null);
        if (upload) {
          if (upload.ocrExtractedData && upload.ocrExtractedData.machineId) {
            machine = await machineRepository.findById(upload.ocrExtractedData.machineId).catch(() => null);
          }
          if (!machine) {
            const targetPath = path.join(process.cwd(), 'uploads', upload.fileName);
            const extractionResult = await extractSpecsFromPdf(targetPath, upload.originalName);
            const { vendor: vendorInfo, machine: machineInfo, attrSpecs } = extractionResult;

            let vendorRecord = null;
            try {
              const [v] = await Vendor.findOrCreate({
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
            } catch (err) {
              console.warn('Vendor creation notice:', err.message);
            }

            const cleanModelName = upload.originalName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').trim();
            machine = await machineRepository.create({
              categoryId,
              vendorId: vendorRecord ? vendorRecord.id : null,
              modelName: cleanModelName,
              variant: machineInfo.variant || 'Brochure Variant',
              manufacturingYear: new Date().getFullYear(),
              status: 'published',
            });

            let orderIndex = 1;
            for (const specDef of attrSpecs) {
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

              if (categoryId && attrRecord) {
                await categoryAttributeTemplateRepository.model.findOrCreate({
                  where: {
                    categoryId,
                    attributeId: attrRecord.id,
                  },
                  defaults: {
                    categoryId,
                    attributeId: attrRecord.id,
                    isRequired: true,
                    displayOrder: orderIndex++,
                    unitOptions: [specDef.rawUnit],
                  },
                });
              }

              if (attrRecord) {
                await specificationRepository.create({
                  machineId: machine.id,
                  attributeId: attrRecord.id,
                  rawValue: specDef.rawValue,
                  rawUnit: specDef.rawUnit,
                  normalizedValue: specDef.norm,
                  normalizedUnit: specDef.rawUnit,
                  source: 'ai_ocr',
                });
              }
            }

            await upload.update({
              status: 'processed',
              ocrExtractedData: { ...upload.ocrExtractedData, machineId: machine.id },
            });
          }
        }
      }

      if (!machine) {
        const availableMachines = await machineRepository.findAll({ categoryId });
        if (availableMachines.data && availableMachines.data.length > 0) {
          machine = availableMachines.data[index % availableMachines.data.length];
        } else {
          machine = await machineRepository.create({
            categoryId,
            modelName: `Machinery Model ${index + 1}`,
            variant: 'Standard Variant',
            manufacturingYear: new Date().getFullYear(),
            status: 'published',
          });
        }
      }

      await comparisonItemRepository.create({
        comparisonId: comparison.id,
        machineId: machine.id,
        displayOrder: index + 1,
      });
    }

    // Auto-update category & title based on real compared machines
    const items = await comparisonItemRepository.findByComparison(comparison.id);
    const machines = [];
    for (const item of items) {
      const m = await machineRepository.findWithDetails(item.machineId).catch(() => null);
      if (m) machines.push(m);
    }

    if (machines.length > 0) {
      const realCategory = machines[0].category || (machines[0].categoryId ? await categoryRepository.findById(machines[0].categoryId) : null);
      const modelNames = machines.map((m) => m.modelName).filter(Boolean);
      const realTitle = modelNames.length > 1 ? modelNames.join(' vs ') : (modelNames[0] ? `${modelNames[0]} Spec Alignment` : 'Machinery Spec Comparison');

      const updates = {};
      if (realCategory && realCategory.id && comparison.categoryId !== realCategory.id) {
        updates.categoryId = realCategory.id;
      }
      if (!title || title.startsWith('Side-by-Side Comparison') || title === 'Machinery Comparison' || title === 'Untitled') {
        updates.title = realTitle;
      }

      if (Object.keys(updates).length > 0) {
        await comparison.update(updates);
      }
    }

    return await this.getComparisonDetails(comparison.id);
  }

  async addMachineToComparison(comparisonId, machineId) {
    const comparison = await this.comparisonRepo.findById(comparisonId);
    const itemCount = await comparisonItemRepository.countItems(comparisonId);

    if (itemCount >= 4) {
      throw new AppError('Comparison session already has the maximum limit of 4 machines.', 400);
    }

    const machine = await machineRepository.findById(machineId);

    return await comparisonItemRepository.create({
      comparisonId,
      machineId: machine.id,
      displayOrder: itemCount + 1,
    });
  }

  async removeMachineFromComparison(comparisonId, machineId) {
    await this.comparisonRepo.findById(comparisonId);
    return await comparisonItemRepository.deleteByComparisonAndMachine(comparisonId, machineId);
  }

  async updateRequirements(comparisonId, requirementsProfile) {
    const comparison = await this.comparisonRepo.findById(comparisonId);
    await comparison.update({ requirementsProfile });
    return await this.calculateFitScores(comparisonId);
  }

  async getSideBySideTable(comparisonId) {
    const comparison = await this.comparisonRepo.findById(comparisonId);
    let category = await categoryRepository.findById(comparison.categoryId);
    const items = await comparisonItemRepository.findByComparison(comparisonId);

    if (!items || items.length === 0) {
      return {
        comparisonId,
        title: comparison.title,
        category,
        machines: [],
        rows: [],
      };
    }

    const machineIds = items.map((i) => i.machineId);
    const machines = [];
    for (const id of machineIds) {
      const m = await machineRepository.findWithDetails(id).catch(() => null);
      if (m) machines.push(m);
    }

    // 1. Resolve Category & Title based on real compared machines
    if (machines.length > 0) {
      const modelNames = machines.map((m) => m.modelName).filter(Boolean);
      const realTitle = modelNames.length > 1 ? modelNames.join(' vs ') : (modelNames[0] ? `${modelNames[0]} Spec Alignment` : 'Machinery Spec Comparison');
      
      if (!comparison.title || comparison.title.startsWith('Side-by-Side Comparison') || comparison.title === 'Machinery Comparison') {
        comparison.title = realTitle;
        await comparison.update({ title: realTitle }).catch(() => null);
      }

      if (machines[0].category) {
        category = machines[0].category;
        if (comparison.categoryId !== machines[0].categoryId) {
          await comparison.update({ categoryId: machines[0].categoryId }).catch(() => null);
        }
      }
    }

    // 2. Category Attribute Template Resolution:
    // If category has configured CategoryAttributeTemplate -> use template attributes strictly.
    // If new/unconfigured category -> dynamically use attributes present on compared machines.
    const templates = await categoryAttributeTemplateRepository.findByCategoryId(comparison.categoryId);
    const categoryAttrIds = (templates || []).map((t) => t.attributeId);

    let attributesToDisplay = [];
    if (categoryAttrIds.length > 0) {
      const attrRecords = await AttributeMaster.findAll({
        where: { id: categoryAttrIds },
      });
      // Maintain exact category template displayOrder
      attributesToDisplay = categoryAttrIds
        .map((attrId) => attrRecords.find((a) => a.id === attrId))
        .filter(Boolean);
    } else {
      // Fallback for unconfigured / new machinery categories
      const machineSpecAttrIds = Array.from(
        new Set(
          machines.flatMap((m) =>
            m.specifications ? m.specifications.map((s) => s.attributeId) : []
          )
        )
      );

      if (machineSpecAttrIds.length > 0) {
        attributesToDisplay = await AttributeMaster.findAll({
          where: { id: machineSpecAttrIds },
        });
      }
    }

    const metadataExcludeRegex = /customer|quotation|quote|signatory|authorized|address|phone|email|model|variant|vendor|manufacturer|date|price|cost|warranty|delivery|terms|gst|tax|payment|page|category|serial/i;

    const rows = [];
    for (const attribute of attributesToDisplay) {
      if (!attribute || metadataExcludeRegex.test(attribute.code) || metadataExcludeRegex.test(attribute.name)) {
        continue;
      }

      const rowValues = [];
      let bestMachineId = null;
      let bestVal = attribute.higherIsBetter ? -Infinity : Infinity;
      let validValCount = 0;

      for (const m of machines) {
        const spec = m.specifications
          ? m.specifications.find((s) => s.attributeId === attribute.id)
          : null;

        const rawValue = spec && spec.rawValue ? spec.rawValue : 'N/A';
        const normVal = spec && spec.normalizedValue !== null && spec.normalizedValue !== undefined ? spec.normalizedValue : null;

        if (normVal !== null && !isNaN(normVal)) {
          validValCount++;
          if (attribute.higherIsBetter === true) {
            if (normVal > bestVal) {
              bestVal = normVal;
              bestMachineId = m.id;
            }
          } else if (attribute.higherIsBetter === false) {
            if (normVal < bestVal) {
              bestVal = normVal;
              bestMachineId = m.id;
            }
          }
        }

        rowValues.push({
          machineId: m.id,
          rawValue,
          normalizedValue: normVal,
        });
      }

      // Only mark bestMachineId if at least 2 machines have valid numeric specs to compare
      if (validValCount < 2 || attribute.higherIsBetter === null || attribute.higherIsBetter === undefined) {
        bestMachineId = null;
      }

      rows.push({
        attributeId: attribute.id,
        attributeName: attribute.name,
        attributeCode: attribute.code,
        standardUnit: attribute.standardUnit,
        higherIsBetter: attribute.higherIsBetter,
        bestMachineId,
        values: rowValues,
      });
    }

    return {
      comparisonId,
      title: comparison.title,
      category,
      machines,
      rows,
    };
  }

  async calculateFitScores(comparisonId) {
    const table = await this.getSideBySideTable(comparisonId);
    const comparison = await this.comparisonRepo.findById(comparisonId);
    const userRequirements = comparison.requirementsProfile || {};

    if (table.machines.length === 0) return [];

    const scores = table.machines.map((m) => {
      let totalWeightedScore = 0;
      let totalWeight = 0;

      for (const row of table.rows) {
        const req = userRequirements[row.attributeCode] || {};
        const weight = req.weight !== undefined ? req.weight : 1.0;
        const targetValue = req.targetValue;

        const machineValObj = row.values.find((v) => v.machineId === m.id);
        const normVal = machineValObj ? machineValObj.normalizedValue : null;

        if (normVal !== null && normVal !== undefined && targetValue) {
          let diff = Math.abs(normVal - targetValue);
          let score = Math.max(0, 100 - (diff / targetValue) * 100);
          totalWeightedScore += score * weight;
          totalWeight += weight;
        } else if (normVal !== null && normVal !== undefined) {
          let score = m.id === row.bestMachineId ? 100 : 70;
          totalWeightedScore += score * weight;
          totalWeight += weight;
        }
      }

      const finalFitScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 75;

      return {
        machineId: m.id,
        modelName: m.modelName,
        variant: m.variant,
        fitScore: finalFitScore,
      };
    });

    return scores.sort((a, b) => b.fitScore - a.fitScore);
  }

  async getComparisonDetails(id) {
    const comparison = await this.comparisonRepo.findById(id);
    const items = await comparisonItemRepository.findByComparison(id);
    return { ...comparison.toJSON(), items };
  }

  async getUserComparisons(userId) {
    const list = await this.comparisonRepo.findByUser(userId);
    return this.sanitizeComparisonList(list);
  }

  async getAllSystemComparisons(options = {}) {
    const list = await this.comparisonRepo.findAllSystemComparisons(options);
    return this.sanitizeComparisonList(list);
  }

  sanitizeComparisonList(list = []) {
    return list.map((item) => {
      const comp = item.toJSON ? item.toJSON() : item;
      const modelNames = comp.items ? comp.items.map((i) => i.machine?.modelName).filter(Boolean) : [];
      const realTitle = modelNames.length > 1 ? modelNames.join(' vs ') : (modelNames[0] ? `${modelNames[0]} Spec Alignment` : 'Machinery Spec Comparison');

      if (!comp.title || comp.title.startsWith('Side-by-Side Comparison') || comp.title === 'Machinery Comparison' || comp.title === 'Untitled') {
        comp.title = realTitle;
      }

      if (comp.items && comp.items[0]?.machine?.category) {
        comp.category = comp.items[0].machine.category;
      }

      return comp;
    });
  }
}

export default new ComparisonEngineService();
