import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types/database.types';

type Role = Database['public']['Tables']['profiles']['Row']['role'];

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireProfileCompleted?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireProfileCompleted = true
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If on role-selection page, allow it even if profile isn't fully loaded
  if (location.pathname === '/role-selection') {
    return <>{children}</>;
  }

  // Waiting for profile to be fetched (after login)
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // If role is missing, force role selection
  if (!profile.role) {
    return <Navigate to="/role-selection" replace />;
  }

  // Role check - verify user has allowed role
  if (allowedRoles && profile.role && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Profile completion check (except for onboarding routes and admin)
  if (requireProfileCompleted && !profile.profile_completed && !location.pathname.startsWith('/onboarding')) {
    // Redirect to respective onboarding based on role
    if (profile.role === 'donor') return <Navigate to="/onboarding/donor" replace />;
    if (profile.role === 'recipient') return <Navigate to="/onboarding/recipient" replace />;
    if (profile.role === 'hospital') return <Navigate to="/onboarding/hospital" replace />;
    if (profile.role === 'admin') return <>{children}</>; // Admin can proceed without profile completion
  }

  return <>{children}</>;
};
