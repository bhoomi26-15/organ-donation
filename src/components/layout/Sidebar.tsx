import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Home, Users, Search, Bell, Settings, LogOut, FileText, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../ui/Button';

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const role = profile?.role;

  const links = [
    { name: 'Dashboard', to: `/${role}/dashboard`, icon: Home, roles: ['donor', 'recipient', 'hospital', 'admin'] },
    { name: 'My Profile', to: `/${role}/profile`, icon: Users, roles: ['donor', 'recipient', 'hospital'] },
    { name: 'Find Matches', to: `/${role}/matches`, icon: Search, roles: ['donor', 'recipient', 'hospital'] },
    { name: 'My Requests', to: `/${role}/requests`, icon: ClipboardList, roles: ['recipient', 'hospital'] },
    { name: 'Linked Donors', to: `/hospital/donors`, icon: Heart, roles: ['hospital'] },
    { name: 'All Users', to: `/admin/users`, icon: Users, roles: ['admin'] },
    { name: 'Hospitals', to: `/admin/hospitals`, icon: FileText, roles: ['admin'] },
    { name: 'All Matches', to: `/admin/matches`, icon: Search, roles: ['admin'] },
    { name: 'Audit Logs', to: `/admin/logs`, icon: ClipboardList, roles: ['admin'] },
  ];

  const allowedLinks = links.filter(link => role && link.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <Heart className="h-6 w-6 text-rose-500 mr-2" />
        <span className="text-white font-bold text-lg tracking-tight">LifeLink</span>
      </div>
      
      <div className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Menu
        </div>
        <nav className="space-y-1 px-3">
          {allowedLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )
              }
            >
              <link.icon className="flex-shrink-0 mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-300" />
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={signOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="flex-shrink-0 mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-300" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
