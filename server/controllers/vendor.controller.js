import { BaseController } from './base.controller.js';
import vendorService from '../services/vendor.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class VendorController extends BaseController {
  constructor() {
    super(
      vendorService,
      ['name', 'contactPersonName', 'contactEmail', 'city', 'country', 'taxId'],
      ['isVerified', 'country', 'state']
    );
  }

  createVendor = catchAsync(async (req, res) => {
    const data = await vendorService.createVendor(req.body);
    res.status(201).json({ success: true, data });
  });

  updateVendor = catchAsync(async (req, res) => {
    const data = await vendorService.updateVendor(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  });

  verifyVendor = catchAsync(async (req, res) => {
    const data = await vendorService.verifyVendor(req.params.id, req.body.isVerified);
    res.status(200).json({ success: true, message: 'Vendor verification status updated', data });
  });

  getVerified = catchAsync(async (req, res) => {
    const data = await vendorService.getVerifiedVendors();
    res.status(200).json({ success: true, data });
  });
}

export default new VendorController();
