import { BaseController } from './base.controller.js';
import machineService from '../services/machine.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class MachineController extends BaseController {
  constructor() {
    super(machineService, ['modelName', 'variant'], ['categoryId', 'vendorId', 'status', 'isFeatured']);
  }

  createMachine = catchAsync(async (req, res) => {
    const data = await machineService.createMachine(req.body);
    res.status(201).json({ success: true, data });
  });

  updateMachine = catchAsync(async (req, res) => {
    const data = await machineService.updateMachine(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  });

  updateStatus = catchAsync(async (req, res) => {
    const { status, rejectionReason } = req.body;
    const data = await machineService.updateStatus(req.params.id, status, rejectionReason);
    res.status(200).json({ success: true, message: 'Machine status updated', data });
  });

  getDetails = catchAsync(async (req, res) => {
    const data = await machineService.getMachineDetails(req.params.id);
    res.status(200).json({ success: true, data });
  });

  // --- Media Handlers ---
  addMedia = catchAsync(async (req, res) => {
    const data = await machineService.addMedia(req.params.id, req.body);
    res.status(201).json({ success: true, data });
  });

  getMedia = catchAsync(async (req, res) => {
    const data = await machineService.getMedia(req.params.id);
    res.status(200).json({ success: true, data });
  });

  deleteMedia = catchAsync(async (req, res) => {
    await machineService.deleteMedia(req.params.mediaId);
    res.status(200).json({ success: true, message: 'Media asset deleted successfully' });
  });

  // --- Specification Handlers ---
  setSpecification = catchAsync(async (req, res) => {
    const data = await machineService.setSpecification(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  });

  getSpecifications = catchAsync(async (req, res) => {
    const data = await machineService.getSpecifications(req.params.id);
    res.status(200).json({ success: true, data });
  });

  // --- Price Handlers ---
  addPrice = catchAsync(async (req, res) => {
    const data = await machineService.addPrice(req.params.id, req.body);
    res.status(201).json({ success: true, data });
  });

  getPrices = catchAsync(async (req, res) => {
    const data = await machineService.getPrices(req.params.id);
    res.status(200).json({ success: true, data });
  });
}

export default new MachineController();
