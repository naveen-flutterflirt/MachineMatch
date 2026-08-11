import aiProvider from './ai/AIProviderFactory.js';
import machineRepository from '../repositories/machine.repository.js';
import searchLogRepository from '../repositories/searchLog.repository.js';

export class AISearchService {
  async processNLPSearch(queryText, userId = null, userIp = null) {
    const startTime = Date.now();

    // 1. Pluggable AI layer translates plain language into SQL parameters
    const parsedFilters = await aiProvider.parseNaturalLanguageQuery(queryText);

    // 2. Query execution against catalog repository
    const searchResult = await machineRepository.searchCatalog(
      parsedFilters.rawQuery || queryText,
      {},
      { page: 1, limit: 10 }
    );

    const executionTimeMs = Date.now() - startTime;

    // 3. Log search query analytics silently
    await searchLogRepository.create({
      userId: userId || null,
      queryText,
      searchType: 'nlp_ai',
      parsedFilters,
      resultCount: searchResult.total,
      executionTimeMs,
      userIp: userIp || null,
    });

    return {
      queryText,
      parsedFilters,
      executionTimeMs,
      result: searchResult,
    };
  }
}

export default new AISearchService();
