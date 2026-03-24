import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { donorService } from '../../services/donorService';
import { recipientService } from '../../services/recipientService';
import { hospitalService } from '../../services/hospitalService';
import { requestService } from '../../services/requestService';
import { matchService } from '../../services/matchService';
import { auditService } from '../../services/auditService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Users, Hospital, FileText, CheckCircle2, Link, AlertCircle } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonors: 0,
    verifiedDonors: 0,
    totalRecipients: 0,
    approvedRecipients: 0,
    totalHospitals: 0,
    verifiedHospitals: 0,
    totalRequests: 0,
    totalMatches: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    const loadStats = async () => {
      try {
        setLoading(true);

        // Load all statistics
        const [donors, recipients, hospitals, requests, matches] = await Promise.all([
          donorService.getDonors(),
          recipientService.getRecipients?.(),
          hospitalService.getHospitals?.(),
          requestService.getRequests?.(),
          matchService.getMatches?.(),
        ].map(p => p.catch(() => [])));

        const verifiedDonors = donors?.filter((d: any) => d.donor_status === 'verified').length || 0;
        const approvedRecipients = recipients?.filter((r: any) => r.recipient_status === 'approved').length || 0;
        const verifiedHospitals = hospitals?.filter((h: any) => h.verification_status === 'verified').length || 0;

        setStats({
          totalDonors: donors?.length || 0,
          verifiedDonors,
          totalRecipients: recipients?.length || 0,
          approvedRecipients,
          totalHospitals: hospitals?.length || 0,
          verifiedHospitals,
          totalRequests: requests?.length || 0,
          totalMatches: matches?.length || 0,
        });

        // Load recent audit logs
        const logs = await auditService.getLogs();
        setRecentLogs(logs?.slice(0, 5) || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-600/50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-300 mb-4">{error}</p>
              <Button onClick={() => navigate('/')}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-400 mb-2">System Administration</h1>
            <p className="text-slate-400">Monitor platform statistics and manage all entities</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/audit-logs')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            View Audit Logs
          </Button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-blue-500 mb-2" />
              <p className="text-slate-400 text-sm">Donors</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-3xl font-bold text-blue-400">{stats.totalDonors}</p>
                <Badge variant="success">{stats.verifiedDonors} verified</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-purple-500 mb-2" />
              <p className="text-slate-400 text-sm">Recipients</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-3xl font-bold text-purple-400">{stats.totalRecipients}</p>
                <Badge variant="success">{stats.approvedRecipients} approved</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <Hospital className="h-6 w-6 text-indigo-500 mb-2" />
              <p className="text-slate-400 text-sm">Hospitals</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-3xl font-bold text-indigo-400">{stats.totalHospitals}</p>
                <Badge variant="success">{stats.verifiedHospitals} verified</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <Link className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-slate-400 text-sm">Matches</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-3xl font-bold text-green-400">{stats.totalMatches}</p>
                <Badge variant="default">{stats.totalRequests} requests</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Management */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400">User Management</CardTitle>
              <CardDescription>Manage donors, recipients, and hospitals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/users')}
              >
                👥 All Users
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/donors')}
              >
                🩸 Manage Donors ({stats.totalDonors})
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/recipients')}
              >
                👤 Manage Recipients ({stats.totalRecipients})
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/hospitals')}
              >
                🏥 Manage Hospitals ({stats.totalHospitals})
              </Button>
            </CardContent>
          </Card>

          {/* Verification Management */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400">Verification & Approval</CardTitle>
              <CardDescription>Review pending verifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="primary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/verify-donors')}
              >
                ✓ Verify Donors ({stats.totalDonors - stats.verifiedDonors})
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/approve-recipients')}
              >
                ✓ Approve Recipients ({stats.totalRecipients - stats.approvedRecipients})
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/verify-hospitals')}
              >
                ✓ Verify Hospitals ({stats.totalHospitals - stats.verifiedHospitals})
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/pending-requests')}
              >
                📋 Pending Requests
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Matching & Operations */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Matching */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Matching System
              </CardTitle>
              <CardDescription>Manage donor-recipient matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/matches')}
              >
                🔗 All Matches ({stats.totalMatches})
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/run-matching')}
              >
                ⚙️ Run Matching Algorithm
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/confirm-matches')}
              >
                ✓ Confirm Pending Matches
              </Button>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400">System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Platform Status</p>
                <Badge variant="success" className="mt-1">🟢 All Systems Operational</Badge>
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Organ Requests</p>
                <p className="text-lg font-bold text-red-300 mt-1">{stats.totalRequests}</p>
              </div>
              <Button 
                variant="secondary"
                className="w-full justify-start mt-2"
                onClick={() => navigate('/admin/system-settings')}
              >
                ⚙️ System Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-red-600/50">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Activity (Audit Logs)
            </CardTitle>
            <CardDescription>Latest system events and actions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No recent activity</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="text-left py-2 text-slate-400">Action</th>
                      <th className="text-left py-2 text-slate-400">Target</th>
                      <th className="text-left py-2 text-slate-400">Actor</th>
                      <th className="text-left py-2 text-slate-400">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log: any) => (
                      <tr key={log.id} className="border-b border-slate-800">
                        <td className="py-2 text-red-300">{log.action}</td>
                        <td className="py-2 text-slate-400">{log.target_type}</td>
                        <td className="py-2 text-slate-400">{log.actor_role || 'System'}</td>
                        <td className="py-2 text-slate-400 text-xs">
                          {new Date(log.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Button 
              variant="secondary"
              className="w-full mt-4"
              onClick={() => navigate('/admin/audit-logs')}
            >
              View Full Audit Logs
            </Button>
          </CardContent>
        </Card>

        {/* Admin Guidelines */}
        <Card className="border-red-600/50 bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-400">Administrator Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>🔸 All donors and recipients must be verified/approved before appearing in matches</p>
            <p>🔸 Hospitals must pass verification before managing users in their system</p>
            <p>🔸 The matching algorithm respects blood compatibility rules and location preferences</p>
            <p>🔸 All actions are logged in the audit system for compliance and transparency</p>
            <p>🔸 Contact support for database operations or system maintenance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
