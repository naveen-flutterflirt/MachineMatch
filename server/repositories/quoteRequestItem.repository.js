import { BaseRepository } from './base.repository.js';
import QuoteRequestItem from '../models/QuoteRequestItem.js';

export class QuoteRequestItemRepository extends BaseRepository {
  constructor() {
    super(QuoteRequestItem);
  }

  async findByQuoteRequest(quoteRequestId, options = {}) {
    return await this.findAll({ quoteRequestId }, options);
  }
}

export default new QuoteRequestItemRepository();
