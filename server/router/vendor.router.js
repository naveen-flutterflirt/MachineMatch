import { Router } from 'express';
import vendorController from '../controllers/vendor.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createVendorSchema,
  updateVendorSchema,
  verifyVendorSchema,
} from '../validators/vendor.validator.js';

const router = Router();

// Public Routes
router.get('/verified', vendorController.getVerified);
router.get('/search', vendorController.search);
router.get('/', vendorController.getAll);
router.get('/:id', vendorController.getById);

// Admin / Vendor Restricted Routes
router.post(
  '/',
  protect,
  restrictTo('admin', 'vendor'),
  validateRequest(createVendorSchema),
  vendorController.createVendor
);
router.patch(
  '/:id/verify',
  protect,
  restrictTo('admin'),
  validateRequest(verifyVendorSchema),
  vendorController.verifyVendor
);
router.patch(
  '/:id',
  protect,
  restrictTo('admin', 'vendor'),
  validateRequest(updateVendorSchema),
  vendorController.updateVendor
);
router.delete('/:id', protect, restrictTo('admin'), vendorController.delete);

export default router;
