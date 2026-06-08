const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide your reviewer name'],
  },
  comments: {
    type: String,
    required: [true, 'Please write your culinary critique comments'],
  },
  ratingValue: {
    type: Number,
    required: [true, 'Please select your rating star value'],
    min: 1,
    max: 5,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Flagged'],
    default: 'Approved',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', ReviewSchema);
