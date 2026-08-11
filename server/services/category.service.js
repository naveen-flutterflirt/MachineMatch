import { BaseService } from './base.service.js';
import categoryRepository from '../repositories/category.repository.js';
import { AppError } from '../utils/AppError.js';

const generateSlug = (text) => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export class CategoryService extends BaseService {
  constructor() {
    super(categoryRepository);
    this.categoryRepo = categoryRepository;
  }

  async createCategory(data) {
    const { name, slug: customSlug, parentId, description, iconUrl } = data;

    const slug = customSlug ? generateSlug(customSlug) : generateSlug(name);

    const slugTaken = await this.categoryRepo.isSlugTaken(slug);
    if (slugTaken) {
      throw new AppError(`Category with slug '${slug}' already exists.`, 400);
    }

    if (parentId) {
      await this.categoryRepo.findById(parentId);
    }

    return await this.categoryRepo.create({
      name,
      slug,
      parentId: parentId || null,
      description,
      iconUrl,
      isActive: true,
    });
  }

  async updateCategory(id, data) {
    const category = await this.categoryRepo.findById(id);

    if (data.slug || data.name) {
      const newSlug = data.slug ? generateSlug(data.slug) : generateSlug(data.name || category.name);
      const slugTaken = await this.categoryRepo.isSlugTaken(newSlug, id);
      if (slugTaken) {
        throw new AppError(`Category with slug '${newSlug}' already exists.`, 400);
      }
      data.slug = newSlug;
    }

    return await this.categoryRepo.update(id, data);
  }

  async getCategoryBySlug(slug) {
    const category = await this.categoryRepo.findBySlug(slug);
    if (!category) {
      throw new AppError(`Category with slug '${slug}' not found`, 404);
    }
    return category;
  }

  async getCategoryTree() {
    return await this.categoryRepo.findTree();
  }
}

export default new CategoryService();
