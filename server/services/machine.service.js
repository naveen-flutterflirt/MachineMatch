import { BaseService } from './base.service.js';
import machineRepository from '../repositories/machine.repository.js';
import categoryRepository from '../repositories/category.repository.js';
import vendorRepository from '../repositories/vendor.repository.js';
import machineMediaRepository from '../repositories/machineMedia.repository.js';
import specificationRepository from '../repositories/specification.repository.js';
import priceRepository from '../repositories/price.repository.js';
import { AppError } from '../utils/AppError.js';

export class MachineService extends BaseService {
  constructor() {
    super(machineRepository);
    this.machineRepo = machineRepository;
  }

  async createMachine(data) {
    const { categoryId, vendorId, modelName, variant, manufacturingYear, isFeatured } = data;

    await categoryRepository.findById(categoryId);
    if (vendorId) {
      await vendorRepository.findById(vendorId);
    }

    return await this.machineRepo.create({
      categoryId,
      vendorId: vendorId || null,
      modelName,
      variant,
      manufacturingYear,
      status: 'published',
      isFeatured: isFeatured || false,
    });
  }

  async updateMachine(id, data) {
    await this.machineRepo.findById(id);

    if (data.categoryId) {
      await categoryRepository.findById(data.categoryId);
    }
    if (data.vendorId) {
      await vendorRepository.findById(data.vendorId);
    }

    return await this.machineRepo.update(id, data);
  }

  async updateStatus(id, status, rejectionReason = null) {
    const machine = await this.machineRepo.findById(id);

    const validStatuses = [
      'draft',
      'pending_review',
      'under_review',
      'approved',
      'published',
      'rejected',
      'archived',
    ];

    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status '${status}'`, 400);
    }

    const updateData = { status };
    if (status === 'rejected') {
      updateData.rejectionReason = rejectionReason || 'Requirements not met.';
    }

    return await machine.update(updateData);
  }

  async getMachineDetails(id) {
    const machine = await this.machineRepo.findWithDetails(id);
    if (!machine) {
      throw new AppError(`Machine with ID '${id}' not found`, 404);
    }
    return machine;
  }

  // --- Media Sub-Service Helpers ---
  async addMedia(machineId, mediaData) {
    await this.machineRepo.findById(machineId);

    if (mediaData.isPrimary) {
      await machineMediaRepository.unsetPrimary(machineId);
    }

    return await machineMediaRepository.create({
      machineId,
      ...mediaData,
    });
  }

  async getMedia(machineId) {
    await this.machineRepo.findById(machineId);
    return await machineMediaRepository.findByMachine(machineId);
  }

  async deleteMedia(mediaId) {
    return await machineMediaRepository.delete(mediaId);
  }

  // --- Specification Sub-Service Helpers ---
  async setSpecification(machineId, specData) {
    await this.machineRepo.findById(machineId);
    const { attributeId, rawValue, rawUnit, normalizedValue, normalizedUnit, source, confidenceScore } = specData;

    return await specificationRepository.upsertSpecification(machineId, attributeId, {
      rawValue,
      rawUnit,
      normalizedValue,
      normalizedUnit,
      source: source || 'manual',
      confidenceScore: confidenceScore || 1.0,
    });
  }

  async getSpecifications(machineId) {
    await this.machineRepo.findById(machineId);
    return await specificationRepository.findByMachine(machineId);
  }

  // --- Price Sub-Service Helpers ---
  async addPrice(machineId, priceData) {
    await this.machineRepo.findById(machineId);
    return await priceRepository.create({
      machineId,
      ...priceData,
    });
  }

  async getPrices(machineId) {
    await this.machineRepo.findById(machineId);
    return await priceRepository.findByMachine(machineId);
  }
}

export default new MachineService();
