import aiSearchService from '../services/aiSearch.service.js';
import machineEmbeddingService from '../services/machineEmbedding.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class AISearchController {
  nlpSearch = catchAsync(async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const userIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const data = await aiSearchService.processNLPSearch(req.body.queryText, userId, userIp);
    res.status(200).json({ success: true, data });
  });

  generateEmbedding = catchAsync(async (req, res) => {
    const data = await machineEmbeddingService.generateMachineEmbedding(req.body.machineId);
    res.status(200).json({ success: true, message: 'Vector embedding generated successfully', data });
  });

  getSimilarMachines = catchAsync(async (req, res) => {
    const limit = req.query.limit || 5;
    const data = await machineEmbeddingService.findSimilarMachines(req.params.machineId, limit);
    res.status(200).json({ success: true, data });
  });
}

export default new AISearchController();
