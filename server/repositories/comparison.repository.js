import { BaseRepository } from './base.repository.js';
import {
  Comparison,
  ComparisonItem,
  Machine,
  Category,
  Vendor,
  Specification,
  AttributeMaster,
  Price,
  User,
} from '../models/index.js';

export class ComparisonRepository extends BaseRepository {
  constructor() {
    super(Comparison);
  }

  async findWithItemsAndMachines(id, options = {}) {
    return await this.model.findOne({
      where: { id },
      include: [
        { model: Category, as: 'category' },
        {
          model: ComparisonItem,
          as: 'items',
          include: [
            {
              model: Machine,
              as: 'machine',
              include: [
                { model: Vendor, as: 'vendor' },
                {
                  model: Specification,
                  as: 'specifications',
                  include: [{ model: AttributeMaster, as: 'attribute' }],
                },
                { model: Price, as: 'prices' },
              ],
            },
          ],
        },
      ],
      order: [[{ model: ComparisonItem, as: 'items' }, 'displayOrder', 'ASC']],
      ...options,
    });
  }

  async findByUser(userId, options = {}) {
    return await this.findAllSystemComparisons({ where: { userId }, ...options });
  }

  async findAllSystemComparisons(options = {}) {
    return await this.model.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: Category, as: 'category' },
        {
          model: ComparisonItem,
          as: 'items',
          include: [
            {
              model: Machine,
              as: 'machine',
              attributes: ['id', 'modelName', 'variant', 'categoryId'],
              include: [
                { model: Vendor, as: 'vendor', attributes: ['id', 'name'] },
                { model: Category, as: 'category' },
              ],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      ...options,
    });
  }
}

export default new ComparisonRepository();
