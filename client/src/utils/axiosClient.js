import axios from "axios";
import { increment, decrement } from "./loadingService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    increment();
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
