import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { auditLog } from '../../services/auditService';
import { findDonorsForRequest, createMatchProposal } from '../../services/matchService';

export function HospitalRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hospitalId, setHospitalId] = useState('');

  const fetchRequests = async (hId: string) => {
    const { data } = await supabase
      .from('requests')
      .select('*, recipients(full_name)')
      .eq('hospital_id', hId)
      .order('created_at', { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    async function init() {
      if (!user) return;
      const { data } = await supabase.from('hospitals').select('id').eq('user_id', user.id).single();
      if (data) {
        setHospitalId(data.id);
        await fetchRequests(data.id);
      }
    }
    init();
  }, [user]);

  const handleUpdateStatus = async (reqId: string, newStatus: string) => {
    try {
      await supabase.from('requests')
        .update({ 
          status: newStatus,
          approved_by: user!.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', reqId);
        
      await auditLog(user!.id, 'hospital', 'REQUEST_APPROVAL', reqId, 'requests', `Request marked as ${newStatus}`);
      
      // If approved, trigger the match proposal process
      if (newStatus === 'approved') {
        const matches = await findDonorsForRequest(reqId);
        // Create proposals for top 3 matches
        for (const match of matches.slice(0, 3)) {
          await createMatchProposal(match);
        }
        alert(`Request approved. System found ${matches.length} potential matches and proposed the top ${Math.min(3, matches.length)} matches automatically.`);
      }

      await fetchRequests(hospitalId);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Patient Requests</h1>
        <p className="text-slate-500">Review organ requests and trigger matches.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="py-8 text-center">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Organ</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.recipients?.full_name}</TableCell>
                    <TableCell>{req.required_organ}</TableCell>
                    <TableCell><Badge variant="danger">{req.blood_group}</Badge></TableCell>
                    <TableCell>
                       <Badge variant={req.urgency_level === 'critical' ? 'danger' : 'warning'} className="capitalize">{req.urgency_level}</Badge>
                    </TableCell>
                    <TableCell>
                       <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'default'} className="capitalize">
                         {req.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       {req.status === 'pending' && (
                         <>
                           <Button size="sm" onClick={() => handleUpdateStatus(req.id, 'approved')} className="mr-2">Approve & Match</Button>
                           <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(req.id, 'rejected')}>Reject</Button>
                         </>
                       )}
                    </TableCell>
                  </TableRow>
                ))}
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">No requests found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
