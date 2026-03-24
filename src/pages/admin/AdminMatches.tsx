import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { format } from 'date-fns';

export function AdminMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const { data } = await supabase
        .from('matches')
        .select(`
          *,
          donors ( full_name, hospital_id ),
          recipients ( full_name, hospital_id ),
          requests ( required_organ )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      if (data) setMatches(data);
      setLoading(false);
    }
    fetchMatches();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Matches Overview</h1>
        <p className="text-slate-500">Global view of all proposed and confirmed matches.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Match Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="py-8 text-center">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organ</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="font-semibold">{m.requests?.required_organ}</TableCell>
                    <TableCell>{m.donors?.full_name}</TableCell>
                    <TableCell>{m.recipients?.full_name}</TableCell>
                    <TableCell><Badge variant="info">{m.match_score} pts</Badge></TableCell>
                    <TableCell>
                       <Badge variant={m.status === 'confirmed' ? 'success' : m.status === 'rejected' ? 'danger' : 'warning'} className="capitalize">
                         {m.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{format(new Date(m.created_at), 'MMM dd, yyyy')}</TableCell>
                  </TableRow>
                ))}
                {matches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">No matches found.</TableCell>
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
