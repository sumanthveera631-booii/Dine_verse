const Reservation = require('../models/Reservation');
const PrivateBooking = require('../models/PrivateBooking');
const { calculateBookingFee, getTierType } = require('../utils/pricing');

// Lazy load Stripe to ensure environment variables are loaded
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not configured in environment variables');
  }
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

const getClientUrl = (req) => {
  if (process.env.CLIENT_URL) return process.env.CLIENT_URL;
  if (req.headers.origin) return req.headers.origin;
  if (req.headers.referer) {
    try {
      return new URL(req.headers.referer).origin;
    } catch (err) {
      return 'http://localhost:5173';
    }
  }
  return 'http://localhost:5173';
};

// @desc    Create Stripe checkout session for standard reservation
// @route   POST /api/payments/checkout-session/reservation
// @access  Private
exports.createReservationCheckout = async (req, res) => {
  const { reservationId } = req.body;
  
  try {
    const stripe = getStripe();
    const reservation = await Reservation.findById(reservationId).populate('user', 'email name');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this reservation' });
    }

    const tierType = getTierType({ bookingType: 'standard' });
    const fee = calculateBookingFee(tierType);

    const clientUrl = getClientUrl(req);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: reservation.user.email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${fee.name} - Table Reservation`,
              description: `Reservation for ${reservation.guestCount} guests on ${reservation.date} at ${reservation.timeSlot}`,
            },
            unit_amount: fee.amount, // Amount in paise
          },
          quantity: 1,
        }
      ],
      success_url: `${clientUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&type=standard_table`,
      cancel_url: `${clientUrl}/booking/cancel`,
      metadata: {
        reservationId: reservation._id.toString(),
        userId: req.user._id.toString(),
        bookingType: 'standard_table',
        tierType
      }
    });

    // Store session ID in reservation for later verification
    reservation.stripeSessionId = session.id;
    reservation.paymentStatus = 'pending';
    await reservation.save();

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Stripe checkout session for private venue booking
// @route   POST /api/payments/checkout-session/venue
// @access  Private
exports.createVenueCheckout = async (req, res) => {
  const { venueBookingId } = req.body;
  
  try {
    const stripe = getStripe();
    const booking = await PrivateBooking.findById(venueBookingId).populate('user', 'email name');
    
    if (!booking) {
      return res.status(404).json({ message: 'Venue booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this booking' });
    }

    const tierType = getTierType({ bookingType: 'private' });
    const fee = calculateBookingFee(tierType);

    const clientUrl = getClientUrl(req);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: booking.user.email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${fee.name} - ${booking.roomTitle}`,
              description: `Private venue hire for ${booking.guestCount} guests on ${booking.date} at ${booking.timeSlot}`,
            },
            unit_amount: fee.amount, // Amount in paise
          },
          quantity: 1,
        }
      ],
      success_url: `${clientUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&type=private_venue`,
      cancel_url: `${clientUrl}/booking/cancel`,
      metadata: {
        venueBookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        bookingType: 'private_venue',
        tierType,
        roomTitle: booking.roomTitle
      }
    });

    // Store session ID in booking for later verification
    booking.stripeSessionId = session.id;
    booking.paymentStatus = 'pending';
    await booking.save();

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Stripe payment session and confirm booking
// @route   POST /api/payments/verify-session
// @access  Private
exports.verifyPaymentSession = async (req, res) => {
  const { sessionId, bookingType } = req.body;
  
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    if (bookingType === 'standard_table') {
      const reservation = await Reservation.findOne({ stripeSessionId: sessionId });
      
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      reservation.status = 'Confirmed';
      reservation.paymentStatus = 'completed';
      reservation.paymentIntentId = session.payment_intent;
      await reservation.save();

      // Emit real-time notification to admin
      const io = req.app.get('socketio');
      if (io) {
        io.emit('reservationConfirmed', reservation);
      }

      return res.json({ message: 'Reservation confirmed', reservation });
    } 
    
    if (bookingType === 'private_venue') {
      const booking = await PrivateBooking.findOne({ stripeSessionId: sessionId });
      
      if (!booking) {
        return res.status(404).json({ message: 'Venue booking not found' });
      }

      booking.status = 'Confirmed';
      booking.paymentStatus = 'completed';
      booking.paymentIntentId = session.payment_intent;
      await booking.save();

      // Emit real-time notification to admin
      const io = req.app.get('socketio');
      if (io) {
        io.emit('venueBookingConfirmed', booking);
      }

      return res.json({ message: 'Venue booking confirmed', booking });
    }

    res.status(400).json({ message: 'Invalid booking type' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking fee based on tier
// @route   GET /api/payments/fee/:tierType
// @access  Public
exports.getBookingFee = async (req, res) => {
  try {
    const { tierType } = req.params;
    const fee = calculateBookingFee(tierType);
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
