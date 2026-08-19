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
      return { success: false, error: error.response?.data?.error?.message || error.message || 'Login failed' };
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
      return { success: false, error: error.response?.data?.error?.message || error.message || 'Registration failed' };
    }
  };

  const updateUserProfile = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields
    };
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

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    register,
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

