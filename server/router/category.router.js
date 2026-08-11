import { Router } from 'express';
import categoryController from '../controllers/category.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validator.js';

const router = Router();

// Public Routes
router.get('/tree', categoryController.getTree);
router.get('/slug/:slug', categoryController.getBySlug);
router.get('/search', categoryController.search);
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin Restricted Routes
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validateRequest(createCategorySchema),
  categoryController.createCategory
);
router.patch(
  '/:id',
  protect,
  restrictTo('admin'),
  validateRequest(updateCategorySchema),
  categoryController.updateCategory
);
router.delete('/:id', protect, restrictTo('admin'), categoryController.delete);

export default router;
