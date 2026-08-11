import { BaseRepository } from './base.repository.js';
import SearchLog from '../models/SearchLog.js';
import User from '../models/User.js';
import Machine from '../models/Machine.js';
import Upload from '../models/Upload.js';
import Vendor from '../models/Vendor.js';
import Comparison from '../models/Comparison.js';
import { Sequelize } from 'sequelize';

export class SearchLogRepository extends BaseRepository {
  constructor() {
    super(SearchLog);
  }

  async findByUser(userId, options = {}) {
    return await this.findAll({ userId }, options);
  }

  async getPopularQueries(limit = 10) {
    return await this.model.findAll({
      attributes: [
        'queryText',
        [Sequelize.fn('COUNT', Sequelize.col('query_text')), 'searchCount'],
        [Sequelize.fn('AVG', Sequelize.col('execution_time_ms')), 'avgExecutionTimeMs'],
      ],
      group: ['query_text'],
      order: [[Sequelize.literal('searchCount'), 'DESC']],
      limit: Number(limit),
      raw: true,
    });
  }

  async getAnalyticsSummary() {
    const totalSearches = await this.model.count().catch(() => 0);
    const totalUsers = await User.count().catch(() => 0);
    const totalMachines = await Machine.count().catch(() => 0);
    const totalUploads = await Upload.count().catch(() => 0);
    const totalVendors = await Vendor.count().catch(() => 0);
    const totalComparisons = await Comparison.count().catch(() => 0);

    const avgLatencyResult = await this.model.findOne({
      attributes: [[Sequelize.fn('AVG', Sequelize.col('execution_time_ms')), 'avgLatencyMs']],
      raw: true,
    }).catch(() => null);

    return {
      totalSearches,
      totalUsers,
      totalMachines,
      totalUploads,
      totalVendors,
      totalComparisons,
      avgLatencyMs: avgLatencyResult ? Math.round(Number(avgLatencyResult.avgLatencyMs) || 0) : 0,
    };
  }

  async findWithUser(id, options = {}) {
    return await this.model.findOne({
      where: { id },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }],
      ...options,
    });
  }
}

export default new SearchLogRepository();
