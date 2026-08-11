import { Router } from 'express';
import quoteRequestController from '../controllers/quoteRequest.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createQuoteRequestSchema,
  updateQuoteStatusSchema,
} from '../validators/quoteRequest.validator.js';

const router = Router();

// Public / Buyer Quote Submission (Supports logged in or guest submission)
router.post('/', validateRequest(createQuoteRequestSchema), quoteRequestController.createQuote);

// Protected Buyer Routes
router.get('/my-quotes', protect, quoteRequestController.getBuyerQuotes);

// Protected Vendor Lead Routes
router.get(
  '/vendor/:vendorId',
  protect,
  restrictTo('admin', 'vendor'),
  quoteRequestController.getVendorQuotes
);

// Detail & Status Updates
router.get('/:id/details', protect, quoteRequestController.getDetails);
router.get('/search', protect, restrictTo('admin'), quoteRequestController.search);
router.get('/', protect, restrictTo('admin'), quoteRequestController.getAll);
router.get('/:id', protect, quoteRequestController.getById);

router.patch(
  '/:id/status',
  protect,
  restrictTo('admin', 'vendor'),
  validateRequest(updateQuoteStatusSchema),
  quoteRequestController.updateStatus
);

router.delete('/:id', protect, restrictTo('admin'), quoteRequestController.delete);

export default router;
