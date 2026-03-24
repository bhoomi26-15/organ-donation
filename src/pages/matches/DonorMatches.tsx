import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { format } from 'date-fns';

export function DonorMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      if (!user) return;
      
      // Get donor ID first
      const { data: donor } = await supabase.from('donors').select('id, donor_status, is_available').eq('user_id', user.id).single();
      
      if (donor) {
        // Fetch matches where donor_id is this donor
        const { data, error } = await supabase
          .from('matches')
          .select(`
            *,
            requests ( required_organ, urgency_level ),
            recipients:recipient_id ( city, state )
          `)
          .eq('donor_id', donor.id)
          .order('match_score', { ascending: false });
          
        if (!error && data) {
          setMatches(data);
        }
      }
      setLoading(false);
    }
    fetchMatches();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Match Proposals</h1>
        <p className="text-slate-500">Potential recipients mapped for your organ donations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Matches</CardTitle>
          <CardDescription>These matches have been proposed by the system based on compatibility.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
               <p className="text-slate-500">No matches found at the moment.</p>
               <p className="text-sm mt-1 text-slate-400">Matches typically appear once your profile is Hospital Verified.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organ</TableHead>
                  <TableHead>Match Score</TableHead>
                  <TableHead>Location Compatibility</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Proposed On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell className="font-medium">{match.requests?.required_organ}</TableCell>
                    <TableCell>
                      <Badge variant="success">{match.match_score} pts</Badge>
                    </TableCell>
                    <TableCell>
                      {match.city_match ? 'Same City' : (match.state_match ? 'Same State' : 'Different Region')}
                    </TableCell>
                    <TableCell>
                       <Badge variant={
                         match.requests?.urgency_level === 'critical' ? 'danger' :
                         match.requests?.urgency_level === 'high' ? 'warning' : 'info'
                       } className="capitalize">{match.requests?.urgency_level}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={match.status === 'confirmed' ? 'success' : 'default'} className="capitalize">
                        {match.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(match.created_at), 'MMM dd, yyyy')}
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
