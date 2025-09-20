const Joi = require('joi');

const createBookSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'Title is required',
      'string.empty': 'Title cannot be empty',
    }),
  author: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'Author is required',
      'string.empty': 'Author cannot be empty',
    }),
  publishedYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .messages({
      'number.min': 'Published year must be at least 1000',
      'number.max': 'Published year cannot be in the future',
      'number.integer': 'Published year must be a valid integer',
    }),
  genre: Joi.string()
    .trim()
    .allow(''),
  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'any.required': 'Stock is required',
      'number.min': 'Stock cannot be negative',
      'number.integer': 'Stock must be a valid integer',
    }),
});

const querySchema = Joi.object({
  genre: Joi.string().trim(),
  author: Joi.string().trim(),
  minYear: Joi.number().integer().min(1000),
  available: Joi.boolean(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
});

module.exports = {
  createBookSchema,
  querySchema,
};