import Joi from 'joi';

export const logQuerySchema = Joi.object({
  queryText: Joi.string().trim().required().messages({
    'any.required': 'Query text is required.',
  }),
  searchType: Joi.string().valid('keyword', 'nlp_ai', 'filter', 'similar').default('nlp_ai'),
  parsedFilters: Joi.object().default({}),
  resultCount: Joi.number().integer().min(0).default(0),
  executionTimeMs: Joi.number().integer().min(0).default(0),
});
