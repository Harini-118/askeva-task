const BookService = require('../services/bookService');
const ResponseHandler = require('../utils/responseHandler');

class BookController {
  static async createBook(req, res) {
    try {
      const book = await BookService.createBook(req.body);
      
      console.log(`✅ Book created: ${book.title} by ${req.user.username}`);
      
      ResponseHandler.created(res, book, 'Book created successfully');
    } catch (error) {
      console.error('Book creation error:', error.message);
      ResponseHandler.error(res, 'Failed to create book');
    }
  }
  
  static async getBooks(req, res) {
    try {
      const result = await BookService.getBooks(req.query);
      
      ResponseHandler.success(res, result, 'Books retrieved successfully');
    } catch (error) {
      console.error('Get books error:', error.message);
      ResponseHandler.error(res, 'Failed to retrieve books');
    }
  }
  
  static async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await BookService.getBookById(id);
      
      ResponseHandler.success(res, book, 'Book retrieved successfully');
    } catch (error) {
      console.error('Get book error:', error.message);
      
      if (error.message === 'Book not found') {
        return ResponseHandler.notFound(res, 'Book not found');
      }
      
      ResponseHandler.error(res, 'Failed to retrieve book');
    }
  }
  
  static async checkoutBook(req, res) {
    try {
      const { id } = req.params;
      const book = await BookService.checkoutBook(id);
      
      console.log(`✅ Book checked out: ${book.title} by ${req.user.username}`);
      
      ResponseHandler.success(res, book, 'Book checked out successfully');
    } catch (error) {
      console.error('Checkout error:', error.message);
      
      if (error.message === 'Book not found') {
        return ResponseHandler.notFound(res, 'Book not found');
      }
      
      if (error.message === 'Book is not available for checkout') {
        return ResponseHandler.badRequest(res, 'Book is currently unavailable');
      }
      
      ResponseHandler.error(res, 'Failed to checkout book');
    }
  }
}

module.exports = BookController;