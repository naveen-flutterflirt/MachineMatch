import { BaseController } from './base.controller.js';
import categoryAttributeTemplateService from '../services/categoryAttributeTemplate.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class CategoryAttributeTemplateController extends BaseController {
  constructor() {
    super(categoryAttributeTemplateService, [], ['categoryId', 'attributeId', 'isRequired']);
  }

  assignAttribute = catchAsync(async (req, res) => {
    const data = await categoryAttributeTemplateService.assignAttributeToCategory(req.body);
    res.status(201).json({ success: true, data });
  });

  getByCategoryId = catchAsync(async (req, res) => {
    const data = await categoryAttributeTemplateService.getCategoryTemplates(req.params.categoryId);
    res.status(200).json({ success: true, data });
  });

  removeAttribute = catchAsync(async (req, res) => {
    const { categoryId, attributeId } = req.params;
    await categoryAttributeTemplateService.removeAttributeFromCategory(categoryId, attributeId);
    res.status(200).json({ success: true, message: 'Attribute removed from category template successfully' });
  });
}

export default new CategoryAttributeTemplateController();
