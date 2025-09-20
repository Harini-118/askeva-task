const { verifyToken } = require('../config/jwt');
const User = require('../models/User');
const ResponseHandler = require('../utils/responseHandler');

const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return ResponseHandler.unauthorized(res, 'Access token is required');
    }
    
    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return ResponseHandler.unauthorized(res, 'User no longer exists');
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return ResponseHandler.unauthorized(res, 'Invalid token');
    }
    
    if (error.name === 'TokenExpiredError') {
      return ResponseHandler.unauthorized(res, 'Token has expired');
    }
    
    return ResponseHandler.error(res, 'Authentication failed');
  }
};

module.exports = authenticate;