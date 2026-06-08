/**
 * STRIPE PAYMENT INTEGRATION GUIDE
 * ================================
 * 
 * This guide shows how to integrate Stripe payments into your existing reservations
 * and private dining booking flows.
 * 
 * SETUP REQUIREMENTS:
 * ==================
 * 1. Install Stripe packages:
 *    npm install stripe --save (backend)
 *    npm install @stripe/react-stripe-js @stripe/js (frontend - optional for advanced features)
 * 
 * 2. Set environment variables:
 *    Backend (.env):
 *    - STRIPE_SECRET_KEY=sk_test_... (get from Stripe Dashboard)
 *    - STRIPE_PUBLISHABLE_KEY=pk_test_... (for client-side use if needed)
 *    - CLIENT_URL=http://localhost:5173 (for redirect URLs)
 * 
 * 3. Payment Routes mounted at: /api/payments
 * 
 * 
 * INTEGRATION POINTS:
 * ===================
 * 
 * 1. RESERVATION BOOKING FLOW
 * ---------------------------
 * 
 * // Step 1: Create reservation first (without payment)
 * const reservation = await useBookingStore.createReservation({
 *   date: '2024-06-15',
 *   timeSlot: '19:00',
 *   guestCount: 4,
 *   specialRequests: 'Window seating preferred'
 * });
 * 
 * // Step 2: Initiate payment
 * await useBookingStore.initiateReservationPayment(reservation._id);
 * // This redirects to Stripe Checkout
 * 
 * // Step 3: After successful payment, Stripe redirects to:
 * // ${CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}
 * 
 * // Step 4: PaymentSuccessPage verifies session and updates reservation status to 'Confirmed'
 * 
 * 
 * 2. PRIVATE VENUE BOOKING FLOW
 * ----------------------------
 * 
 * // Step 1: Create private venue booking first
 * const booking = await useBookingStore.createPrivateBooking({
 *   roomTitle: 'The Obsidian Lounge',
 *   date: '2024-06-15',
 *   timeSlot: '19:00',
 *   guestCount: 12,
 *   contactNumber: '+91-9876543210',
 *   specialRequests: 'Special catering request'
 * });
 * 
 * // Step 2: Initiate payment
 * await useBookingStore.initiateVenuePayment(booking._id);
 * 
 * // Step 3-4: Same as reservation flow
 * 
 * 
 * TIERED PRICING:
 * ==============
 * 
 * Pricing tiers (in Indian Rupees via paise):
 * - CASUAL_DINING: ₹200 (20,000 paise)
 * - PREMIUM_RESTAURANT: ₹1,000 (100,000 paise)
 * - VIP_BOUTIQUE: ₹2,500 (250,000 paise)
 * 
 * Usage:
 * const fee = await useBookingStore.getBookingFee('VIP_BOUTIQUE');
 * console.log(fee.amountINR); // 2500
 * 
 * 
 * FRONTEND IMPLEMENTATION EXAMPLE:
 * ===============================
 * 
 * In ReservationsPage.jsx or PrivateDiningPage.jsx:
 * 
 * const handlePaymentClick = async (bookingId) => {
 *   try {
 *     setLoading(true);
 *     await initiateReservationPayment(bookingId);
 *     // User is redirected to Stripe Checkout automatically
 *   } catch (error) {
 *     console.error('Payment initiation failed:', error);
 *     setError('Failed to initiate payment');
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 * 
 * // In your booking button:
 * <button onClick={() => handlePaymentClick(booking._id)}>
 *   Proceed to Payment
 * </button>
 * 
 * 
 * PAYMENT SUCCESS HANDLING:
 * ========================
 * 
 * Add this to your App.jsx routing:
 * 
 * import PaymentSuccessPage from './pages/PaymentSuccessPage';
 * 
 * <Route path="/payment-success" element={<PaymentSuccessPage bookingType="standard_table" />} />
 * <Route path="/payment-success/venue" element={<PaymentSuccessPage bookingType="private_venue" />} />
 * 
 * 
 * BACKEND WORKFLOW:
 * ================
 * 
 * 1. /POST /api/payments/checkout-session/reservation
 *    - Accepts: { reservationId }
 *    - Returns: { sessionId, url }
 *    - Stores stripeSessionId in reservation document
 *    - Sets paymentStatus to 'pending'
 * 
 * 2. /POST /api/payments/checkout-session/venue
 *    - Accepts: { venueBookingId }
 *    - Returns: { sessionId, url }
 *    - Stores stripeSessionId in venue booking document
 * 
 * 3. /POST /api/payments/verify-session
 *    - Accepts: { sessionId, bookingType }
 *    - Verifies payment completion via Stripe
 *    - Updates booking/reservation status to 'Confirmed'
 *    - Emits real-time Socket.IO event for admin notifications
 * 
 * 4. /GET /api/payments/fee/:tierType
 *    - Returns fee details for given tier
 * 
 * 
 * WEBHOOK HANDLING (ADVANCED):
 * ===========================
 * 
 * For production, implement Stripe webhooks:
 * 1. Add webhook endpoint at /api/payments/webhook
 * 2. Listen for: payment_intent.succeeded, payment_intent.payment_failed
 * 3. Update booking status accordingly
 * 4. Handle refunds and disputes
 * 
 * 
 * ERROR HANDLING:
 * ==============
 * 
 * - Session not found: User navigates directly to success URL without completing payment
 * - Payment not completed: paymentStatus remains 'pending', booking not confirmed
 * - Unauthorized access: User tries to pay for another user's booking (403 Forbidden)
 * 
 * 
 * TESTING:
 * =======
 * 
 * Use Stripe test cards:
 * - Success: 4242 4242 4242 4242
 * - Decline: 4000 0000 0000 0002
 * - Incomplete: 4000 0000 0000 3220
 * 
 * Expiry: Any future date
 * CVC: Any 3 digits
 * 
 * 
 * DATABASE SCHEMA UPDATES:
 * =======================
 * 
 * Both Reservation and PrivateBooking models now include:
 * - paymentStatus: 'pending' | 'completed' | 'failed'
 * - stripeSessionId: string
 * - paymentIntentId: string
 * - bookingFee: number (in paise)
 * 
 */

// Example integration in a React component:
export const PaymentIntegrationExample = () => {
  const { initiateReservationPayment, loading, error } = useBookingStore();

  const handleBookNowWithPayment = async (reservationData) => {
    try {
      // 1. Create reservation first
      const reservation = await useBookingStore.createReservation(reservationData);
      
      // 2. Initiate payment (this will redirect to Stripe)
      await initiateReservationPayment(reservation._id);
      
    } catch (err) {
      console.error('Booking with payment failed:', err.message);
    }
  };

  return (
    <button 
      onClick={() => handleBookNowWithPayment({...bookingData})}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Book Now & Pay'}
    </button>
  );
};

export default PaymentIntegrationExample;
