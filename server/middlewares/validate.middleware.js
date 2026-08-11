import { AppError } from '../utils/AppError.js';

export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    if (!schema) return next();

    const dataToValidate = req[source] || {};
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message.replace(/"/g, "'")).join(', ');
      return next(new AppError(`Validation Error: ${errorMessage}`, 400));
    }

    req[source] = value;
    next();
  };
};
