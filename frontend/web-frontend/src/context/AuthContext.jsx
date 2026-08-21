import { createContext, useState, useContext, useEffect } from 'react';
import { apiAuth } from '../services/apiAuth';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('auth_token')));

  const login = async (credentials) => {
    try {
      const response = await apiAuth.login(credentials);
      const { user: userData, accessToken, refreshToken } = response.data;
      
      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      let errMsg = error.response?.data?.error?.message || error.message || 'Login failed';
      if (error.code === 'ERR_NETWORK' || !error.response) {
        errMsg = 'Unable to connect to EthioNutri server. Please ensure the backend is running at ' + (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');
      }
      return { success: false, error: errMsg };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiAuth.register(userData);
      const { user: newUserData, accessToken, refreshToken } = response.data;
      
      setToken(accessToken);
      setUser(newUserData);
      setIsAuthenticated(true);

      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('auth_user', JSON.stringify(newUserData));

      return { success: true };
    } catch (error) {
      let errMsg = error.response?.data?.error?.message || error.message || 'Registration failed';
      if (error.code === 'ERR_NETWORK' || !error.response) {
        errMsg = 'Unable to connect to EthioNutri server. Please ensure the backend is running at ' + (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');
      }
      return { success: false, error: errMsg };
    }
  };

  const updateUserProfile = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields
    };
    delete updatedUser.profile_picture;
    delete updatedUser.profilePhotoUrl;
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    return { success: true };
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiAuth.logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const response = await apiAuth.googleLogin(idToken);
      const { user: userData, accessToken, refreshToken, isNewUser } = response.data;

      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      return { success: true, isNewUser: isNewUser || response.status === 201 };
    } catch (error) {
      const errCode = error.response?.data?.error?.code || error.response?.data?.code;
      let errMsg = error.response?.data?.error?.message || error.message || 'Google Authentication failed';
      if (errCode === 'EMAIL_EXISTS_DIFFERENT_PROVIDER') {
        errMsg = 'An account with this email already exists. Please sign in with your email and password instead.';
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        errMsg = 'Unable to connect to EthioNutri server. Please ensure the backend is running at ' + (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');
      }
      return { success: false, error: errMsg, code: errCode };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    googleLogin,
    updateUserProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

