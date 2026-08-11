import { Router } from 'express';
import machineController from '../controllers/machine.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createMachineSchema,
  updateMachineSchema,
  updateMachineStatusSchema,
  addMediaSchema,
  addSpecificationSchema,
  addPriceSchema,
} from '../validators/machine.validator.js';

const router = Router();

// --- Public Routes ---
router.get('/search', machineController.search);
router.get('/', machineController.getAll);
router.get('/:id/details', machineController.getDetails);
router.get('/:id/media', machineController.getMedia);
router.get('/:id/specifications', machineController.getSpecifications);
router.get('/:id/prices', machineController.getPrices);
router.get('/:id', machineController.getById);

// --- Protected User / Admin Machine Routes ---
router.post(
  '/',
  protect,
  validateRequest(createMachineSchema),
  machineController.createMachine
);

router.patch(
  '/:id/status',
  protect,
  restrictTo('admin'),
  validateRequest(updateMachineStatusSchema),
  machineController.updateStatus
);

router.patch(
  '/:id',
  protect,
  validateRequest(updateMachineSchema),
  machineController.updateMachine
);

// --- Media Attachment Routes ---
router.post(
  '/:id/media',
  protect,
  validateRequest(addMediaSchema),
  machineController.addMedia
);

router.delete('/media/:mediaId', protect, machineController.deleteMedia);

// --- Specification Routes ---
router.post(
  '/:id/specifications',
  protect,
  validateRequest(addSpecificationSchema),
  machineController.setSpecification
);

// --- Price Routes ---
router.post(
  '/:id/prices',
  protect,
  validateRequest(addPriceSchema),
  machineController.addPrice
);

router.delete('/:id', protect, restrictTo('admin'), machineController.delete);

export default router;
