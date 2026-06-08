import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api/bookings';
const PAYMENT_API_URL = '/api/payments';

export const useBookingStore = create((set, get) => ({
  reservations: [],
  privateBookings: [],
  loading: false,
  error: null,

  fetchAllReservations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/reservations`);
      set({ reservations: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch standard reservations', loading: false });
    }
  },

  fetchAllPrivateBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/venue-bookings`);
      set({ privateBookings: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch private room bookings', loading: false });
    }
  },

  createReservation: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reserve`, bookingData);
      set((state) => ({
        reservations: [response.data, ...state.reservations],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Reservation booking failed';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  createPrivateBooking: async (venueData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/book-venue`, venueData);
      set((state) => ({
        privateBookings: [response.data, ...state.privateBookings],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Venue booking failed';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  // Initiate Stripe checkout for reservation
  initiateReservationPayment: async (reservationId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${PAYMENT_API_URL}/checkout-session/reservation`,
        { reservationId }
      );
      if (response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to initiate payment';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  // Initiate Stripe checkout for private venue
  initiateVenuePayment: async (venueBookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${PAYMENT_API_URL}/checkout-session/venue`,
        { venueBookingId }
      );
      if (response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to initiate payment';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  // Verify payment session
  verifyPaymentSession: async (sessionId, bookingType) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${PAYMENT_API_URL}/verify-session`, {
        sessionId,
        bookingType
      });
      
      if (bookingType === 'standard_table') {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r._id === response.data.reservation._id ? response.data.reservation : r
          ),
          loading: false,
        }));
      } else if (bookingType === 'private_venue') {
        set((state) => ({
          privateBookings: state.privateBookings.map((b) =>
            b._id === response.data.booking._id ? response.data.booking : b
          ),
          loading: false,
        }));
      }
      
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Payment verification failed';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  // Get booking fee
  getBookingFee: async (tierType = 'CASUAL_DINING') => {
    try {
      const response = await axios.get(`${PAYMENT_API_URL}/fee/${tierType}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch booking fee');
    }
  },

  updateReservationStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`${API_URL}/reservations/${id}/status`, { status });
      set((state) => ({
        reservations: state.reservations.map((booking) =>
          booking._id === id ? { ...booking, status: response.data.status } : booking
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update reservation';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  updatePrivateBookingStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`${API_URL}/venue-bookings/${id}/status`, { status });
      set((state) => ({
        privateBookings: state.privateBookings.map((booking) =>
          booking._id === id ? { ...booking, status: response.data.status } : booking
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update venue booking';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  }
}));
