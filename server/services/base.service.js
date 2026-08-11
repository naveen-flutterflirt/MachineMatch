import { AppError } from '../utils/AppError.js';

const toPositiveInteger = (value, fallback) => {
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

export class BaseService {
  constructor(repository) {
    if (!repository) {
      throw new Error('BaseService requires a valid repository instance.');
    }
    this.repository = repository;
  }

  async getAll(query = {}, options = {}) {
    return await this.repository.findAll(query, options);
  }

  async getOne(id, options = {}) {
    return await this.repository.findById(id, options);
  }

  async search(query = {}, searchableFields = [], options = {}) {
    const queryObject = query && typeof query === 'object' ? query : { q: query };
    const searchTerm = String(
      queryObject.q ?? queryObject.search ?? queryObject.keyword ?? ''
    ).trim();

    const fields = Array.isArray(searchableFields) ? searchableFields.filter(Boolean) : [];

    const {
      filterableFields = [],
      filters = {},
      formatter,
      minSearchLength = 0,
      ...repositoryOptions
    } = options;

    if (!fields.length && searchTerm) {
      throw new AppError('Search fields are required when a search term is provided.', 400);
    }

    if (searchTerm && searchTerm.length < minSearchLength) {
      throw new AppError(`Search term must be at least ${minSearchLength} characters`, 400);
    }

    const queryFilters = {};
    for (const field of filterableFields) {
      if (queryObject[field] !== undefined && queryObject[field] !== '') {
        queryFilters[field] = queryObject[field];
      }
    }

    const result = await this.repository.search(searchTerm, fields, {
      ...repositoryOptions,
      filters: { ...filters, ...queryFilters },
      page: toPositiveInteger(queryObject.page ?? repositoryOptions.page, 1),
      limit: toPositiveInteger(queryObject.limit ?? repositoryOptions.limit, 10),
    });

    return {
      ...result,
      data:
        typeof formatter === 'function'
          ? result.data.map((record) => formatter(record))
          : result.data,
    };
  }

  async create(data, options = {}) {
    return await this.repository.create(data, options);
  }

  async update(id, data, options = {}) {
    return await this.repository.update(id, data, options);
  }

  async delete(id, options = {}) {
    return await this.repository.delete(id, options);
  }
}
