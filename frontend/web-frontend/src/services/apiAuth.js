import apiClient from './apiClient';

export const apiAuth = {
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },
  
  register: async (userData) => {
    return apiClient.post('/auth/signup', userData);
  },
  
  logout: async (token) => {
    return apiClient.post('/auth/logout', { token });
  }
};
