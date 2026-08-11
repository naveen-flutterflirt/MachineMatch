import { BaseService } from './base.service.js';
import categoryAttributeTemplateRepository from '../repositories/categoryAttributeTemplate.repository.js';
import categoryRepository from '../repositories/category.repository.js';
import attributeMasterRepository from '../repositories/attributeMaster.repository.js';
import { AppError } from '../utils/AppError.js';

export class CategoryAttributeTemplateService extends BaseService {
  constructor() {
    super(categoryAttributeTemplateRepository);
    this.templateRepo = categoryAttributeTemplateRepository;
  }

  async assignAttributeToCategory(data) {
    const { categoryId, attributeId, isRequired, displayOrder, unitOptions } = data;

    await categoryRepository.findById(categoryId);
    await attributeMasterRepository.findById(attributeId);

    const existing = await this.templateRepo.findTemplate(categoryId, attributeId);
    if (existing) {
      return await existing.update({
        isRequired: isRequired !== undefined ? isRequired : existing.isRequired,
        displayOrder: displayOrder !== undefined ? displayOrder : existing.displayOrder,
        unitOptions: unitOptions || existing.unitOptions,
      });
    }

    return await this.templateRepo.create({
      categoryId,
      attributeId,
      isRequired: isRequired || false,
      displayOrder: displayOrder || 0,
      unitOptions: unitOptions || [],
    });
  }

  async getCategoryTemplates(categoryId) {
    await categoryRepository.findById(categoryId);
    return await this.templateRepo.findByCategoryId(categoryId);
  }

  async removeAttributeFromCategory(categoryId, attributeId) {
    const template = await this.templateRepo.findTemplate(categoryId, attributeId);
    if (!template) {
      throw new AppError('Attribute template mapping not found for this category.', 404);
    }
    return await template.destroy();
  }
}

export default new CategoryAttributeTemplateService();
