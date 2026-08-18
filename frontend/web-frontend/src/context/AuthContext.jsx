import { createContext, useState, useContext } from 'react';
import { apiAuth } from '../services/apiAuth';

const AuthContext = createContext();

const DEFAULT_DEMO_USER = {
  id: 1,
  name: 'Selamawit Kebede',
  fullName: 'Selamawit Kebede',
  email: 'selamawit@ethionutri.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  bio: 'Wellness enthusiast passionate about Ethiopian plant-based fasting and traditional recipes.',
  phone: '+251 91 123 4567'
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      return {
        ...DEFAULT_DEMO_USER,
        ...parsed,
        name: parsed.name || parsed.fullName || DEFAULT_DEMO_USER.name,
        avatar: parsed.avatar || DEFAULT_DEMO_USER.avatar
      };
    }
    return DEFAULT_DEMO_USER;
  } catch {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return DEFAULT_DEMO_USER;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || 'demo-token');
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('auth_token')));

  const login = async (credentials) => {
    try {
      const response = await apiAuth.login(credentials);
      const { user: userData, token: jwtToken } = response.data;
      const fullUserData = {
        ...DEFAULT_DEMO_USER,
        ...userData,
        name: userData.name || userData.fullName || credentials.email.split('@')[0] || DEFAULT_DEMO_USER.name,
        email: credentials.email
      };

      setToken(jwtToken);
      setUser(fullUserData);
      setIsAuthenticated(true);

      localStorage.setItem('auth_token', jwtToken);
      localStorage.setItem('auth_user', JSON.stringify(fullUserData));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiAuth.register(userData);
      const { user: newUserData, token: jwtToken } = response.data;
      const fullUserData = {
        ...DEFAULT_DEMO_USER,
        ...newUserData,
        name: userData.fullName || userData.name || 'Abebe Bikila',
        email: userData.email
      };

      setToken(jwtToken);
      setUser(fullUserData);
      setIsAuthenticated(true);

      localStorage.setItem('auth_token', jwtToken);
      localStorage.setItem('auth_user', JSON.stringify(fullUserData));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const updateUserProfile = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields,
      name: updatedFields.name || updatedFields.fullName || user.name
    };
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    return { success: true };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const value = {
    user: user || DEFAULT_DEMO_USER,
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
