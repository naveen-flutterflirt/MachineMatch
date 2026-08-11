import { BaseRepository } from './base.repository.js';
import MachineMedia from '../models/MachineMedia.js';

export class MachineMediaRepository extends BaseRepository {
  constructor() {
    super(MachineMedia);
  }

  async findByMachine(machineId, options = {}) {
    return await this.model.findAll({
      where: { machineId },
      order: [['displayOrder', 'ASC']],
      ...options,
    });
  }

  async unsetPrimary(machineId) {
    return await this.model.update({ isPrimary: false }, { where: { machineId } });
  }
}

export default new MachineMediaRepository();
