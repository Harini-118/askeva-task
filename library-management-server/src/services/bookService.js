const Book = require('../models/Book');

class BookService {
  static async createBook(bookData) {
    const book = new Book(bookData);
    return await book.save();
  }
  
  static async getBooks(filters = {}) {
    const { genre, author, minYear, available, limit = 10, offset = 0 } = filters;
    
    const query = {};
    
    if (genre) query.genre = new RegExp(genre, 'i');
    if (author) query.author = new RegExp(author, 'i');
    if (minYear) query.publishedYear = { $gte: minYear };
    if (available !== undefined) query.isAvailable = available;
    
    const books = await Book.find(query)
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 });
    
    const total = await Book.countDocuments(query);
    
    return {
      books,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
    };
  }
  
  static async getBookById(id) {
    const book = await Book.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }
  
  static async checkoutBook(bookId) {
    const book = await Book.findById(bookId);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    if (book.stock <= 0) {
      throw new Error('Book is not available for checkout');
    }
    
    book.stock -= 1;
    await book.save();
    
    return book;
  }
}

module.exports = BookService;