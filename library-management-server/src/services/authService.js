const User = require('../models/User');
const { generateToken } = require('../config/jwt');

class AuthService {
  static async register(userData) {
    const user = new User(userData);
    await user.save();
    
    const token = generateToken({ id: user._id });
    
    return {
      user,
      token,
    };
  }
  
  static async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    
    const token = generateToken({ id: user._id });
    
    return {
      user,
      token,
    };
  }
}

module.exports = AuthService;