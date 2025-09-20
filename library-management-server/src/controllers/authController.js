const AuthService = require('../services/authService');
const ResponseHandler = require('../utils/responseHandler');

class AuthController {
  static async register(req, res) {
    try {
      const { user, token } = await AuthService.register(req.body);
      
      console.log(`✅ User registered: ${user.email}`);
      
      ResponseHandler.created(res, {
        user,
        token,
      }, 'User registered successfully');
    } catch (error) {
      console.error('Registration error:', error.message);
      
      if (error.code === 11000) {
        return ResponseHandler.badRequest(res, 'User already exists');
      }
      
      ResponseHandler.error(res, 'Registration failed');
    }
  }
  
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);
      
      console.log(`✅ User logged in: ${user.email}`);
      
      ResponseHandler.success(res, {
        user,
        token,
      }, 'Login successful');
    } catch (error) {
      console.error('Login error:', error.message);
      
      if (error.message === 'Invalid credentials') {
        return ResponseHandler.unauthorized(res, 'Invalid email or password');
      }
      
      ResponseHandler.error(res, 'Login failed');
    }
  }
}

module.exports = AuthController;