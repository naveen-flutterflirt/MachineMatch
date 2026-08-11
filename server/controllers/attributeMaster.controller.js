import { BaseController } from './base.controller.js';
import attributeMasterService from '../services/attributeMaster.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class AttributeMasterController extends BaseController {
  constructor() {
    super(attributeMasterService, ['name', 'code', 'standardUnit', 'description'], ['dataType', 'higherIsBetter']);
  }

  createAttribute = catchAsync(async (req, res) => {
    const data = await attributeMasterService.createAttribute(req.body);
    res.status(201).json({ success: true, data });
  });

  updateAttribute = catchAsync(async (req, res) => {
    const data = await attributeMasterService.updateAttribute(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  });

  getByCode = catchAsync(async (req, res) => {
    const data = await attributeMasterService.getAttributeByCode(req.params.code);
    res.status(200).json({ success: true, data });
  });
}

export default new AttributeMasterController();
