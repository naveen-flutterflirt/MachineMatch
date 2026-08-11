import { BaseController } from './base.controller.js';
import quoteRequestService from '../services/quoteRequest.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class QuoteRequestController extends BaseController {
  constructor() {
    super(
      quoteRequestService,
      ['contactName', 'contactEmail', 'companyName', 'message'],
      ['status', 'vendorId', 'buyerUserId']
    );
  }

  createQuote = catchAsync(async (req, res) => {
    const buyerUserId = req.user ? req.user.id : null;
    const data = await quoteRequestService.createQuoteRequest(req.body, buyerUserId);
    res.status(201).json({ success: true, message: 'Quote request submitted successfully', data });
  });

  updateStatus = catchAsync(async (req, res) => {
    const data = await quoteRequestService.updateQuoteStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: 'Quote status updated', data });
  });

  getDetails = catchAsync(async (req, res) => {
    const data = await quoteRequestService.getQuoteDetails(req.params.id);
    res.status(200).json({ success: true, data });
  });

  getBuyerQuotes = catchAsync(async (req, res) => {
    const data = await quoteRequestService.getBuyerQuotes(req.user.id);
    res.status(200).json({ success: true, data });
  });

  getVendorQuotes = catchAsync(async (req, res) => {
    const data = await quoteRequestService.getVendorQuotes(req.params.vendorId);
    res.status(200).json({ success: true, data });
  });
}

export default new QuoteRequestController();
