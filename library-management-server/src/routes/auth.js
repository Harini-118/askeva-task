const express = require('express');
const AuthController = require('../controllers/authController');
const { validate } = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../validations/authValidation');

const router = express.Router();

// User registration
router.post('/register', validate(registerSchema), AuthController.register);

// User login
router.post('/login', validate(loginSchema), AuthController.login);

module.exports = router;