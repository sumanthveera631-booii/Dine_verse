const Reservation = require('../models/Reservation');
const PrivateBooking = require('../models/PrivateBooking');

// @desc    Create a new table reservation
// @route   POST /api/bookings/reserve
// @access  Private
exports.reserveTable = async (req, res) => {
  const { date, timeSlot, guestCount, specialRequests } = req.body;
  try {
    const reservation = await Reservation.create({
      user: req.user._id,
      date,
      timeSlot,
      guestCount,
      specialRequests: specialRequests || 'None',
    });

    const populatedReservation = await Reservation.findById(reservation._id).populate('user', 'name email');

    // Trigger real-time Socket.IO notification to Admin Command Center
    const io = req.app.get('socketio');
    if (io) {
      console.log('📡 Emitting real-time Socket event: newReservation');
      io.emit('newReservation', populatedReservation);
    }

    res.status(201).json(populatedReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new private venue room booking
// @route   POST /api/bookings/book-venue
// @access  Private
exports.bookVenue = async (req, res) => {
  const { roomTitle, date, timeSlot, guestCount, specialRequests, contactNumber } = req.body;
  try {
    const booking = await PrivateBooking.create({
      user: req.user._id,
      roomTitle,
      date,
      timeSlot,
      guestCount,
      specialRequests: specialRequests || 'None',
      contactNumber,
    });

    const populatedBooking = await PrivateBooking.findById(booking._id).populate('user', 'name email');

    // Trigger real-time Socket.IO notification to Admin Command Center
    const io = req.app.get('socketio');
    if (io) {
      console.log('📡 Emitting real-time Socket event: newPrivateBooking');
      io.emit('newPrivateBooking', populatedBooking);
    }

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user reservations
// @route   GET /api/bookings/my-reservations
// @access  Private
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user private venue bookings
// @route   GET /api/bookings/my-venue-bookings
// @access  Private
exports.getMyVenueBookings = async (req, res) => {
  try {
    const bookings = await PrivateBooking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all standard reservations (Admin only)
// @route   GET /api/bookings/reservations
// @access  Private/Admin
exports.getAllReservations = async (req, res) => {
  try {
    // Exclude cancelled reservations from admin listing
    const reservations = await Reservation.find({ status: { $ne: 'Cancelled' } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all private room bookings (Admin only)
// @route   GET /api/bookings/venue-bookings
// @access  Private/Admin
exports.getAllVenueBookings = async (req, res) => {
  try {
    // Exclude cancelled venue bookings from admin listing
    const bookings = await PrivateBooking.find({ status: { $ne: 'Cancelled' } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update table reservation status (Admin only)
// @route   PATCH /api/bookings/reservations/:id/status
// @access  Private/Admin
exports.updateReservationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = status;
    await reservation.save();

    const populated = await Reservation.findById(reservation._id).populate('user', 'name email');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update private room booking status (Admin only)
// @route   PATCH /api/bookings/venue-bookings/:id/status
// @access  Private/Admin
exports.updateVenueBookingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await PrivateBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Venue booking not found' });
    }

    booking.status = status;
    await booking.save();

    const populated = await PrivateBooking.findById(booking._id).populate('user', 'name email');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
