const logger = require('../utils/logger');
const ResponseHandler = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return ResponseHandler.badRequest(res, 'Validation failed', errors);
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ResponseHandler.badRequest(res, `${field} already exists`);
  }
  
  if (err.name === 'CastError') {
    return ResponseHandler.badRequest(res, 'Invalid ID format');
  }
  
  return ResponseHandler.error(res, 'Something went wrong');
};

module.exports = errorHandler;