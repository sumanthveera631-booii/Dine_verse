const express = require('express');
const router = express.Router();
const {
  reserveTable,
  bookVenue,
  getMyReservations,
  getMyVenueBookings,
  getAllReservations,
  getAllVenueBookings,
  updateReservationStatus,
  updateVenueBookingStatus,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Client endpoints
router.post('/reserve', protect, reserveTable);
router.post('/book-venue', protect, bookVenue);
router.get('/my-reservations', protect, getMyReservations);
router.get('/my-venue-bookings', protect, getMyVenueBookings);

// Admin moderation endpoints
router.get('/reservations', protect, restrictTo('admin'), getAllReservations);
router.get('/venue-bookings', protect, restrictTo('admin'), getAllVenueBookings);
router.patch('/reservations/:id/status', protect, restrictTo('admin'), updateReservationStatus);
router.patch('/venue-bookings/:id/status', protect, restrictTo('admin'), updateVenueBookingStatus);

module.exports = router;
