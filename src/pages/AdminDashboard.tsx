import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '../services/donorService';
import { neederService } from '../services/recipientService';
import { Database } from '../types/database.types';

type Donor = Database['public']['Tables']['donors']['Row'];
type Needer = Database['public']['Tables']['needers']['Row'];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [needers, setNeeders] = useState<Needer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'needers' | 'matching'>('overview');
  const [selectedNeeder, setSelectedNeeder] = useState<Needer | null>(null);
  const [showMatchingModal, setShowMatchingModal] = useState(false);

  useEffect(() => {
    const adminEmail = sessionStorage.getItem('adminEmail');
    if (!adminEmail) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [donorsData, needersData] = await Promise.all([
        donorService.getDonors(),
        neederService.getNeeders(),
      ]);
      setDonors(donorsData);
      setNeeders(needersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminEmail');
    navigate('/');
  };

  const handleMatchDonor = async (needer: Needer, donor: Donor) => {
    try {
      await neederService.assignDonorToNeeder(needer.id, donor.id);
      setShowMatchingModal(false);
      setSelectedNeeder(null);
      loadData();
      alert(`Successfully matched ${donor.full_name} with ${needer.full_name}`);
    } catch (err: any) {
      alert('Failed to match donor: ' + err.message);
    }
  };

  const getCompatibleDonors = (needer: Needer): Donor[] => {
    return donors.filter(
      (donor) =>
        donor.organ_type === needer.needed_organ &&
        donor.blood_group === needer.blood_group &&
        donor.donor_status === 'available'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-4 font-medium border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-4 py-4 font-medium border-b-2 transition ${
                activeTab === 'donors'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Donors ({donors.length})
            </button>
            <button
              onClick={() => setActiveTab('needers')}
              className={`px-4 py-4 font-medium border-b-2 transition ${
                activeTab === 'needers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Seekers ({needers.length})
            </button>
            <button
              onClick={() => setActiveTab('matching')}
              className={`px-4 py-4 font-medium border-b-2 transition ${
                activeTab === 'matching'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Matching
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Summary</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Total Donors</p>
                <p className="text-3xl font-bold text-blue-600">{donors.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Total Seekers</p>
                <p className="text-3xl font-bold text-green-600">{needers.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Matched</p>
                <p className="text-3xl font-bold text-purple-600">
                  {needers.filter((n) => n.needer_status === 'matched').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">Waiting</p>
                <p className="text-3xl font-bold text-orange-600">
                  {needers.filter((n) => n.needer_status === 'waiting').length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Donors Tab */}
        {activeTab === 'donors' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Donors</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Organ</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Blood</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">City</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donors.map((donor) => (
                      <tr key={donor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{donor.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{donor.organ_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{donor.blood_group}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{donor.city}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            donor.donor_status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {donor.donor_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{donor.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {donors.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  No donors registered yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Needers Tab */}
        {activeTab === 'needers' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Seekers</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Organ</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Blood</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Urgency</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {needers.map((needer) => (
                      <tr key={needer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{needer.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{needer.needed_organ}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{needer.blood_group}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`text-xs font-semibold ${
                            needer.urgency_level === 'critical'
                              ? 'text-red-600'
                              : needer.urgency_level === 'high'
                              ? 'text-orange-600'
                              : 'text-gray-600'
                          }`}>
                            {needer.urgency_level.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            needer.needer_status === 'matched'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {needer.needer_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => {
                              setSelectedNeeder(needer);
                              setShowMatchingModal(true);
                            }}
                            disabled={needer.needer_status === 'matched'}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-xs font-medium"
                          >
                            Match
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {needers.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  No seekers registered yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Matching Tab */}
        {activeTab === 'matching' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Match Donors with Seekers</h2>
            <div className="space-y-6">
              {needers.filter((n) => n.needer_status === 'waiting').map((needer) => {
                const compatibleDonors = getCompatibleDonors(needer);
                return (
                  <div key={needer.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{needer.full_name}</h3>
                    <p className="text-gray-600 mb-4">
                      Needs: <strong>{needer.needed_organ}</strong> | Blood: <strong>{needer.blood_group}</strong> | 
                      City: <strong>{needer.city}</strong> | Urgency: <strong className="text-red-600">{needer.urgency_level.toUpperCase()}</strong>
                    </p>
                    
                    {compatibleDonors.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Found {compatibleDonors.length} compatible donor{compatibleDonors.length !== 1 ? 's' : ''}:
                        </p>
                        <div className="space-y-2">
                          {compatibleDonors.map((donor) => (
                            <div
                              key={donor.id}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{donor.full_name}</p>
                                <p className="text-sm text-gray-600">
                                  {donor.city}, {donor.state} | Email: {donor.email}
                                </p>
                              </div>
                              <button
                                onClick={() => handleMatchDonor(needer, donor)}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
                              >
                                Confirm Match
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 italic">No compatible donors found at this time.</p>
                    )}
                  </div>
                );
              })}
              
              {needers.filter((n) => n.needer_status === 'waiting').length === 0 && (
                <div className="text-center py-12 text-gray-600">
                  No waiting seekers to match at this time.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Matching Modal */}
      {showMatchingModal && selectedNeeder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Match Donor</h2>
            <p className="text-gray-600 mb-4">
              Select a donor for <strong>{selectedNeeder.full_name}</strong>
            </p>
            
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {getCompatibleDonors(selectedNeeder).map((donor) => (
                <button
                  key={donor.id}
                  onClick={() => handleMatchDonor(selectedNeeder, donor)}
                  className="w-full text-left p-3 border border-gray-300 rounded hover:bg-blue-50 transition"
                >
                  <p className="font-medium text-gray-900">{donor.full_name}</p>
                  <p className="text-sm text-gray-600">{donor.city}, {donor.state}</p>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => {
                setShowMatchingModal(false);
                setSelectedNeeder(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
