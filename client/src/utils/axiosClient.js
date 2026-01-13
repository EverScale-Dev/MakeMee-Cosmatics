import axios from "axios";
import { increment, decrement } from "./loadingService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    increment();
    // Add auth token if available (don't overwrite if already set)
    if (typeof window !== 'undefined' && !config.headers.Authorization) {
      // Check for admin token first, then user token
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('token');
      const token = adminToken || userToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    decrement();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    decrement();
    return response;
  },
  (error) => {
    decrement();
    return Promise.reject(error);
  }
);

export default api;
