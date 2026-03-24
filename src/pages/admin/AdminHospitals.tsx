import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { auditLog } from '../../services/auditService';
import { Eye } from 'lucide-react';

export function AdminHospitals() {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    const { data } = await supabase.from('hospitals').select('*').order('created_at', { ascending: false });
    if (data) setHospitals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleUpdateStatus = async (hospitalId: string, newStatus: string) => {
    try {
      await supabase.from('hospitals').update({ hospital_status: newStatus }).eq('id', hospitalId);
      await auditLog(user!.id, 'admin', 'HOSPITAL_VERIFICATION', hospitalId, 'hospitals', `Hospital marked as ${newStatus}`);
      fetchHospitals();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Hospital Verification</h1>
        <p className="text-slate-500">Review and verify medical facilities.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="py-8 text-center">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital Name</TableHead>
                  <TableHead>License No.</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Auth Person</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitals.map(h => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">{h.hospital_name}</TableCell>
                    <TableCell>{h.license_number}</TableCell>
                    <TableCell>{h.city}, {h.state}</TableCell>
                    <TableCell>{h.authorized_person_name}</TableCell>
                    <TableCell>
                       <Badge variant={h.hospital_status === 'verified' ? 'success' : h.hospital_status === 'rejected' ? 'danger' : 'warning'} className="capitalize">
                         {h.hospital_status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                       {h.verification_document_url && (
                         <a href={h.verification_document_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-100 text-slate-600 hover:text-primary-600 rounded-md transition-colors" title="View Document">
                           <Eye className="w-4 h-4" />
                         </a>
                       )}
                       {h.hospital_status !== 'verified' && (
                         <Button size="sm" onClick={() => handleUpdateStatus(h.id, 'verified')}>Approve</Button>
                       )}
                       {h.hospital_status !== 'rejected' && (
                         <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(h.id, 'rejected')}>Reject</Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))}
                {hospitals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">No hospitals registered yet.</TableCell>
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
