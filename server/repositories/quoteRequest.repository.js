import { BaseRepository } from './base.repository.js';
import {
  QuoteRequest,
  QuoteRequestItem,
  User,
  Vendor,
  Machine,
  Price,
} from '../models/index.js';

export class QuoteRequestRepository extends BaseRepository {
  constructor() {
    super(QuoteRequest);
  }

  async findWithItemsAndMachines(id, options = {}) {
    return await this.model.findOne({
      where: { id },
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'email', 'firstName', 'lastName', 'phone'] },
        { model: Vendor, as: 'vendor' },
        {
          model: QuoteRequestItem,
          as: 'items',
          include: [
            {
              model: Machine,
              as: 'machine',
              include: [{ model: Price, as: 'prices' }],
            },
          ],
        },
      ],
      ...options,
    });
  }

  async findByBuyer(buyerUserId, options = {}) {
    return await this.findAll({ buyerUserId }, options);
  }

  async findByVendor(vendorId, options = {}) {
    return await this.findAll({ vendorId }, options);
  }
}

export default new QuoteRequestRepository();
