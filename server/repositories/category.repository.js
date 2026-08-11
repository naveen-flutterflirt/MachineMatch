import { BaseRepository } from './base.repository.js';
import Category from '../models/Category.js';

export class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  async findBySlug(slug, options = {}) {
    return await this.model.findOne({
      where: { slug: String(slug).toLowerCase().trim() },
      ...options,
    });
  }

  async isSlugTaken(slug, excludeId = null) {
    const where = { slug: String(slug).toLowerCase().trim() };
    if (excludeId) {
      where.id = { [this.model.sequelize.Sequelize.Op.ne]: excludeId };
    }
    const count = await this.model.count({ where });
    return count > 0;
  }

  async findTree(options = {}) {
    return await this.model.findAll({
      where: { parentId: null },
      include: [{ model: Category, as: 'subcategories' }],
      order: [['name', 'ASC']],
      ...options,
    });
  }
}

export default new CategoryRepository();
