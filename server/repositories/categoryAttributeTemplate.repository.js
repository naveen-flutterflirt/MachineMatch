import { BaseRepository } from './base.repository.js';
import CategoryAttributeTemplate from '../models/CategoryAttributeTemplate.js';
import AttributeMaster from '../models/AttributeMaster.js';

export class CategoryAttributeTemplateRepository extends BaseRepository {
  constructor() {
    super(CategoryAttributeTemplate);
  }

  async findByCategoryId(categoryId, options = {}) {
    return await this.model.findAll({
      where: { categoryId },
      include: [{ model: AttributeMaster, as: 'attribute' }],
      order: [['displayOrder', 'ASC']],
      ...options,
    });
  }

  async findTemplate(categoryId, attributeId) {
    return await this.model.findOne({
      where: { categoryId, attributeId },
    });
  }
}

export default new CategoryAttributeTemplateRepository();
