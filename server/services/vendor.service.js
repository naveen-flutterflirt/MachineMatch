import { BaseService } from './base.service.js';
import vendorRepository from '../repositories/vendor.repository.js';
import { AppError } from '../utils/AppError.js';

export class VendorService extends BaseService {
  constructor() {
    super(vendorRepository);
    this.vendorRepo = vendorRepository;
  }

  async createVendor(data) {
    const { taxId, companyRegistrationNo } = data;

    if (taxId) {
      const taxTaken = await this.vendorRepo.isTaxIdTaken(taxId);
      if (taxTaken) {
        throw new AppError(`Vendor with tax ID '${taxId}' already exists.`, 400);
      }
    }

    return await this.vendorRepo.create({
      ...data,
      isVerified: data.isVerified || false,
      rating: data.rating || 0.0,
    });
  }

  async updateVendor(id, data) {
    await this.vendorRepo.findById(id);

    if (data.taxId) {
      const taxTaken = await this.vendorRepo.isTaxIdTaken(data.taxId, id);
      if (taxTaken) {
        throw new AppError(`Vendor with tax ID '${data.taxId}' already exists.`, 400);
      }
    }

    return await this.vendorRepo.update(id, data);
  }

  async verifyVendor(id, isVerified = true) {
    const vendor = await this.vendorRepo.findById(id);
    return await vendor.update({ isVerified });
  }

  async getVerifiedVendors() {
    return await this.vendorRepo.getVerifiedVendors();
  }
}

export default new VendorService();
