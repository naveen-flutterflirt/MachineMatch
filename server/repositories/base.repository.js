import { Op } from 'sequelize';
import { AppError } from '../utils/AppError.js';

const toPositiveInteger = (value, fallback) => {
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

export class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('BaseRepository requires a valid Sequelize model.');
    }
    this.model = model;
  }

  /**
   * Find a single record by ID with optional options (includes, attributes, transaction)
   */
  async findById(id, options = {}) {
    const queryOptions = Array.isArray(options) ? { include: options } : options;

    const record = await this.model.findOne({
      where: { id },
      ...queryOptions,
    });

    if (!record) {
      throw new AppError(`${this.model.name} with ID '${id}' not found`, 404);
    }
    return record;
  }

  /**
   * Find all records matching a filter object with options
   */
  async findAll(filter = {}, options = {}) {
    const where = filter && filter.where ? filter.where : filter;
    const queryOptions = Array.isArray(options) ? { include: options } : options;

    return await this.model.findAll({
      where,
      ...queryOptions,
    });
  }

  /**
   * Comprehensive search with text search, dynamic filters, pagination, and sorting
   */
  async search(searchTerm = '', searchableFields = [], options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      where: extraWhere = {},
      include = [],
    } = options;

    const parsedPage = toPositiveInteger(page, 1);
    const parsedLimit = Math.min(toPositiveInteger(limit, 10), 100);
    const offset = (parsedPage - 1) * parsedLimit;

    const searchConditions = [];

    if (searchTerm && searchableFields.length > 0) {
      const term = `%${searchTerm.trim()}%`;
      searchableFields.forEach((field) => {
        searchConditions.push({ [field]: { [Op.iLike]: term } });
      });
    }

    const whereClause = {
      ...extraWhere,
      ...(searchConditions.length > 0 ? { [Op.or]: searchConditions } : {}),
    };

    const { rows, count } = await this.model.findAndCountAll({
      where: whereClause,
      include,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parsedLimit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(count / parsedLimit),
    };
  }

  async findOne(filter = {}, options = {}) {
    const where = filter && filter.where ? filter.where : filter;
    const queryOptions = Array.isArray(options) ? { include: options } : options;
    return await this.model.findOne({
      where,
      ...queryOptions,
    });
  }

  async create(data, options = {}) {
    return await this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    const record = await this.findById(id);
    return await record.update(data, options);
  }

  async delete(id, options = {}) {
    const record = await this.findById(id);
    await record.destroy(options);
    return true;
  }
}

export default BaseRepository;
