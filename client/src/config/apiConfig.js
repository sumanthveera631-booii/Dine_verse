// API base URL configuration - prefer Vite env `VITE_API_URL`, fallback to production backend
const API_BASE_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'https://dineverse-2kkb.onrender.com/api';

export default API_BASE_URL;
