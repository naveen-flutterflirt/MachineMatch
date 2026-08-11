import { Router } from 'express';
import categoryAttributeTemplateController from '../controllers/categoryAttributeTemplate.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { assignTemplateSchema } from '../validators/categoryAttributeTemplate.validator.js';

const router = Router();

// Public Routes
router.get('/category/:categoryId', categoryAttributeTemplateController.getByCategoryId);
router.get('/search', categoryAttributeTemplateController.search);
router.get('/', categoryAttributeTemplateController.getAll);
router.get('/:id', categoryAttributeTemplateController.getById);

// Admin Restricted Routes
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validateRequest(assignTemplateSchema),
  categoryAttributeTemplateController.assignAttribute
);
router.delete(
  '/category/:categoryId/attribute/:attributeId',
  protect,
  restrictTo('admin'),
  categoryAttributeTemplateController.removeAttribute
);
router.delete('/:id', protect, restrictTo('admin'), categoryAttributeTemplateController.delete);

export default router;
