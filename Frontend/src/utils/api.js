import axios from 'axios';
import { getCookie, deleteCookie } from './cookies';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
