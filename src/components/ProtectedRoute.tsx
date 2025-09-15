import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Special handling for admin route
  if (role === 'admin') {
    const isSuperAdmin = user?.email === 'admin@paraboda.com' || user?.role === 'admin';
    if (!isSuperAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  // Check if we're in preview mode (no authentication required for non-admin)
  const isPreviewMode = role !== 'admin'; // Preview mode for all except admin

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-african mb-4"></div>
          <p className="text-gray-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access in preview mode or if user is authenticated with correct role
  if (isPreviewMode || (user && (!role || user.role === role))) {
    return <>{children}</>;
  }

  // If user exists but wrong role, redirect to auth
  if (user && user.role !== role) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If no user and not preview mode, redirect to auth
  return <Navigate to="/auth" state={{ from: location }} replace />;
};