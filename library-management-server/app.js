const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('express-async-errors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const bookRoutes = require('./src/routes/books');

const app = express();

app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.name || 'not connected',
      host: mongoose.connection.host || 'not connected'
    },
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  };

  res.json(healthStatus);
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Library Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      createBook: 'POST /api/books (requires auth)',
      getBooks: 'GET /api/books',
      getBook: 'GET /api/books/:id',
      checkoutBook: 'POST /api/books/:id/checkout (requires auth)'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

module.exports = app;