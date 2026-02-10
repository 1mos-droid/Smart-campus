import axios from 'axios';

// Get the API URL from environment variables, with a fallback for local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Use an interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// You can also add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // For example, redirect to login or refresh token
      // For now, we just log out
      localStorage.removeItem('token');
      localStorage.removeItem('studentId');
      // This will force a reload and the AuthContext will handle the redirect
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
