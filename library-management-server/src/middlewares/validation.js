const ResponseHandler = require('../utils/responseHandler');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return ResponseHandler.badRequest(res, 'Validation failed', errors);
    }
    
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return ResponseHandler.badRequest(res, 'Query validation failed', errors);
    }
    
    req.query = value; // Use validated and formatted query
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
};