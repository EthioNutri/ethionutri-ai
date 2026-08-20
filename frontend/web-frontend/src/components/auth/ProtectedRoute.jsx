import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireOnboarded = true }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to /login page with return state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check onboarding status
  const isOnboarded = user?.isOnboarded ?? user?.is_onboarded ?? Boolean(user?.healthProfile || (user?.age && (user?.weightKg || user?.weight_kg)));

  if (requireOnboarded && isOnboarded === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;

