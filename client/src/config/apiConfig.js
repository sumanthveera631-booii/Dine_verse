// API base URL configuration - works for both dev (via Vite proxy) and production
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export default API_BASE_URL;
