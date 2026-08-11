import { BaseService } from './base.service.js';
import quoteRequestRepository from '../repositories/quoteRequest.repository.js';
import quoteRequestItemRepository from '../repositories/quoteRequestItem.repository.js';
import vendorRepository from '../repositories/vendor.repository.js';
import machineRepository from '../repositories/machine.repository.js';
import { AppError } from '../utils/AppError.js';

export class QuoteRequestService extends BaseService {
  constructor() {
    super(quoteRequestRepository);
    this.quoteRepo = quoteRequestRepository;
  }

  async createQuoteRequest(data, buyerUserId = null) {
    const {
      vendorId,
      contactName,
      contactPhone,
      contactEmail,
      companyName,
      message,
      targetDeliveryDate,
      preferredFinancing,
      items = [],
    } = data;

    await vendorRepository.findById(vendorId);

    if (!items.length) {
      throw new AppError('At least one machine item must be included in the quote request.', 400);
    }

    const quote = await this.quoteRepo.create({
      buyerUserId: buyerUserId || null,
      vendorId,
      status: 'submitted',
      contactName,
      contactPhone,
      contactEmail,
      companyName,
      message,
      targetDeliveryDate: targetDeliveryDate || null,
      preferredFinancing: preferredFinancing || false,
    });

    for (const item of items) {
      const { machineId, quantity = 1, requestedPrice = null, notes = null } = item;
      await machineRepository.findById(machineId);

      await quoteRequestItemRepository.create({
        quoteRequestId: quote.id,
        machineId,
        quantity,
        requestedPrice,
        notes,
      });
    }

    return await this.getQuoteDetails(quote.id);
  }

  async updateQuoteStatus(id, status) {
    const quote = await this.quoteRepo.findById(id);

    const validStatuses = ['submitted', 'viewed', 'responded', 'closed', 'declined'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid quote status '${status}'`, 400);
    }

    return await quote.update({ status });
  }

  async getQuoteDetails(id) {
    const quote = await this.quoteRepo.findWithItemsAndMachines(id);
    if (!quote) {
      throw new AppError(`Quote request with ID '${id}' not found`, 404);
    }
    return quote;
  }

  async getBuyerQuotes(buyerUserId) {
    return await this.quoteRepo.findByBuyer(buyerUserId);
  }

  async getVendorQuotes(vendorId) {
    await vendorRepository.findById(vendorId);
    return await this.quoteRepo.findByVendor(vendorId);
  }
}

export default new QuoteRequestService();
