import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hirepulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Expiry
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on authorization error if not on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('hirepulse_token');
        localStorage.removeItem('hirepulse_user');
      }
    }
    return Promise.reject(error.response?.data || { message: error.message || 'Network error occurred' });
  }
);

export default api;
