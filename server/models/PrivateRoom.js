const mongoose = require('mongoose');

const PrivateRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a room title'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a room description'],
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide a capacity limit'],
  },
  acoustics: {
    type: String,
    default: 'Standard',
  },
  panorama: {
    type: String,
    default: '',
  },
  depositPrice: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  features: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model('PrivateRoom', PrivateRoomSchema);
