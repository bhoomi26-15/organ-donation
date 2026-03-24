import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { auditLog } from '../../services/auditService';

export function HospitalDonors() {
  const { user } = useAuth();
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hospitalId, setHospitalId] = useState('');

  const fetchDonors = async (hId: string) => {
    const { data } = await supabase.from('donors').select('*').eq('hospital_id', hId).order('created_at', { ascending: false });
    if (data) setDonors(data);
    setLoading(false);
  };

  useEffect(() => {
    async function init() {
      if (!user) return;
      const { data } = await supabase.from('hospitals').select('id').eq('user_id', user.id).single();
      if (data) {
        setHospitalId(data.id);
        await fetchDonors(data.id);
      }
    }
    init();
  }, [user]);

  const handleUpdateStatus = async (donorId: string, newStatus: string) => {
    try {
      await supabase.from('donors')
        .update({ 
          donor_status: newStatus,
          hospital_verification_status: newStatus === 'verified' ? 'verified' : 'pending'
        })
        .eq('id', donorId);
        
      await auditLog(user!.id, 'hospital', 'DONOR_VERIFICATION', donorId, 'donors', `Status updated to ${newStatus}`);
      await fetchDonors(hospitalId);
    } catch (e: any) {
      alert("Error updating status: " + e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Linked Donors</h1>
        <p className="text-slate-500">Review and verify donors assigned to your hospital.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donor Roster</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="py-8 text-center">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Blood</TableHead>
                  <TableHead>Organs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map(donor => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-medium">{donor.full_name}</TableCell>
                    <TableCell><Badge variant="danger">{donor.blood_group}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {donor.organ_types.map((o: string) => (
                           <span key={o} className="text-xs bg-slate-100 px-2 py-1 rounded">{o}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                       <Badge variant={donor.donor_status === 'verified' ? 'success' : donor.donor_status === 'rejected' ? 'danger' : 'warning'}>
                         {donor.donor_status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       {donor.donor_status !== 'verified' && (
                         <Button size="sm" onClick={() => handleUpdateStatus(donor.id, 'verified')} className="mr-2">Verify</Button>
                       )}
                       {donor.donor_status !== 'rejected' && (
                         <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(donor.id, 'rejected')}>Reject</Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))}
                {donors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">No linked donors found.</TableCell>
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
