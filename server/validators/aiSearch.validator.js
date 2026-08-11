import Joi from 'joi';

export const nlpSearchSchema = Joi.object({
  queryText: Joi.string().trim().required().messages({
    'any.required': 'Query text is required for AI search.',
  }),
});

export const generateEmbeddingSchema = Joi.object({
  machineId: Joi.string().uuid().required().messages({
    'string.uuid': 'Machine ID must be a valid UUID.',
    'any.required': 'Machine ID is required.',
  }),
});
