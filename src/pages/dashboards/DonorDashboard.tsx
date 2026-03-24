import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Heart, Activity, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Database } from '../../types/database.types';

type DonorRow = Database['public']['Tables']['donors']['Row'];

export function DonorDashboard() {
  const { user } = useAuth();
  const [donorData, setDonorData] = useState<DonorRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        setDonorData(data);
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!donorData) return <DashboardLayout><div>Error loading donor data</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {donorData.full_name}</h1>
        <p className="text-slate-500">Manage your donation profile and status.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-primary-50 p-3 rounded-full mr-4 text-primary-600">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Account Status</p>
              <div className="mt-1 flex items-center">
                <span className="text-xl font-bold capitalize mr-2">{donorData.donor_status}</span>
                {donorData.donor_status === 'verified' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {donorData.donor_status === 'pending_verification' && <Clock className="h-4 w-4 text-yellow-500" />}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4 text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Availability</p>
              <div className="mt-1 flex items-center">
                <span className={`text-xl font-bold ${donorData.is_available ? 'text-green-600' : 'text-slate-600'}`}>
                  {donorData.is_available ? 'Available' : 'Unavailable'}
                </span>
                <span className="ml-2 relative flex h-3 w-3">
                  {donorData.is_available && (
                     <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                     </>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-purple-50 p-3 rounded-full mr-4 text-purple-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Hospital Verification</p>
              <div className="mt-1 flex items-center">
                <span className="text-lg font-bold capitalize">{donorData.hospital_verification_status || 'Unlinked'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registered Organs for Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {donorData.organ_types?.map(organ => (
                <Badge key={organ} variant="info" className="text-sm px-3 py-1">
                  {organ}
                </Badge>
              ))}
            </div>
            {donorData.organ_types?.length === 0 && (
              <p className="text-slate-500">No organs selected yet.</p>
            )}
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Blood Group</h4>
              <Badge variant="danger" className="text-base font-bold">{donorData.blood_group}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Progress</CardTitle>
            <CardDescription>Steps needed before your organs can be matched</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900">Profile Created</p>
                  <p className="text-xs text-slate-500">Your basic information has been saved securely.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  {donorData.hospital_id ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-yellow-500" />}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900">Hospital Linkage</p>
                  <p className="text-xs text-slate-500">
                    {donorData.hospital_id ? 'You are successfully linked to a verified hospital.' : 'Awaiting hospital selection or assignment.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  {donorData.donor_status === 'verified' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-slate-300" />}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900">Medical Verification</p>
                  <p className="text-xs text-slate-500">
                    {donorData.donor_status === 'verified' ? 'A doctor has verified your medical records.' : 'Hospital needs to verify your medical status.'}
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
