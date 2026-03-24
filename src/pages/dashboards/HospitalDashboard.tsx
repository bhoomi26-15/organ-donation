import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

export function HospitalDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonors: 0,
    verifiedDonors: 0,
    totalRecipients: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      const { data: hospital } = await supabase.from('hospitals').select('id, hospital_status').eq('user_id', user.id).single();
      
      if (hospital) {
        // Run aggregation queries in parallel
        const [
          { count: totalDonors }, 
          { count: verifiedDonors }, 
          { count: pendingRequests },
          { count: totalRecipients }
        ] = await Promise.all([
          supabase.from('donors').select('*', { count: 'exact', head: true }).eq('hospital_id', hospital.id),
          supabase.from('donors').select('*', { count: 'exact', head: true }).eq('hospital_id', hospital.id).eq('donor_status', 'verified'),
          supabase.from('requests').select('*', { count: 'exact', head: true }).eq('hospital_id', hospital.id).eq('status', 'pending'),
          supabase.from('recipients').select('*', { count: 'exact', head: true }).eq('hospital_id', hospital.id),
        ]);

        setStats({
          totalDonors: totalDonors || 0,
          verifiedDonors: verifiedDonors || 0,
          pendingRequests: pendingRequests || 0,
          totalRecipients: totalRecipients || 0,
        });
      }
      setLoading(false);
    }
    loadStats();
  }, [user]);

  if (loading) return <DashboardLayout><div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary-600"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Hospital Control Center</h1>
        <p className="text-slate-500">Overview of linked donors, recipients, and pending actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Donors</p>
              <h3 className="text-2xl font-bold">{stats.totalDonors}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-green-50 p-3 rounded-full mr-4 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Verified Donors</p>
              <h3 className="text-2xl font-bold">{stats.verifiedDonors}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-purple-50 p-3 rounded-full mr-4 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Recipients</p>
              <h3 className="text-2xl font-bold">{stats.totalRecipients}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-yellow-50 p-3 rounded-full mr-4 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Requests</p>
              <h3 className="text-2xl font-bold">{stats.pendingRequests}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg text-slate-500">
               Audit logs integration goes here.<br/>
               <span className="text-sm">Activity feed for verifications and matches.</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-slate-50 hover:border-primary-300 transition-all font-medium flex items-center justify-between">
               Review Pending Donors <CheckCircle className="h-4 w-4 text-slate-400"/>
             </button>
             <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-slate-50 hover:border-primary-300 transition-all font-medium flex items-center justify-between">
               Approve Recipient Requests <FileText className="h-4 w-4 text-slate-400"/>
             </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
