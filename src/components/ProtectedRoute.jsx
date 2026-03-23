import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(getRole())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
