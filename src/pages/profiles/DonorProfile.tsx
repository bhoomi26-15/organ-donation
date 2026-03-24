import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function DonorProfile() {
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
    emergency_contact: '',
    is_available: true,
  });

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase.from('donors').select('*').eq('user_id', user.id).single();
      if (data) {
        setFormData({
          id: data.id,
          phone: data.phone || '',
          city: data.city || '',
          state: data.state || '',
          address: data.address || '',
          emergency_contact: data.emergency_contact || '',
          is_available: data.is_available,
        });
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const { error } = await supabase.from('donors')
      .update({
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        emergency_contact: formData.emergency_contact,
        is_available: formData.is_available,
      })
      .eq('id', formData.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profile updated successfully.');
    }
    setSaving(false);
  };

  if (loading) return <DashboardLayout><div className="p-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
        <p className="text-slate-500">Update your contact and availability details.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
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
            <Input label="Emergency Contact" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} required />
            
            <label className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 mt-4 cursor-pointer">
              <input 
                type="checkbox" 
                name="is_available" 
                checked={formData.is_available} 
                onChange={handleChange}
                className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500" 
              />
              <div>
                <p className="font-medium text-slate-900">I am currently available for donation mapping</p>
                <p className="text-sm text-slate-500">Uncheck this if you are temporarily unavailable.</p>
              </div>
            </label>

            <div className="pt-4">
              <Button type="submit" isLoading={saving}>Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
