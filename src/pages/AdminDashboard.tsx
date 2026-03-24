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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">LifeLink</h1>
            <p className="text-blue-100 mt-1 font-medium">Admin Control Center</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition duration-200 shadow-md active:scale-95"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-lg shadow font-medium">
            {error}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {['overview', 'donors', 'needers', 'matching'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-4 font-semibold border-b-4 transition duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'donors' && `Donors (${donors.length})`}
                {tab === 'needers' && `Seekers (${needers.length})`}
                {tab === 'matching' && 'Matching'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Executive Summary</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Total Donors</p>
                    <p className="text-4xl font-bold text-blue-600">{donors.length}</p>
                  </div>
                  <div className="text-5xl text-blue-100">♥</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-green-600 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Total Seekers</p>
                    <p className="text-4xl font-bold text-green-600">{needers.length}</p>
                  </div>
                  <div className="text-5xl text-green-100">👥</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-purple-600 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Matched</p>
                    <p className="text-4xl font-bold text-purple-600">
                      {needers.filter((n) => n.needer_status === 'matched').length}
                    </p>
                  </div>
                  <div className="text-5xl text-purple-100">✓</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-orange-600 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Waiting</p>
                    <p className="text-4xl font-bold text-orange-600">
                      {needers.filter((n) => n.needer_status === 'waiting').length}
                    </p>
                  </div>
                  <div className="text-5xl text-orange-100">⏳</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donors Tab */}
        {activeTab === 'donors' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Donors</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Organ</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Blood</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">City</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donors.map((donor, idx) => (
                      <tr key={donor.id} className={`hover:bg-blue-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{donor.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{donor.organ_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{donor.blood_group}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{donor.city}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            donor.donor_status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {donor.donor_status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{donor.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {donors.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium">No donors registered yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Needers Tab */}
        {activeTab === 'needers' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Seekers</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-green-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Organ</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Blood</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Urgency</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {needers.map((needer, idx) => (
                      <tr key={needer.id} className={`hover:bg-green-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{needer.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{needer.needed_organ}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{needer.blood_group}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded font-bold text-xs ${
                            needer.urgency_level === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : needer.urgency_level === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : needer.urgency_level === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {needer.urgency_level.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            needer.needer_status === 'matched'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {needer.needer_status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => {
                              setSelectedNeeder(needer);
                              setShowMatchingModal(true);
                            }}
                            disabled={needer.needer_status === 'matched'}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-xs font-bold transition"
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
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium">No seekers registered yet</p>
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
                  <div key={needer.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{needer.full_name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                        <span><strong>Organ:</strong> {needer.needed_organ}</span>
                        <span><strong>Blood:</strong> {needer.blood_group}</span>
                        <span><strong>City:</strong> {needer.city}</span>
                        <span><strong>Urgency:</strong> <span className="text-red-600 font-bold">{needer.urgency_level.toUpperCase()}</span></span>
                      </div>
                    </div>
                    
                    {compatibleDonors.length > 0 ? (
                      <div>
                        <p className="text-sm font-bold text-blue-600 mb-4">
                          ✓ Found {compatibleDonors.length} compatible donor{compatibleDonors.length !== 1 ? 's' : ''}
                        </p>
                        <div className="space-y-3">
                          {compatibleDonors.map((donor) => (
                            <div
                              key={donor.id}
                              className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 hover:border-blue-400 transition"
                            >
                              <div>
                                <p className="font-bold text-gray-900">{donor.full_name}</p>
                                <p className="text-sm text-gray-600">
                                  {donor.city}, {donor.state} | {donor.email}
                                </p>
                              </div>
                              <button
                                onClick={() => handleMatchDonor(needer, donor)}
                                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm transition"
                              >
                                Match
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 italic bg-gray-50 p-3 rounded">
                        ✗ No compatible donors found at this time
                      </p>
                    )}
                  </div>
                );
              })}
              
              {needers.filter((n) => n.needer_status === 'waiting').length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg font-medium">No waiting seekers at this time</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showMatchingModal && selectedNeeder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 transform transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Donor</h2>
            <p className="text-gray-600 mb-6">
              Select a compatible donor for <strong className="text-blue-600">{selectedNeeder.full_name}</strong>
            </p>
            
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {getCompatibleDonors(selectedNeeder).map((donor) => (
                <button
                  key={donor.id}
                  onClick={() => handleMatchDonor(selectedNeeder, donor)}
                  className="w-full text-left p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition font-medium"
                >
                  <p className="text-gray-900 font-bold">{donor.full_name}</p>
                  <p className="text-sm text-gray-600">{donor.city}, {donor.state}</p>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => {
                setShowMatchingModal(false);
                setSelectedNeeder(null);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 font-bold transition"
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
