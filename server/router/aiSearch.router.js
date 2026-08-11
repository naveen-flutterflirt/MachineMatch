import { Router } from 'express';
import aiSearchController from '../controllers/aiSearch.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { nlpSearchSchema, generateEmbeddingSchema } from '../validators/aiSearch.validator.js';

const router = Router();

// Public NLP AI Search
router.post('/search', validateRequest(nlpSearchSchema), aiSearchController.nlpSearch);
router.get('/similar/:machineId', aiSearchController.getSimilarMachines);

// Admin / System Vector Embedding Generation
router.post(
  '/generate-embedding',
  protect,
  restrictTo('admin'),
  validateRequest(generateEmbeddingSchema),
  aiSearchController.generateEmbedding
);

export default router;
