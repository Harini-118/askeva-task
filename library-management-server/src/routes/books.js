const express = require('express');
const BookController = require('../controllers/bookController');
const authenticate = require('../middlewares/auth');
const { validate, validateQuery } = require('../middlewares/validation');
const { createBookSchema, querySchema } = require('../validations/bookValidation');

const router = express.Router();

// Create book (requires authentication)
router.post('/', 
  authenticate, 
  validate(createBookSchema), 
  BookController.createBook
);

// Get all books with filtering
router.get('/', 
  validateQuery(querySchema), 
  BookController.getBooks
);

// Get book by ID
router.get('/:id', 
  BookController.getBookById
);

// Checkout book (requires authentication)
router.post('/:id/checkout', 
  authenticate, 
  BookController.checkoutBook
);

module.exports = router;