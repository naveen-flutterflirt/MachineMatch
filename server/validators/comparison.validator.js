import Joi from 'joi';

export const createComparisonSchema = Joi.object({
  categoryId: Joi.string().uuid().required().messages({
    'string.uuid': 'Category ID must be a valid UUID.',
    'any.required': 'Category ID is required.',
  }),
  title: Joi.string().trim().max(255).default('Machinery Comparison'),
  notes: Joi.string().trim().allow('', null),
  machineIds: Joi.array().items(Joi.string().uuid()).max(4).default([]),
  requirementsProfile: Joi.object().default({}),
});

export const addComparisonItemSchema = Joi.object({
  machineId: Joi.string().uuid().required().messages({
    'string.uuid': 'Machine ID must be a valid UUID.',
    'any.required': 'Machine ID is required.',
  }),
});

export const updateRequirementsProfileSchema = Joi.object({
  requirementsProfile: Joi.object().required().messages({
    'any.required': 'Requirements profile is required.',
  }),
});
