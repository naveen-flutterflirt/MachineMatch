import { Router } from 'express';
import searchLogController from '../controllers/searchLog.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { logQuerySchema } from '../validators/searchLog.validator.js';

const router = Router();

// Log query endpoint (Supports guest or logged in user)
router.post('/', validateRequest(logQuerySchema), searchLogController.logQuery);

// Protected user search history
router.get('/my-history', protect, searchLogController.getMySearches);

// Admin Analytics Dashboard Routes
router.get('/popular', protect, restrictTo('admin'), searchLogController.getPopularQueries);
router.get('/summary', protect, restrictTo('admin'), searchLogController.getAnalyticsSummary);
router.get('/search', protect, restrictTo('admin'), searchLogController.search);
router.get('/', protect, restrictTo('admin'), searchLogController.getAll);
router.get('/:id', protect, restrictTo('admin'), searchLogController.getById);
router.delete('/:id', protect, restrictTo('admin'), searchLogController.delete);

export default router;
