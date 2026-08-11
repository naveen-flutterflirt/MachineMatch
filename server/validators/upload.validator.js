import Joi from 'joi';

export const updateUploadStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'processed', 'failed').required().messages({
    'any.required': 'Status is required.',
  }),
  ocrExtractedData: Joi.object().allow(null),
  errorMessage: Joi.string().trim().allow('', null),
});
