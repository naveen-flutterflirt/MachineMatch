import { BaseRepository } from './base.repository.js';
import AttributeMaster from '../models/AttributeMaster.js';

export class AttributeMasterRepository extends BaseRepository {
  constructor() {
    super(AttributeMaster);
  }

  async findByCode(code, options = {}) {
    return await this.model.findOne({
      where: { code: String(code).toLowerCase().trim() },
      ...options,
    });
  }

  async isCodeTaken(code, excludeId = null) {
    const where = { code: String(code).toLowerCase().trim() };
    if (excludeId) {
      where.id = { [this.model.sequelize.Sequelize.Op.ne]: excludeId };
    }
    const count = await this.model.count({ where });
    return count > 0;
  }
}

export default new AttributeMasterRepository();
