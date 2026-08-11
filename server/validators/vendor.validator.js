import Joi from 'joi';

export const createVendorSchema = Joi.object({
  name: Joi.string().trim().max(255).required().messages({
    'any.required': 'Vendor company name is required.',
  }),
  companyRegistrationNo: Joi.string().trim().max(100).allow('', null),
  taxId: Joi.string().trim().max(100).allow('', null),
  address: Joi.string().trim().allow('', null),
  city: Joi.string().trim().max(100).allow('', null),
  state: Joi.string().trim().max(100).allow('', null),
  zipCode: Joi.string().trim().max(20).allow('', null),
  country: Joi.string().trim().max(100).default('India'),
  website: Joi.string().uri().allow('', null).messages({
    'string.uri': 'Website must be a valid URL.',
  }),
  contactPersonName: Joi.string().trim().max(150).allow('', null),
  contactPhone: Joi.string().trim().max(30).allow('', null),
  contactEmail: Joi.string().email().allow('', null).messages({
    'string.email': 'Contact email must be a valid email address.',
  }),
  logoUrl: Joi.string().uri().allow('', null),
  isVerified: Joi.boolean().default(false),
  rating: Joi.number().min(0).max(5.0).default(0.0),
});

export const updateVendorSchema = Joi.object({
  name: Joi.string().trim().max(255),
  companyRegistrationNo: Joi.string().trim().max(100).allow('', null),
  taxId: Joi.string().trim().max(100).allow('', null),
  address: Joi.string().trim().allow('', null),
  city: Joi.string().trim().max(100).allow('', null),
  state: Joi.string().trim().max(100).allow('', null),
  zipCode: Joi.string().trim().max(20).allow('', null),
  country: Joi.string().trim().max(100),
  website: Joi.string().uri().allow('', null),
  contactPersonName: Joi.string().trim().max(150).allow('', null),
  contactPhone: Joi.string().trim().max(30).allow('', null),
  contactEmail: Joi.string().email().allow('', null),
  logoUrl: Joi.string().uri().allow('', null),
  isVerified: Joi.boolean(),
  rating: Joi.number().min(0).max(5.0),
});

export const verifyVendorSchema = Joi.object({
  isVerified: Joi.boolean().required().messages({
    'any.required': 'isVerified status is required.',
  }),
});
