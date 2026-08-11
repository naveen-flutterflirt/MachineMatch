import { Router } from 'express';
import uploadController from '../controllers/upload.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { uploadSingle, uploadMultiple } from '../middlewares/upload.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { updateUploadStatusSchema } from '../validators/upload.validator.js';

const router = Router();

// Upload Single File (Protected)
router.post('/', protect, uploadSingle, uploadController.uploadFile);

// Upload Multiple Files simultaneously (Protected - Up to 10 PDF brochures at once)
router.post('/batch', protect, uploadMultiple, uploadController.uploadMultipleFiles);

// User upload history
router.get('/my-uploads', protect, uploadController.getMyUploads);

// Admin / System OCR Pipeline Routes
router.get('/pending', protect, restrictTo('admin'), uploadController.getPending);
router.get('/search', protect, restrictTo('admin'), uploadController.search);
router.get('/', protect, restrictTo('admin'), uploadController.getAll);
router.get('/:id/details', protect, restrictTo('admin'), uploadController.getWithUploader);
router.get('/:id', protect, uploadController.getById);

router.patch(
  '/:id/status',
  protect,
  restrictTo('admin'),
  validateRequest(updateUploadStatusSchema),
  uploadController.updateStatus
);

router.delete('/:id', protect, restrictTo('admin'), uploadController.delete);

export default router;
