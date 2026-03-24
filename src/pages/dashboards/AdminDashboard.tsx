import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Users, FileText, CheckCircle, Hospital, Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    donors: 0,
    recipients: 0,
    hospitals: 0,
    requests: 0,
    matches: 0,
    verifiedDonors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [
        { count: donors }, 
        { count: recipients }, 
        { count: hospitals },
        { count: requests },
        { count: matches },
        { count: verifiedDonors }
      ] = await Promise.all([
        supabase.from('donors').select('*', { count: 'exact', head: true }),
        supabase.from('recipients').select('*', { count: 'exact', head: true }),
        supabase.from('hospitals').select('*', { count: 'exact', head: true }),
        supabase.from('requests').select('*', { count: 'exact', head: true }),
        supabase.from('matches').select('*', { count: 'exact', head: true }),
        supabase.from('donors').select('*', { count: 'exact', head: true }).eq('donor_status', 'verified'),
      ]);

      setStats({
        donors: donors || 0,
        recipients: recipients || 0,
        hospitals: hospitals || 0,
        requests: requests || 0,
        matches: matches || 0,
        verifiedDonors: verifiedDonors || 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) return <DashboardLayout><div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary-600"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
          <p className="text-slate-500">Monitor overall platform statistics and manage entities.</p>
        </div>
        <Link to="/admin/logs" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center">
          <Eye className="w-4 h-4 mr-2" /> View Audit Logs
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Donors</p>
              <h3 className="text-2xl font-bold">{stats.donors}</h3>
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
              <h3 className="text-2xl font-bold">{stats.recipients}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-indigo-50 p-3 rounded-full mr-4 text-indigo-600">
              <Hospital className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Hospitals</p>
              <h3 className="text-2xl font-bold">{stats.hospitals}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-yellow-50 p-3 rounded-full mr-4 text-yellow-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Organ Requests</p>
              <h3 className="text-2xl font-bold">{stats.requests}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-rose-50 p-3 rounded-full mr-4 text-rose-600">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Matches</p>
              <h3 className="text-2xl font-bold">{stats.matches}</h3>
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
      </div>

    </DashboardLayout>
  );
}
