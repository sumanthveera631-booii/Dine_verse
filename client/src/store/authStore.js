import { create } from 'zustand';
import axios from 'axios';

// Ensure base URL matches our config proxy or server
const API_URL = '/api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('dineverse_user')) || null,
  token: localStorage.getItem('dineverse_token') || null,
  isAuthenticated: !!localStorage.getItem('dineverse_token'),
  role: localStorage.getItem('dineverse_role') || null,
  wishlist: JSON.parse(localStorage.getItem('dineverse_wishlist')) || [],
  userReservations: [],
  userVenueBookings: [],
  authModalOpen: false,
  authModalRedirectPath: null,
  loading: false,
  error: null,

  openAuthModal: (redirectPath = null) => {
    set({ authModalOpen: true, authModalRedirectPath: redirectPath, error: null });
  },

  closeAuthModal: () => {
    set({ authModalOpen: false, authModalRedirectPath: null, error: null });
  },

  setAuthHeaders: (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;

      localStorage.setItem('dineverse_token', token);
      localStorage.setItem('dineverse_user', JSON.stringify(user));
      localStorage.setItem('dineverse_role', user.role);
      
      get().setAuthHeaders(token);

      set({
        token,
        user,
        role: user.role,
        isAuthenticated: true,
        loading: false,
        authModalOpen: false,
      });

      // Synchronize their wishlist and reservations
      await get().fetchWishlist();
      await get().fetchUserReservations();
      await get().fetchUserVenueBookings();

      return user;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to authenticate';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  register: async (name, email, password, role = 'user') => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
      const { token, user } = response.data;

      localStorage.setItem('dineverse_token', token);
      localStorage.setItem('dineverse_user', JSON.stringify(user));
      localStorage.setItem('dineverse_role', user.role);

      get().setAuthHeaders(token);

      set({
        token,
        user,
        role: user.role,
        isAuthenticated: true,
        loading: false,
        authModalOpen: false,
      });

      await get().fetchWishlist();
      await get().fetchUserReservations();
      await get().fetchUserVenueBookings();

      return user;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to register account';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  logout: () => {
    localStorage.removeItem('dineverse_token');
    localStorage.removeItem('dineverse_user');
    localStorage.removeItem('dineverse_role');
    localStorage.removeItem('dineverse_wishlist');
    
    get().setAuthHeaders(null);

    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      wishlist: [],
      userReservations: [],
      userVenueBookings: [],
    });
  },

  fetchWishlist: async () => {
    if (!get().isAuthenticated) return;
    try {
      const response = await axios.get(`${API_URL}/auth/wishlist`);
      set({ wishlist: response.data });
      localStorage.setItem('dineverse_wishlist', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  },

  toggleWishlist: async (menuItemId) => {
    if (!get().isAuthenticated) {
      get().openAuthModal();
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/auth/wishlist/toggle`, { menuItemId });
      set({ wishlist: response.data });
      localStorage.setItem('dineverse_wishlist', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
    }
  },

  fetchUserReservations: async () => {
    if (!get().isAuthenticated) return;
    try {
      const response = await axios.get(`${API_URL}/bookings/my-reservations`);
      set({ userReservations: response.data });
    } catch (error) {
      console.error('Error fetching user reservations:', error);
    }
  },

  fetchUserVenueBookings: async () => {
    if (!get().isAuthenticated) return;
    try {
      const response = await axios.get(`${API_URL}/bookings/my-venue-bookings`);
      set({ userVenueBookings: response.data });
    } catch (error) {
      console.error('Error fetching user private room bookings:', error);
    }
  }
}));

// Set token in headers immediately upon loading file
const token = localStorage.getItem('dineverse_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
