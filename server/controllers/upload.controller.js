import { BaseController } from './base.controller.js';
import uploadService from '../services/upload.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class UploadController extends BaseController {
  constructor() {
    super(uploadService, ['originalName', 'fileName', 'mimeType'], ['status', 'uploadedByUserId']);
  }

  uploadFile = catchAsync(async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const data = await uploadService.processFileUpload(req.file, userId);
    res.status(201).json({ success: true, data });
  });

  uploadMultipleFiles = catchAsync(async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const data = await uploadService.processMultipleFileUploads(req.files, userId);
    res.status(201).json({
      success: true,
      message: `${data.length} files uploaded successfully`,
      data,
    });
  });

  updateStatus = catchAsync(async (req, res) => {
    const { status, ocrExtractedData, errorMessage } = req.body;
    const data = await uploadService.updateUploadStatus(
      req.params.id,
      req.params.id,
      status,
      ocrExtractedData,
      errorMessage
    );
    res.status(200).json({ success: true, message: 'Upload status updated', data });
  });

  getMyUploads = catchAsync(async (req, res) => {
    const data = await uploadService.getUserUploads(req.user.id);
    res.status(200).json({ success: true, data });
  });

  getPending = catchAsync(async (req, res) => {
    const data = await uploadService.getPendingUploads();
    res.status(200).json({ success: true, data });
  });

  getWithUploader = catchAsync(async (req, res) => {
    const data = await uploadService.getUploadWithUploader(req.params.id);
    res.status(200).json({ success: true, data });
  });

  getAll = catchAsync(async (req, res) => {
    const data = await uploadService.getAllUploadsWithUploader(req.query);
    res.status(200).json({ success: true, data });
  });
}

export default new UploadController();
