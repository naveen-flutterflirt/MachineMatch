import { BaseController } from './base.controller.js';
import categoryService from '../services/category.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class CategoryController extends BaseController {
  constructor() {
    super(categoryService, ['name', 'slug', 'description'], ['isActive', 'parentId']);
  }

  createCategory = catchAsync(async (req, res) => {
    const data = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data });
  });

  updateCategory = catchAsync(async (req, res) => {
    const data = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  });

  getBySlug = catchAsync(async (req, res) => {
    const data = await categoryService.getCategoryBySlug(req.params.slug);
    res.status(200).json({ success: true, data });
  });

  getTree = catchAsync(async (req, res) => {
    const data = await categoryService.getCategoryTree();
    res.status(200).json({ success: true, data });
  });
}

export default new CategoryController();
