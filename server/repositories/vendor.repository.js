import { BaseRepository } from './base.repository.js';
import Vendor from '../models/Vendor.js';

export class VendorRepository extends BaseRepository {
  constructor() {
    super(Vendor);
  }

  async findByName(name, options = {}) {
    return await this.model.findOne({
      where: { name: String(name).trim() },
      ...options,
    });
  }

  async isTaxIdTaken(taxId, excludeId = null) {
    if (!taxId) return false;
    const where = { taxId: String(taxId).trim() };
    if (excludeId) {
      where.id = { [this.model.sequelize.Sequelize.Op.ne]: excludeId };
    }
    const count = await this.model.count({ where });
    return count > 0;
  }

  async getVerifiedVendors(options = {}) {
    return await this.model.findAll({
      where: { isVerified: true },
      order: [['rating', 'DESC'], ['name', 'ASC']],
      ...options,
    });
  }
}

export default new VendorRepository();
