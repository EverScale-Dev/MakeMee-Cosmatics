import axios from "axios";
import { increment, decrement } from "./loadingService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    increment();
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
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
