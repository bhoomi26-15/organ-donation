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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Waiting for profile to be fetched (after login)
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If role is missing, force role selection
  if (!profile.role && location.pathname !== '/role-selection') {
    return <Navigate to="/role-selection" replace />;
  }

  // Role check
  if (allowedRoles && profile.role && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Profile completion check (except for onboarding routes)
  if (requireProfileCompleted && !profile.profile_completed && !location.pathname.startsWith('/onboarding')) {
    // Redirect to respective onboarding based on role
    if (profile.role === 'donor') return <Navigate to="/onboarding/donor" replace />;
    if (profile.role === 'recipient') return <Navigate to="/onboarding/recipient" replace />;
    if (profile.role === 'hospital') return <Navigate to="/onboarding/hospital" replace />;
    // Admin has no generic onboarding, defaults will pass if set manually in DB
  }

  return <>{children}</>;
};
