import { BaseRepository } from './base.repository.js';
import {
  Machine,
  Category,
  Vendor,
  MachineMedia,
  Specification,
  AttributeMaster,
  Price,
} from '../models/index.js';

export class MachineRepository extends BaseRepository {
  constructor() {
    super(Machine);
  }

  async findWithDetails(id, options = {}) {
    return await this.model.findOne({
      where: { id },
      include: [
        { model: Category, as: 'category' },
        { model: Vendor, as: 'vendor' },
        { model: MachineMedia, as: 'media' },
        {
          model: Specification,
          as: 'specifications',
          include: [{ model: AttributeMaster, as: 'attribute' }],
        },
        { model: Price, as: 'prices' },
      ],
      ...options,
    });
  }

  async searchCatalog(searchTerm = '', filters = {}, options = {}) {
    const defaultInclude = [
      { model: Category, as: 'category' },
      { model: Vendor, as: 'vendor' },
      { model: MachineMedia, as: 'media', where: { isPrimary: true }, required: false },
      { model: Price, as: 'prices', required: false },
    ];

    return await this.search(searchTerm, ['modelName', 'variant'], {
      filters,
      include: options.include || defaultInclude,
      ...options,
    });
  }

  async findByVendor(vendorId, options = {}) {
    return await this.findAll({ vendorId }, options);
  }

  async findByCategory(categoryId, options = {}) {
    return await this.findAll({ categoryId, status: 'published' }, options);
  }
}

export default new MachineRepository();
