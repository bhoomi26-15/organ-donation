import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { donorService } from '../../services/donorService';
import { matchService } from '../../services/matchService';
import { notificationService } from '../../services/notificationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Heart, MapPin, Phone, Mail, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Match {
  id: string;
  recipient_id: string;
  match_score: number;
  status: string;
  created_at: string;
}

export function DonorDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [donor, setDonor] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      navigate('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load donor profile
        const donorData = await donorService.getDonorByUserId(user.id);
        if (!donorData) {
          setError('Donor profile not found');
          return;
        }
        setDonor(donorData);

        // Load matches
        const matchesData = await matchService.getMatches({ donor_id: donorData.id });
        setMatches(matchesData || []);

        // Load recent notifications
        const notificationsData = await notificationService.getNotifications(user.id);
        setNotifications(notificationsData.slice(0, 5) || []);
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

  if (error || !donor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-600/50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-300 mb-4">{error || 'Donor profile not found'}</p>
              <Button onClick={() => navigate('/')}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending_verification':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-400 mb-2">Donor Dashboard</h1>
          <p className="text-slate-400">Welcome, {donor.full_name}</p>
        </div>

        {/* Profile Summary Card */}
        <Card className="border-red-600/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-red-400">Profile Summary</CardTitle>
                <CardDescription>Your donation profile status</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Status:</span>
                <Badge variant={donor.donor_status === 'verified' ? 'success' : 'warning'}>
                  {donor.donor_status?.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Full Name</p>
                <p className="text-red-300 font-medium">{donor.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Age / Blood Group</p>
                <p className="text-red-300 font-medium">{donor.age} years / {donor.blood_group}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Contact</p>
                <div className="flex items-center gap-2 text-red-300">
                  <Phone className="h-4 w-4" />
                  <span>{donor.phone}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Location</p>
                <div className="flex items-center gap-2 text-red-300">
                  <MapPin className="h-4 w-4" />
                  <span>{donor.city}, {donor.state}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-2">Available Organs</p>
              <div className="flex flex-wrap gap-2">
                {donor.organ_types?.map((organ: string) => (
                  <Badge key={organ} variant="primary">{organ}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="primary" onClick={() => navigate('/donor/profile')}>
                Edit Profile
              </Button>
              <Button variant="secondary" onClick={() => navigate('/donor/documents')}>
                Manage Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Matches Card */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Potential Matches ({matches.length})
              </CardTitle>
              <CardDescription>Recipients waiting for organs like yours</CardDescription>
            </CardHeader>
            <CardContent>
              {matches.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No matches found yet</p>
              ) : (
                <div className="space-y-2">
                  {matches.slice(0, 3).map(match => (
                    <div key={match.id} className="p-3 bg-slate-900/50 rounded border border-slate-700 hover:border-red-600/50 transition cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-red-300">Match ID: {match.id.slice(0, 8)}</p>
                          <p className="text-sm text-slate-400">Status: {match.status}</p>
                        </div>
                        <Badge variant={match.match_score >= 80 ? 'success' : 'warning'}>
                          {Math.round(match.match_score)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {matches.length > 3 && (
                    <Button 
                      variant="secondary" 
                      className="w-full mt-2"
                      onClick={() => navigate('/donor/matches')}
                    >
                      View All Matches
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400">Recent Notifications</CardTitle>
              <CardDescription>Latest updates about your profile</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No notifications yet</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map(notif => (
                    <div key={notif.id} className="p-3 bg-slate-900/50 rounded border border-slate-700">
                      <p className="text-sm font-medium text-red-300">{notif.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  <Button 
                    variant="secondary" 
                    className="w-full mt-2"
                    onClick={() => navigate('/notifications')}
                  >
                    View All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Profile Status</p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon(donor.donor_status)}
                <span className="text-red-300 font-bold">
                  {donor.donor_status === 'verified' ? 'Verified' : 'Pending'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Total Matches</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{matches.length}</p>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Availability</p>
              <span className="inline-block mt-2">
                <Badge variant={donor.is_available ? 'success' : 'secondary'}>
                  {donor.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </span>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Organs</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{donor.organ_types?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="border-red-600/50 bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-400">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>🔸 Your profile must be verified before matches can see your information</p>
            <p>🔸 Keep your contact details and availability updated</p>
            <p>🔸 You can change your availability status anytime in your profile settings</p>
            <p>🔸 Contact support if you have any questions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
