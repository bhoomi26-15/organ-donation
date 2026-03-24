import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Heart, Check, X } from 'lucide-react';
import { donorService } from '../services/donorService';
import { neederService } from '../services/recipientService';
import { Button } from '../components/ui/Button';

interface Donor {
  id: string;
  full_name: string;
  blood_group: string;
  organ_type: string;
  city: string;
  email: string;
  created_at: string;
}

interface Seeker {
  id: string;
  full_name: string;
  blood_group: string;
  needed_organ: string;
  urgency_level: string;
  city: string;
  email: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [seekers, setSeekers] = useState<Seeker[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'donors' | 'seekers'>('donors');
  const [error, setError] = useState('');

  useEffect(() => {
    const adminEmail = sessionStorage.getItem('adminEmail');
    if (!adminEmail) {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [donorsData, seekersData] = await Promise.all([
        donorService.getDonors(),
        neederService.getNeeders(),
      ]);
      setDonors(donorsData as Donor[]);
      setSeekers(seekersData as Seeker[]);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminEmail');
    navigate('/');
  };

  const getUrgencyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage donors and seekers</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Donors</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{donors.length}</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Seekers</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{seekers.length}</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                <Heart className="h-7 w-7 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('donors')}
              className={`py-4 px-2 font-medium transition-colors ${
                activeTab === 'donors'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Donors ({donors.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('seekers')}
              className={`py-4 px-2 font-medium transition-colors ${
                activeTab === 'seekers'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Seekers ({seekers.length})
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin h-6 w-6 border-2 border-red-600 border-t-transparent rounded-full"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          </div>
        ) : activeTab === 'donors' ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Blood Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Organ</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">City</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                        No donors registered yet
                      </td>
                    </tr>
                  ) : (
                    donors.map((donor, idx) => (
                      <tr key={donor.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{donor.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                            {donor.blood_group}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{donor.organ_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{donor.city}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{donor.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(donor.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Organ Needed</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Blood Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Urgency</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">City</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {seekers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                        No seekers registered yet
                      </td>
                    </tr>
                  ) : (
                    seekers.map((seeker, idx) => (
                      <tr key={seeker.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{seeker.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{seeker.needed_organ}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium">
                            {seeker.blood_group}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full border font-medium ${getUrgencyColor(seeker.urgency_level)}`}>
                            {seeker.urgency_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{seeker.city}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{seeker.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(seeker.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
