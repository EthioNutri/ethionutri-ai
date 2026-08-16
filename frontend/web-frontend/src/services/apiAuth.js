import axios from 'axios';

// Mock base URL for now
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiAuth = {
  login: async (credentials) => {
    // Mocking the API call for now since we're just building UI
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if ((credentials.email === 'test@example.com' || credentials.email === '0911223344') && credentials.password === 'password') {
          resolve({ data: { user: { id: 1, name: 'Test User', email: credentials.email }, token: 'mock-jwt-token-123' } });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
    // Real implementation:
    // return api.post('/auth/login', credentials);
  },
  
  register: async (userData) => {
    // Mocking the API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { user: { id: 2, name: userData.fullName, email: userData.email }, token: 'mock-jwt-token-456' } });
      }, 1000);
    });
    // Real implementation:
    // return api.post('/auth/register', userData);
  },
  
  logout: async () => {
    // Mocking
    return new Promise((resolve) => setTimeout(resolve, 500));
    // Real implementation:
    // return api.post('/auth/logout');
  }
};

export default api;
