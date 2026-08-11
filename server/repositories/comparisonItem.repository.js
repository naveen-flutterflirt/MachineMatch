import { BaseRepository } from './base.repository.js';
import ComparisonItem from '../models/ComparisonItem.js';

export class ComparisonItemRepository extends BaseRepository {
  constructor() {
    super(ComparisonItem);
  }

  async findByComparison(comparisonId, options = {}) {
    return await this.model.findAll({
      where: { comparisonId },
      ...options,
    });
  }

  async findItem(comparisonId, machineId) {
    return await this.model.findOne({
      where: { comparisonId, machineId },
    });
  }

  async countItems(comparisonId) {
    return await this.model.count({ where: { comparisonId } });
  }

  async deleteByComparisonAndMachine(comparisonId, machineId) {
    return await this.model.destroy({
      where: { comparisonId, machineId },
    });
  }
}

export default new ComparisonItemRepository();
