import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().max(150).required().messages({
    'any.required': 'Category name is required.',
  }),
  slug: Joi.string().trim().max(150).allow('', null),
  parentId: Joi.string().uuid().allow(null, '').messages({
    'string.uuid': 'Parent ID must be a valid UUID.',
  }),
  description: Joi.string().trim().allow('', null),
  iconUrl: Joi.string().uri().allow('', null).messages({
    'string.uri': 'Icon URL must be a valid URL.',
  }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().max(150),
  slug: Joi.string().trim().max(150),
  parentId: Joi.string().uuid().allow(null, ''),
  description: Joi.string().trim().allow('', null),
  iconUrl: Joi.string().uri().allow('', null),
  isActive: Joi.boolean(),
});
