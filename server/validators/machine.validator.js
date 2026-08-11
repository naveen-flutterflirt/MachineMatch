import Joi from 'joi';

export const createMachineSchema = Joi.object({
  categoryId: Joi.string().uuid().required().messages({
    'string.uuid': 'Category ID must be a valid UUID.',
    'any.required': 'Category ID is required.',
  }),
  vendorId: Joi.string().uuid().allow(null, '').optional(),
  modelName: Joi.string().trim().max(150).required().messages({
    'any.required': 'Model name is required.',
  }),
  variant: Joi.string().trim().max(100).allow('', null),
  manufacturingYear: Joi.number().integer().min(1900).max(2100).allow(null),
  isFeatured: Joi.boolean().default(false),
});

export const updateMachineSchema = Joi.object({
  categoryId: Joi.string().uuid(),
  vendorId: Joi.string().uuid().allow(null, ''),
  modelName: Joi.string().trim().max(150),
  variant: Joi.string().trim().max(100).allow('', null),
  manufacturingYear: Joi.number().integer().min(1900).max(2100).allow(null),
  isFeatured: Joi.boolean(),
});

export const updateMachineStatusSchema = Joi.object({
  status: Joi.string()
    .valid('draft', 'pending_review', 'under_review', 'approved', 'published', 'rejected', 'archived')
    .required(),
  rejectionReason: Joi.string().trim().allow('', null),
});

export const addMediaSchema = Joi.object({
  type: Joi.string().valid('image', 'brochure_pdf', 'video', 'manual', 'spec_sheet').required(),
  url: Joi.string().uri().required().messages({
    'string.uri': 'Media URL must be a valid URL.',
  }),
  thumbnailUrl: Joi.string().uri().allow('', null),
  title: Joi.string().trim().max(255).allow('', null),
  displayOrder: Joi.number().integer().min(0).default(0),
  isPrimary: Joi.boolean().default(false),
  fileSize: Joi.number().integer().allow(null),
  mimeType: Joi.string().trim().max(100).allow('', null),
});

export const addSpecificationSchema = Joi.object({
  attributeId: Joi.string().uuid().required(),
  rawValue: Joi.string().trim().max(255).required(),
  rawUnit: Joi.string().trim().max(50).allow('', null),
  normalizedValue: Joi.number().allow(null),
  normalizedUnit: Joi.string().trim().max(50).allow('', null),
  source: Joi.string().valid('manual', 'ai_ocr', 'vendor_feed', 'admin_override').default('manual'),
  confidenceScore: Joi.number().min(0).max(1.0).default(1.0),
});

export const addPriceSchema = Joi.object({
  priceType: Joi.string()
    .valid('ex_factory', 'dealer_price', 'retail_mrp', 'discount_price', 'offer_price', 'rental_day_rate', 'rental_month_rate')
    .default('ex_factory'),
  amount: Joi.number().positive().required(),
  currency: Joi.string().trim().max(10).default('INR'),
  region: Joi.string().trim().max(100).allow('', null),
  effectiveFrom: Joi.date().allow(null),
  effectiveTo: Joi.date().allow(null),
  notes: Joi.string().trim().allow('', null),
});
