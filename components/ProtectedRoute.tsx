import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/70">Loading your workspace...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  // Force Password Change Logic
  if (profile.mustChangePassword) {
    // If they are not already on the profile page, redirect them
    if (location.pathname !== '/dashboard/profile') {
      return <Navigate to="/dashboard/profile" replace state={{ message: 'Please change your password to continue.' }} />;
    }
  }

  if (roles && !roles.includes(profile.role)) {
    return <Navigate to="/dashboard/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
