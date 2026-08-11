import Joi from 'joi';

export const createAttributeSchema = Joi.object({
  name: Joi.string().trim().max(150).required().messages({
    'any.required': 'Attribute name is required.',
  }),
  code: Joi.string().trim().max(100).allow('', null),
  dataType: Joi.string().valid('number', 'string', 'boolean', 'enum').default('number'),
  standardUnit: Joi.string().trim().max(50).allow('', null),
  higherIsBetter: Joi.boolean().default(true),
  defaultWeight: Joi.number().min(0.1).max(10.0).default(1.0),
  description: Joi.string().trim().allow('', null),
});

export const updateAttributeSchema = Joi.object({
  name: Joi.string().trim().max(150),
  code: Joi.string().trim().max(100),
  dataType: Joi.string().valid('number', 'string', 'boolean', 'enum'),
  standardUnit: Joi.string().trim().max(50).allow('', null),
  higherIsBetter: Joi.boolean(),
  defaultWeight: Joi.number().min(0.1).max(10.0),
  description: Joi.string().trim().allow('', null),
});
