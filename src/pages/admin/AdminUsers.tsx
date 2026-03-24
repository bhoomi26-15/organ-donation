import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { auditLog } from '../../services/auditService';
import { format } from 'date-fns';

export function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAccountStatus = async (targetUserId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await supabase.from('profiles').update({ account_status: newStatus }).eq('id', targetUserId);
      await auditLog(user!.id, 'admin', 'ACCOUNT_STATUS_CHANGE', targetUserId, 'profiles', `Status changed to ${newStatus}`);
      fetchUsers();
      alert(`User account ${newStatus}.`);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500">View and manage all profiles across the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="py-8 text-center">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name || 'N/A'}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Badge className="capitalize">{u.role || 'pending'}</Badge></TableCell>
                    <TableCell className="text-slate-500 text-sm">{u.created_at ? format(new Date(u.created_at), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={u.account_status === 'active' || !u.account_status ? 'success' : 'danger'} className="capitalize">
                        {u.account_status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button 
                         size="sm" 
                         variant={u.account_status === 'suspended' ? 'outline' : 'danger'} 
                         onClick={() => toggleAccountStatus(u.id, u.account_status || 'active')}
                         disabled={u.role === 'admin'}
                       >
                         {u.account_status === 'suspended' ? 'Activate' : 'Suspend'}
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
