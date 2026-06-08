import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, role, openAuthModal } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal(location.pathname);
    }
  }, [isAuthenticated, location, openAuthModal]);

  if (!isAuthenticated) {
    // Redirect standard users to landing `/` where they can log in via modal overlay
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute;
