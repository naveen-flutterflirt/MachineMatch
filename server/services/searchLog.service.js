import { BaseService } from './base.service.js';
import searchLogRepository from '../repositories/searchLog.repository.js';
import { AppError } from '../utils/AppError.js';

export class SearchLogService extends BaseService {
  constructor() {
    super(searchLogRepository);
    this.searchLogRepo = searchLogRepository;
  }

  async logSearchQuery(data, userId = null, userIp = null) {
    const { queryText, searchType, parsedFilters, resultCount, executionTimeMs } = data;

    if (!queryText) {
      throw new AppError('Query text is required for search logging.', 400);
    }

    return await this.searchLogRepo.create({
      userId: userId || null,
      queryText: String(queryText).trim(),
      searchType: searchType || 'nlp_ai',
      parsedFilters: parsedFilters || {},
      resultCount: resultCount || 0,
      executionTimeMs: executionTimeMs || 0,
      userIp: userIp || null,
    });
  }

  async getPopularQueries(limit = 10) {
    return await this.searchLogRepo.getPopularQueries(limit);
  }

  async getAnalyticsSummary() {
    return await this.searchLogRepo.getAnalyticsSummary();
  }

  async getUserSearchHistory(userId) {
    return await this.searchLogRepo.findByUser(userId);
  }
}

export default new SearchLogService();
