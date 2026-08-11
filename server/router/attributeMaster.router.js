import { Router } from 'express';
import attributeMasterController from '../controllers/attributeMaster.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createAttributeSchema,
  updateAttributeSchema,
} from '../validators/attributeMaster.validator.js';

const router = Router();

// Public Routes
router.get('/code/:code', attributeMasterController.getByCode);
router.get('/search', attributeMasterController.search);
router.get('/', attributeMasterController.getAll);
router.get('/:id', attributeMasterController.getById);

// Admin Restricted Routes
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validateRequest(createAttributeSchema),
  attributeMasterController.createAttribute
);
router.patch(
  '/:id',
  protect,
  restrictTo('admin'),
  validateRequest(updateAttributeSchema),
  attributeMasterController.updateAttribute
);
router.delete('/:id', protect, restrictTo('admin'), attributeMasterController.delete);

export default router;
