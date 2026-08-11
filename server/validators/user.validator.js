import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': 'Password is required.',
  }),
  firstName: Joi.string().trim().max(100).required().messages({
    'any.required': 'First name is required.',
  }),
  lastName: Joi.string().trim().max(100).required().messages({
    'any.required': 'Last name is required.',
  }),
  phone: Joi.string().trim().allow('', null),
  userType: Joi.string().valid('admin', 'user').default('user'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().max(100),
  lastName: Joi.string().trim().max(100),
  phone: Joi.string().trim().allow('', null),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().max(100),
  lastName: Joi.string().trim().max(100),
  phone: Joi.string().trim().allow('', null),
  userType: Joi.string().valid('admin', 'user'),
  status: Joi.string().valid('pending_verification', 'active', 'suspended'),
});
