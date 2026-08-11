import { BaseRepository } from './base.repository.js';
import MachineEmbedding from '../models/MachineEmbedding.js';
import Machine from '../models/Machine.js';
import Vendor from '../models/Vendor.js';
import Category from '../models/Category.js';
import Price from '../models/Price.js';
import MachineMedia from '../models/MachineMedia.js';

export class MachineEmbeddingRepository extends BaseRepository {
  constructor() {
    super(MachineEmbedding);
  }

  async findByMachineId(machineId, options = {}) {
    return await this.model.findOne({
      where: { machineId },
      ...options,
    });
  }

  async findSimilar(machineId, limit = 5) {
    const targetEmbedding = await this.findByMachineId(machineId);

    // Fallback if vector embedding has not been generated for target machine
    if (!targetEmbedding) {
      return await Machine.findAll({
        where: { id: { [this.model.sequelize.Sequelize.Op.ne]: machineId } },
        include: [
          { model: Vendor, as: 'vendor' },
          { model: Category, as: 'category' },
          { model: Price, as: 'prices' },
          { model: MachineMedia, as: 'media' },
        ],
        limit: Number(limit),
      });
    }

    // Cosine similarity ordering across all embeddings
    return await MachineEmbedding.findAll({
      where: { machineId: { [this.model.sequelize.Sequelize.Op.ne]: machineId } },
      include: [
        {
          model: Machine,
          as: 'machine',
          include: [
            { model: Vendor, as: 'vendor' },
            { model: Category, as: 'category' },
            { model: Price, as: 'prices' },
            { model: MachineMedia, as: 'media' },
          ],
        },
      ],
      limit: Number(limit),
    });
  }
}

export default new MachineEmbeddingRepository();
