import { BaseController } from './base.controller.js';
import comparisonEngineService from '../services/comparisonEngine.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class ComparisonController extends BaseController {
  constructor() {
    super(comparisonEngineService, ['title', 'notes'], ['categoryId', 'userId']);
  }

  createComparison = catchAsync(async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const data = await comparisonEngineService.createComparisonSession(req.body, userId);
    res.status(201).json({ success: true, data });
  });

  addMachine = catchAsync(async (req, res) => {
    const data = await comparisonEngineService.addMachineToComparison(
      req.params.id,
      req.body.machineId
    );
    res.status(200).json({ success: true, data });
  });

  removeMachine = catchAsync(async (req, res) => {
    const data = await comparisonEngineService.removeMachineFromComparison(
      req.params.id,
      req.params.machineId
    );
    res.status(200).json({ success: true, message: 'Machine removed from comparison session', data });
  });

  updateRequirements = catchAsync(async (req, res) => {
    const data = await comparisonEngineService.updateRequirements(
      req.params.id,
      req.body.requirementsProfile
    );
    res.status(200).json({ success: true, message: 'Fit match scores updated', data });
  });

  getSideBySideTable = catchAsync(async (req, res) => {
    const data = await comparisonEngineService.getSideBySideTable(req.params.id);
    res.status(200).json({ success: true, data });
  });

  calculateScores = catchAsync(async (req, res) => {
    const data = await comparisonEngineService.calculateFitScores(req.params.id);
    res.status(200).json({ success: true, data });
  });

  getMyComparisons = catchAsync(async (req, res) => {
    const data = await comparisonEngineService.getUserComparisons(req.user.id);
    res.status(200).json({ success: true, data });
  });

  getAll = catchAsync(async (req, res) => {
    const data = await comparisonEngineService.getAllSystemComparisons(req.query);
    res.status(200).json({ success: true, data });
  });
}

export default new ComparisonController();
