import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { recipientService } from '../../services/recipientService';
import { requestService } from '../../services/requestService';
import { matchService } from '../../services/matchService';
import { notificationService } from '../../services/notificationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Heart, Stethoscope, Search, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export function RecipientDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState<any>(null);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
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

        // Load recipient profile
        const recipientData = await recipientService.getRecipientByUserId(user.id);
        if (!recipientData) {
          setError('Recipient profile not found');
          return;
        }
        setRecipient(recipientData);

        // Load active request
        const requests = await requestService.getRequestsByRecipient(recipientData.id);
        if (requests && requests.length > 0) {
          const active = requests.find((r: any) => r.status !== 'rejected') || requests[0];
          setActiveRequest(active);

          // Load matches for active request
          const matchesData = await matchService.getMatches({ request_id: active.id });
          setMatches(matchesData || []);
        }

        // Load notifications
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

  if (error || !recipient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-600/50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-300 mb-4">{error || 'Recipient profile not found'}</p>
              <Button onClick={() => navigate('/')}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-400 mb-2">Recipient Dashboard</h1>
          <p className="text-slate-400">Track your organ request and matches - {recipient.full_name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Status</p>
              <Badge 
                variant={recipient.recipient_status === 'approved' ? 'success' : recipient.recipient_status === 'pending_approval' ? 'warning' : 'secondary'}
                className="mt-2"
              >
                {recipient.recipient_status?.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Active Request</p>
              <p className="text-3xl font-bold text-red-400 mt-2">
                {activeRequest ? activeRequest.required_organ : 'None'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-600/50">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Potential Matches</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{matches.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile & Request Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400">Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Full Name</p>
                <p className="text-red-300 font-medium">{recipient.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Age / Blood Group</p>
                <p className="text-red-300 font-medium">{recipient.age} years / {recipient.blood_group}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Location</p>
                <p className="text-red-300 font-medium">{recipient.city}, {recipient.state}</p>
              </div>
              <Button 
                variant="secondary" 
                className="w-full mt-4"
                onClick={() => navigate('/recipient/profile')}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Active Request Card */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Active Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeRequest ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Organ Required:</span>
                    <span className="text-red-300 font-medium">{activeRequest.required_organ}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Urgency:</span>
                    <Badge variant={getUrgencyColor(activeRequest.urgency_level)}>
                      {activeRequest.urgency_level?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <Badge variant={activeRequest.status === 'approved' ? 'success' : 'warning'}>
                      {activeRequest.status?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="pt-3 border-t border-slate-700">
                    <p className="text-sm text-slate-300 mb-2">Medical Condition:</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{activeRequest.medical_notes}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">No active request</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Matches & Notifications */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Matches Card */}
          <Card className="border-red-600/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Potential Matches ({matches.length})
              </CardTitle>
              <CardDescription>Recipients found for your organ need</CardDescription>
            </CardHeader>
            <CardContent>
              {matches.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No matches found yet</p>
              ) : (
                <div className="space-y-2">
                  {matches.slice(0, 3).map((match: any) => (
                    <div key={match.id} className="p-3 bg-slate-900/50 rounded border border-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-red-300">Match ID: {match.id.slice(0, 8)}</p>
                          <p className="text-xs text-slate-400 mt-1">Status: {match.status}</p>
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
                      onClick={() => navigate('/recipient/matches')}
                    >
                      View All {matches.length} Matches
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
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No notifications</p>
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

        {/* Status Steps */}
        <Card className="border-red-600/50">
          <CardHeader>
            <CardTitle className="text-red-400">Your Journey</CardTitle>
            <CardDescription>Steps toward finding your donor match</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-300 font-medium">Profile Completed</p>
                  <p className="text-sm text-slate-400">Your information has been securely stored</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${recipient.recipient_status === 'approved' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                  ✓
                </div>
                <div>
                  <p className="text-red-300 font-medium">Medical Approval</p>
                  <p className="text-sm text-slate-400">
                    {recipient.recipient_status === 'approved' ? 'Your medical profile has been reviewed' : 'Awaiting hospital medical review'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${matches.length > 0 ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                  {matches.length}
                </div>
                <div>
                  <p className="text-red-300 font-medium">Matching Algorithm</p>
                  <p className="text-sm text-slate-400">
                    {matches.length > 0 ? `Found ${matches.length} potential donor matches` : 'System is scanning for compatible donors'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
