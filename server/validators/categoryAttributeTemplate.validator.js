import Joi from 'joi';

export const assignTemplateSchema = Joi.object({
  categoryId: Joi.string().uuid().required().messages({
    'string.uuid': 'Category ID must be a valid UUID.',
    'any.required': 'Category ID is required.',
  }),
  attributeId: Joi.string().uuid().required().messages({
    'string.uuid': 'Attribute ID must be a valid UUID.',
    'any.required': 'Attribute ID is required.',
  }),
  isRequired: Joi.boolean().default(false),
  displayOrder: Joi.number().integer().min(0).default(0),
  unitOptions: Joi.array().items(Joi.string().trim()).default([]),
});
