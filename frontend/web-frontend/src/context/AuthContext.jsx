import { createContext, useState, useContext } from 'react';
import { apiAuth } from '../services/apiAuth';

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('auth_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    // Corrupted saved data — clear it so the user can sign in again
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token && user));

  const login = async (credentials) => {
    try {
      const response = await apiAuth.login(credentials);
      const { user: userData, token: jwtToken } = response.data;

      setToken(jwtToken);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('auth_token', jwtToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiAuth.register(userData);
      const { user: newUserData, token: jwtToken } = response.data;

      setToken(jwtToken);
      setUser(newUserData);
      setIsAuthenticated(true);

      localStorage.setItem('auth_token', jwtToken);
      localStorage.setItem('auth_user', JSON.stringify(newUserData));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    // Optional: make API call to invalidate token on server
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    register,
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
