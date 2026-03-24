import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hospitalService } from '../../services/hospitalService';
import { donorService } from '../../services/donorService';
import { recipientService } from '../../services/recipientService';
import { requestService } from '../../services/requestService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function HospitalDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState<any>(null);
  const [stats, setStats] = useState({
    totalDonors: 0,
    verifiedDonors: 0,
    totalRecipients: 0,
    pendingRequests: 0,
  });
  const [pendingDonors, setPendingDonors] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      navigate('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        // Load hospital profile
        const hospitalData = await hospitalService.getHospitalByUserId(user.id);
        if (!hospitalData) {
          setError('Hospital profile not found');
          return;
        }
        setHospital(hospitalData);

        // Load eligible donors (those with organ types matching recipient needs)
        const donors = await donorService.getEligibleDonors();
        const recipients = await recipientService.getPendingRecipients();
        
        const pendingRequests = await requestService.getRequestsNeedingApproval();

        const verifiedCount = donors ? donors.filter((d: any) => d.donor_status === 'verified').length : 0;
        const pendingDonorsList = donors ? donors.filter((d: any) => d.donor_status === 'pending_verification').slice(0, 5) : [];

        setStats({
          totalDonors: donors?.length || 0,
          verifiedDonors: verifiedCount,
          totalRecipients: recipients?.length || 0,
          pendingRequests: pendingRequests?.length || 0,
        });

        setPendingDonors(pendingDonorsList);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-600/50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-300 mb-4">{error || 'Hospital profile not found'}</p>
              <Button onClick={() => navigate('/')}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-400 mb-2">Hospital Dashboard</h1>
          <p className="text-slate-400">{hospital.hospital_name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-red-500 mb-2" />
              <p className="text-slate-400 text-sm">Total Donors</p>
              <p className="text-3xl font-bold text-red-400">{stats.totalDonors}</p>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <CheckCircle2 className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-slate-400 text-sm">Verified Donors</p>
              <p className="text-3xl font-bold text-green-400">{stats.verifiedDonors}</p>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-blue-500 mb-2" />
              <p className="text-slate-400 text-sm">Total Recipients</p>
              <p className="text-3xl font-bold text-blue-400">{stats.totalRecipients}</p>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <Clock className="h-6 w-6 text-yellow-500 mb-2" />
              <p className="text-slate-400 text-sm">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.pendingRequests}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Hospital Info */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400">Hospital Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">License Number</p>
                <p className="text-red-300 font-medium">{hospital.license_number}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Verification Status</p>
                <Badge variant={hospital.verification_status === 'verified' ? 'success' : 'warning'}>
                  {hospital.verification_status?.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-400">Location</p>
                <p className="text-red-300 font-medium">{hospital.city}, {hospital.state}</p>
              </div>
              <Button 
                variant="secondary" 
                className="w-full mt-4"
                onClick={() => navigate('/hospital/profile')}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/hospital/donors')}
              >
                👥 View Linked Donors ({stats.totalDonors})
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/hospital/requests')}
              >
                📋 Review Pending Requests ({stats.pendingRequests})
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/matches')}
              >
                🔗 Manage Matches
              </Button>
              <Button 
                variant="primary" 
                className="w-full justify-start"
                onClick={() => navigate('/hospital/verify-donor')}
              >
                ✓ Verify Donor Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Donor Approvals */}
        <Card className="border-red-600/50">
          <CardHeader>
            <CardTitle className="text-red-400">Donors Pending Medical Verification</CardTitle>
            <CardDescription>Review and approve donor profiles</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingDonors.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No pending donor approvals</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="text-left py-2 text-slate-400">Name</th>
                      <th className="text-left py-2 text-slate-400">Age</th>
                      <th className="text-left py-2 text-slate-400">Blood</th>
                      <th className="text-left py-2 text-slate-400">Organs</th>
                      <th className="text-left py-2 text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDonors.map(donor => (
                      <tr key={donor.id} className="border-b border-slate-800 hover:bg-slate-900/30">
                        <td className="py-2 text-red-300">{donor.full_name}</td>
                        <td className="py-2 text-slate-400">{donor.age}</td>
                        <td className="py-2 text-slate-400">{donor.blood_group}</td>
                        <td className="py-2 text-slate-400">{donor.organ_types?.length || 0}</td>
                        <td className="py-2">
                          <Button 
                            variant="primary"
                            className="text-xs"
                            onClick={() => navigate(`/hospital/donor/${donor.id}`)}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="border-red-600/50 bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-400">Hospital Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>🔸 Hospital verification status must be "Verified" before managing donors/recipients</p>
            <p>🔸 All donor profiles require medical review before activation</p>
            <p>🔸 The system calculates matches automatically (40% blood compatibility, 30% organ match, 15% location)</p>
            <p>🔸 Contact support for access to donor/recipient documents</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
