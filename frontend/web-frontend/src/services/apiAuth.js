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
  },

  googleLogin: async (idToken) => {
    return apiClient.post('/auth/google', { idToken });
  },

  forgotPassword: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async ({ email, token, newPassword }) => {
    return apiClient.post('/auth/reset-password', { email, token, newPassword });
  }
};
