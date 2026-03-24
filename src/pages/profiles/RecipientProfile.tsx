import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function RecipientProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    id: '',
    phone: '',
    city: '',
    state: '',
    address: '',
    doctor_name: '',
    medical_condition: '',
  });

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase.from('recipients').select('*').eq('user_id', user.id).single();
      if (data) {
        setFormData({
          id: data.id,
          phone: data.phone || '',
          city: data.city || '',
          state: data.state || '',
          address: data.address || '',
          doctor_name: data.doctor_name || '',
          medical_condition: data.medical_condition || '',
        });
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const { error: profileError } = await supabase.from('recipients')
      .update({
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        doctor_name: formData.doctor_name,
        medical_condition: formData.medical_condition,
      })
      .eq('id', formData.id);

    if (profileError) {
      setError(profileError.message);
    } else {
      setSuccess('Profile updated successfully.');
    }
    setSaving(false);
  };

  if (loading) return <DashboardLayout><div className="p-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Patient Profile</h1>
        <p className="text-slate-500">Update your contact details and medical notes.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-4">{error}</div>}
          {success && <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md mb-4">{success}</div>}
          
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
              <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
            </div>
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
            <Input label="Attending Doctor" name="doctor_name" value={formData.doctor_name} onChange={handleChange} required />
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Medical Condition / Notes</label>
              <textarea 
                name="medical_condition"
                value={formData.medical_condition}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                rows={4}
              ></textarea>
            </div>

            <div className="pt-4">
              <Button type="submit" isLoading={saving}>Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
