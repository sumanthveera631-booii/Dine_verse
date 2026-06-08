const express = require('express');
const router = express.Router();
const { 
  createReservationCheckout, 
  createVenueCheckout,
  verifyPaymentSession,
  getBookingFee
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/fee/:tierType', getBookingFee);

// Protected routes
router.post('/checkout-session/reservation', protect, createReservationCheckout);
router.post('/checkout-session/venue', protect, createVenueCheckout);
router.post('/verify-session', protect, verifyPaymentSession);

module.exports = router;
