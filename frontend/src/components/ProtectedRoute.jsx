import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated() && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const redirectPath = getRedirectPath(user?.role);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const getRedirectPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'instructor':
      return '/instructor/dashboard';
    case 'student':
      return '/dashboard';
    default:
      return '/';
  }
};

export default ProtectedRoute;