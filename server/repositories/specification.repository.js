import { BaseRepository } from './base.repository.js';
import Specification from '../models/Specification.js';
import AttributeMaster from '../models/AttributeMaster.js';

export class SpecificationRepository extends BaseRepository {
  constructor() {
    super(Specification);
  }

  async findByMachine(machineId, options = {}) {
    return await this.model.findAll({
      where: { machineId },
      include: [{ model: AttributeMaster, as: 'attribute' }],
      ...options,
    });
  }

  async upsertSpecification(machineId, attributeId, specData) {
    const existing = await this.model.findOne({
      where: { machineId, attributeId },
    });

    if (existing) {
      return await existing.update(specData);
    }

    return await this.model.create({
      machineId,
      attributeId,
      ...specData,
    });
  }
}

export default new SpecificationRepository();
