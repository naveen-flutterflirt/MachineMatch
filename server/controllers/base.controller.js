import { catchAsync } from '../utils/catchAsync.js';

export class BaseController {
  constructor(service, searchableFields = [], filterableFields = []) {
    this.service = service;
    this.searchableFields = searchableFields;
    this.filterableFields = filterableFields;
  }

  create = catchAsync(async (req, res) => {
    const data = await this.service.create(req.body);
    res.status(201).json({ success: true, data });
  });

  getAll = catchAsync(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : req.query;
    const data = await this.service.getAll(filter);
    res.status(200).json({ success: true, data });
  });

  getById = catchAsync(async (req, res) => {
    const data = await this.service.getOne(req.params.id);
    res.status(200).json({ success: true, data });
  });

  search = catchAsync(async (req, res) => {
    const result = await this.service.search(req.query, this.searchableFields, {
      filterableFields: this.filterableFields,
    });
    res.status(200).json({ success: true, ...result });
  });

  update = catchAsync(async (req, res) => {
    const data = await this.service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  });

  delete = catchAsync(async (req, res) => {
    await this.service.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Resource deleted successfully' });
  });
}
