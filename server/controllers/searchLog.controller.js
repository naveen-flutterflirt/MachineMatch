import { BaseController } from './base.controller.js';
import searchLogService from '../services/searchLog.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class SearchLogController extends BaseController {
  constructor() {
    super(searchLogService, ['queryText', 'searchType'], ['searchType', 'userId']);
  }

  logQuery = catchAsync(async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const userIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const data = await searchLogService.logSearchQuery(req.body, userId, userIp);
    res.status(201).json({ success: true, data });
  });

  getPopularQueries = catchAsync(async (req, res) => {
    const limit = req.query.limit || 10;
    const data = await searchLogService.getPopularQueries(limit);
    res.status(200).json({ success: true, data });
  });

  getAnalyticsSummary = catchAsync(async (req, res) => {
    const data = await searchLogService.getAnalyticsSummary();
    res.status(200).json({ success: true, data });
  });

  getMySearches = catchAsync(async (req, res) => {
    const data = await searchLogService.getUserSearchHistory(req.user.id);
    res.status(200).json({ success: true, data });
  });
}

export default new SearchLogController();
