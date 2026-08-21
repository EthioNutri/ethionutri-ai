import apiClient from './apiClient';

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const fallback = await apiClient.get('/profile');
      return fallback.data;
    }
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const fallback = await apiClient.put('/profile', profileData);
      return fallback.data;
    }
    throw error;
  }
};

export default {
  getUserProfile,
  updateUserProfile
};
