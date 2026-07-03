import axios from 'axios';

// Create an instance of Axios with default configurations
const API = axios.create({
  baseURL: window.location.hostname === 'localhost' ? 'https://localhost:7125/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Executed before every HTTP request is sent.
// It automatically retrieves the JWT token from localStorage and attaches it to the Authorization header.
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Attach the token in the standard HTTP format: Bearer [token]
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Executed when a response is received from the API.
// Allows us to globally handle common error statuses (like 401 Unauthorized).
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns a 401 Unauthorized status, it means our token is expired or invalid.
    if (error.response && error.response.status === 401) {
      // Clear expired auth session details
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // If we are not already on the login page, redirect the user
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
