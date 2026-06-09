import { create } from 'zustand';
import axios from 'axios';

const BASE_API_URL = process.env.REACT_APP_API_URL || 'https://dineverse-2kkb.onrender.com/api';
const API_URL = `${BASE_API_URL}/menu`;

export const useMenuStore = create((set, get) => ({
  menuItems: [],
  loading: false,
  error: null,
  categoryFilter: 'All',

  setCategoryFilter: (category) => {
    set({ categoryFilter: category });
  },

  fetchMenuItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ menuItems: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to retrieve menu items', loading: false });
    }
  },

  addMenuItem: async (itemData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(API_URL, itemData);
      set((state) => ({
        menuItems: [response.data, ...state.menuItems],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add menu item';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  updateMenuItem: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      set((state) => ({
        menuItems: state.menuItems.map((item) => (item._id === id ? response.data : item)),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update menu item';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },

  deleteMenuItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        menuItems: state.menuItems.filter((item) => item._id !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete menu item';
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  }
}));
