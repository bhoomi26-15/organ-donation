import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Activity, Search, AlertTriangle, FileText } from 'lucide-react';

export function RecipientDashboard() {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState<any>(null);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [matchesCount, setMatchesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      const { data: recData } = await supabase.from('recipients').select('*').eq('user_id', user.id).single();
      
      if (recData) {
        setRecipient(recData);
        
        const { data: reqData } = await supabase
          .from('requests')
          .select('*')
          .eq('recipient_id', recData.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (reqData) {
          setActiveRequest(reqData);
          
          const { count } = await supabase
            .from('matches')
            .select('*', { count: 'exact', head: true })
            .eq('request_id', reqData.id);
            
          setMatchesCount(count || 0);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  if (loading) return <DashboardLayout><div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Patient Dashboard</h1>
        <p className="text-slate-500">Track your organ requests and matches.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center">
             <div className="bg-primary-50 p-3 rounded-full mr-4 text-primary-600 border border-primary-100">
               <Activity className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm font-medium text-slate-500">Current Status</p>
               <h3 className="text-xl font-bold capitalize mt-1">{recipient?.status || 'No Profile'}</h3>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center">
             <div className="bg-rose-50 p-3 rounded-full mr-4 text-rose-600 border border-rose-100">
               <AlertTriangle className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm font-medium text-slate-500">Active Request</p>
               <h3 className="text-xl font-bold mt-1">
                 {activeRequest ? activeRequest.required_organ : 'None'}
               </h3>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
             <div className="bg-green-50 p-3 rounded-full mr-4 text-green-600 border border-green-100">
               <Search className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm font-medium text-slate-500">Potential Matches</p>
               <h3 className="text-xl font-bold mt-1">{matchesCount}</h3>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {activeRequest ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Organ Required:</span>
                  <span className="font-bold text-slate-900">{activeRequest.required_organ}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Blood Compatibility:</span>
                  <Badge variant="danger">{activeRequest.blood_group}</Badge>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Urgency Level:</span>
                  <Badge variant={activeRequest.urgency_level === 'critical' ? 'danger' : 'warning'} className="capitalize">
                    {activeRequest.urgency_level}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Request Status:</span>
                  <Badge variant={activeRequest.status === 'approved' ? 'success' : 'default'} className="capitalize">
                    {activeRequest.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-slate-500">You don't have any active requests.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-slate-200 ml-3 space-y-6">
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary-100 rounded-full -left-3 ring-4 ring-white">
                  1
                </span>
                <h3 className="font-medium leading-tight pt-1">Profile Creation</h3>
                <p className="text-sm text-slate-500">Completed basic onboarding.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white ${activeRequest ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                  2
                </span>
                <h3 className="font-medium leading-tight pt-1">Medical Review</h3>
                <p className="text-sm text-slate-500">{activeRequest?.status === 'approved' ? 'Your request is clinically approved.' : 'Awaiting hospital clinical review.'}</p>
              </li>
              <li className="mb-2 ml-6">
                <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white ${matchesCount > 0 ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                  3
                </span>
                <h3 className="font-medium leading-tight pt-1">Matching Algorithm</h3>
                <p className="text-sm text-slate-500">{matchesCount > 0 ? `Found ${matchesCount} potential donor matches.` : 'System is continuously scanning for donors.'}</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-slate-100 rounded-full -left-3 ring-4 ring-white text-slate-500">
                  4
                </span>
                <h3 className="font-medium leading-tight pt-1">Transplant Confirmation</h3>
                <p className="text-sm text-slate-500">Awaiting hospital finalization of a match.</p>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
