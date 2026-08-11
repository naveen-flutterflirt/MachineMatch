import { Router } from 'express';
import comparisonController from '../controllers/comparison.controller.js';
import { protect, optionalAuth, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createComparisonSchema,
  addComparisonItemSchema,
  updateRequirementsProfileSchema,
} from '../validators/comparison.validator.js';

const router = Router();

// Public / Session Routes (Supports both guest and logged-in user comparison creation)
router.post('/', optionalAuth, validateRequest(createComparisonSchema), comparisonController.createComparison);
router.get('/:id/table', comparisonController.getSideBySideTable);
router.get('/:id/scores', comparisonController.calculateScores);

// Protected User / Admin Routes
router.get('/user/my-comparisons', protect, comparisonController.getMyComparisons);
router.get('/', protect, restrictTo('admin'), comparisonController.getAll);
router.get('/:id', comparisonController.getById);

router.post(
  '/:id/items',
  optionalAuth,
  validateRequest(addComparisonItemSchema),
  comparisonController.addMachine
);
router.delete('/:id/items/:machineId', optionalAuth, comparisonController.removeMachine);
router.patch(
  '/:id/requirements',
  optionalAuth,
  validateRequest(updateRequirementsProfileSchema),
  comparisonController.updateRequirements
);
router.delete('/:id', protect, comparisonController.delete);

export default router;
