const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: [true, 'Please select a date for your fine-dining booking'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Please select a premium time slot'],
  },
  guestCount: {
    type: Number,
    required: [true, 'Please specify the capacity of your table circle'],
    min: [1, 'Must have at least 1 guest'],
    max: [20, 'For groups larger than 20, contact the Concierge desk directly'],
  },
  specialRequests: {
    type: String,
    default: 'None',
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
    default: 100000, // ₹1000 in paise (default premium)
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', ReservationSchema);
