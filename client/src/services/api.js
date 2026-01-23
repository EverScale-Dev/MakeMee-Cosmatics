import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Simple retry logic for network errors
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

api.interceptors.response.use(null, async (error) => {
  const config = error.config;

  // Only retry on network errors or 5xx server errors, not on 4xx client errors
  const shouldRetry = !error.response || (error.response.status >= 500 && error.response.status < 600);

  if (shouldRetry && config && !config._retryCount) {
    config._retryCount = 0;
  }

  if (shouldRetry && config && config._retryCount < MAX_RETRIES) {
    config._retryCount += 1;
    await sleep(RETRY_DELAY * config._retryCount);
    return api(config);
  }

  return Promise.reject(error);
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if user is in checkout or payment flow
      const currentPath = window.location.pathname;
      const protectedPaths = ['/checkout', '/order-success'];
      const isProtectedFlow = protectedPaths.some(path => currentPath.startsWith(path));

      if (!isProtectedFlow) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // For checkout flow, just reject the error - let the page handle it
    }
    return Promise.reject(error);
  }
);

export default api;
