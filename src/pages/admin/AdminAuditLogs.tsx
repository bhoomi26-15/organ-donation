import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { format } from 'date-fns';

export function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (data) setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-slate-500">Immutable record of system activities and critical actions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="py-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-hidden">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Timestamp</TableHead>
                     <TableHead>Actor Role</TableHead>
                     <TableHead>Action Type</TableHead>
                     <TableHead>Target Entity</TableHead>
                     <TableHead>Description</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {logs.map(log => (
                     <TableRow key={log.id}>
                       <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                         {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                       </TableCell>
                       <TableCell><Badge className="capitalize text-xs">{log.actor_role}</Badge></TableCell>
                       <TableCell className="font-mono text-xs text-primary-600">{log.action_type}</TableCell>
                       <TableCell className="text-xs text-slate-500">{log.target_table}: {log.target_id?.slice(0,8)}...</TableCell>
                       <TableCell className="text-sm max-w-xs truncate" title={log.description}>{log.description}</TableCell>
                     </TableRow>
                   ))}
                   {logs.length === 0 && (
                     <TableRow>
                       <TableCell colSpan={5} className="text-center py-8 text-slate-500">No logs generated yet.</TableCell>
                     </TableRow>
                   )}
                 </TableBody>
               </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
