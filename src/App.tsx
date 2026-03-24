import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

// Public & Auth Pages
import { Landing } from './pages/public/Landing';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { RoleSelection } from './pages/auth/RoleSelection';
import { Unauthorized } from './pages/errors/Unauthorized';
import { NotFound } from './pages/errors/NotFound';

// Onboarding Forms
import { DonorOnboarding } from './pages/onboarding/DonorOnboarding';
import { RecipientOnboarding } from './pages/onboarding/RecipientOnboarding';
import { HospitalOnboarding } from './pages/onboarding/HospitalOnboarding';

// Dashboards & Modules
import { DonorDashboard } from './pages/dashboards/DonorDashboard';
import { RecipientDashboard } from './pages/dashboards/RecipientDashboard';
import { HospitalDashboard } from './pages/dashboards/HospitalDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { Notifications } from './pages/dashboards/Notifications';

// Specific Views
import { DonorProfile } from './pages/profiles/DonorProfile';
import { RecipientProfile } from './pages/profiles/RecipientProfile';
import { DonorMatches } from './pages/matches/DonorMatches';
import { RecipientRequests } from './pages/requests/RecipientRequests';

import { HospitalDonors } from './pages/hospital/HospitalDonors';
import { HospitalRequests } from './pages/hospital/HospitalRequests';

import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminHospitals } from './pages/admin/AdminHospitals';
import { AdminMatches } from './pages/admin/AdminMatches';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

const AppRoutes = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary-600"></div></div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      <Route path="/role-selection" element={<ProtectedRoute requireProfileCompleted={false}><RoleSelection /></ProtectedRoute>} />

      {/* Onboarding Routes */}
      <Route path="/onboarding/donor" element={<ProtectedRoute requireProfileCompleted={false} allowedRoles={['donor']}><DonorOnboarding /></ProtectedRoute>}/>
      <Route path="/onboarding/recipient" element={<ProtectedRoute requireProfileCompleted={false} allowedRoles={['recipient']}><RecipientOnboarding /></ProtectedRoute>}/>
      <Route path="/onboarding/hospital" element={<ProtectedRoute requireProfileCompleted={false} allowedRoles={['hospital']}><HospitalOnboarding /></ProtectedRoute>}/>

      {/* Notifications - Shared Protected */}
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>}/>

      {/* Donor Routes */}
      <Route path="/donor/dashboard" element={<ProtectedRoute allowedRoles={['donor']}><DonorDashboard /></ProtectedRoute>} />
      <Route path="/donor/profile" element={<ProtectedRoute allowedRoles={['donor']}><DonorProfile /></ProtectedRoute>} />
      <Route path="/donor/matches" element={<ProtectedRoute allowedRoles={['donor']}><DonorMatches /></ProtectedRoute>} />
      
      {/* Recipient Routes */}
      <Route path="/recipient/dashboard" element={<ProtectedRoute allowedRoles={['recipient']}><RecipientDashboard /></ProtectedRoute>} />
      <Route path="/recipient/profile" element={<ProtectedRoute allowedRoles={['recipient']}><RecipientProfile /></ProtectedRoute>} />
      <Route path="/recipient/requests" element={<ProtectedRoute allowedRoles={['recipient']}><RecipientRequests /></ProtectedRoute>} />
      <Route path="/recipient/matches" element={<ProtectedRoute allowedRoles={['recipient']}><RecipientDashboard /></ProtectedRoute>} /> {/* Reusing Dashboard for matches overview easily */}

      {/* Hospital Routes */}
      <Route path="/hospital/dashboard" element={<ProtectedRoute allowedRoles={['hospital']}><HospitalDashboard /></ProtectedRoute>} />
      <Route path="/hospital/donors" element={<ProtectedRoute allowedRoles={['hospital']}><HospitalDonors /></ProtectedRoute>} />
      <Route path="/hospital/requests" element={<ProtectedRoute allowedRoles={['hospital']}><HospitalRequests /></ProtectedRoute>} />
      <Route path="/hospital/profile" element={<ProtectedRoute allowedRoles={['hospital']}><HospitalDashboard /></ProtectedRoute>} /> {/* Simplification */}
      <Route path="/hospital/matches" element={<ProtectedRoute allowedRoles={['hospital']}><HospitalRequests /></ProtectedRoute>} /> {/* Actionable from requests view */}

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']} requireProfileCompleted={false}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']} requireProfileCompleted={false}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/hospitals" element={<ProtectedRoute allowedRoles={['admin']} requireProfileCompleted={false}><AdminHospitals /></ProtectedRoute>} />
      <Route path="/admin/matches" element={<ProtectedRoute allowedRoles={['admin']} requireProfileCompleted={false}><AdminMatches /></ProtectedRoute>} />
      <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin']} requireProfileCompleted={false}><AdminAuditLogs /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
