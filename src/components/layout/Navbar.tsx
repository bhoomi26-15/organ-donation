import React from 'react';
import { Bell, Menu, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { profile } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
      <div className="flex items-center flex-1">
        <button className="md:hidden p-2 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/notifications" className="p-2 text-slate-400 hover:text-slate-500 relative transition-colors">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
          {/* Notification Badge Placeholder */}
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        </Link>

        {/* Profile dropdown Placeholder */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-slate-900">{profile?.full_name || 'User'}</span>
            <span className="text-xs text-slate-500 capitalize">{profile?.role || 'Guest'}</span>
          </div>
          {profile?.avatar_url ? (
            <img
              className="h-9 w-9 rounded-full object-cover border border-slate-200"
              src={profile.avatar_url}
              alt="Avatar"
            />
          ) : (
            <UserCircle className="h-9 w-9 text-slate-400" />
          )}
        </div>
      </div>
    </header>
  );
}
