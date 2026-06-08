const mongoose = require('mongoose');

const PrivateBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomTitle: {
    type: String,
    required: [true, 'Please specify the name of the private luxury venue room'],
  },
  date: {
    type: String,
    required: [true, 'Please specify the date for the private hire'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Please select a premium hire time slot'],
  },
  guestCount: {
    type: Number,
    required: [true, 'Please specify private guest capacity'],
  },
  specialRequests: {
    type: String,
    default: 'None',
  },
  contactNumber: {
    type: String,
    required: [true, 'Please provide a secure VVIP contact callback number'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  // Payment fields
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  stripeSessionId: {
    type: String,
  },
  paymentIntentId: {
    type: String,
  },
  bookingFee: {
    type: Number,
    default: 250000, // ₹2500 in paise (VIP boutique default)
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('PrivateBooking', PrivateBookingSchema);
