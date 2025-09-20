const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Published year must be a valid year'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future'],
  },
  genre: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: function() {
      return this.stock > 0;
    },
  },
}, {
  timestamps: true,
});

bookSchema.pre('save', function(next) {
  this.isAvailable = this.stock > 0;
  next();
});

bookSchema.index({ genre: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ publishedYear: 1 });
bookSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Book', bookSchema);