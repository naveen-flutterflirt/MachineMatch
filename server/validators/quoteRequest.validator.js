import Joi from 'joi';

const quoteItemSchema = Joi.object({
  machineId: Joi.string().uuid().required().messages({
    'string.uuid': 'Machine ID must be a valid UUID.',
    'any.required': 'Machine ID is required.',
  }),
  quantity: Joi.number().integer().min(1).default(1),
  requestedPrice: Joi.number().positive().allow(null),
  notes: Joi.string().trim().allow('', null),
});

export const createQuoteRequestSchema = Joi.object({
  vendorId: Joi.string().uuid().required().messages({
    'string.uuid': 'Vendor ID must be a valid UUID.',
    'any.required': 'Vendor ID is required.',
  }),
  contactName: Joi.string().trim().max(150).required().messages({
    'any.required': 'Contact name is required.',
  }),
  contactPhone: Joi.string().trim().max(30).required().messages({
    'any.required': 'Contact phone is required.',
  }),
  contactEmail: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Contact email is required.',
  }),
  companyName: Joi.string().trim().max(255).allow('', null),
  message: Joi.string().trim().allow('', null),
  targetDeliveryDate: Joi.date().allow(null),
  preferredFinancing: Joi.boolean().default(false),
  items: Joi.array().items(quoteItemSchema).min(1).required().messages({
    'array.min': 'At least one machine item must be included in the quote request.',
    'any.required': 'Quote items are required.',
  }),
});

export const updateQuoteStatusSchema = Joi.object({
  status: Joi.string()
    .valid('submitted', 'viewed', 'responded', 'closed', 'declined')
    .required()
    .messages({
      'any.required': 'Status is required.',
    }),
});
