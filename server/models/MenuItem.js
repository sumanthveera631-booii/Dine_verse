const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a dish title'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a sensory description'],
  },
  price: {
    type: Number,
    required: [true, 'Please define the premium cost'],
  },
  category: {
    type: String,
    required: [true, 'Please specify the category'],
    enum: ['Mocktails', 'Desserts', 'Main Dishes', 'Chef Specials'],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot exceed 5 stars'],
    default: 5.0,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
