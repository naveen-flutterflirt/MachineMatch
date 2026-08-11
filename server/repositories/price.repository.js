import { BaseRepository } from './base.repository.js';
import Price from '../models/Price.js';

export class PriceRepository extends BaseRepository {
  constructor() {
    super(Price);
  }

  async findByMachine(machineId, options = {}) {
    return await this.model.findAll({
      where: { machineId },
      order: [['priceType', 'ASC']],
      ...options,
    });
  }
}

export default new PriceRepository();
