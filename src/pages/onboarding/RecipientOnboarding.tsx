import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { auditLog } from '../../services/auditService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

export function RecipientOnboarding() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    age: '',
    gender: '',
    blood_group: '',
    phone: '',
    city: '',
    state: '',
    address: '',
    required_organ: '',
    urgency_level: '',
    doctor_name: '',
    medical_condition: '',
    required_date: '',
  });

  const organsList = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea', 'Bone Marrow'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      // Create Recipient Record
      const { data: recipientData, error: recipientError } = await supabase.from('recipients').insert({
        user_id: user.id,
        full_name: formData.full_name,
        age: parseInt(formData.age),
        gender: formData.gender,
        blood_group: formData.blood_group,
        phone: formData.phone,
        email: user.email,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        required_organ: formData.required_organ,
        urgency_level: formData.urgency_level,
        doctor_name: formData.doctor_name,
        medical_condition: formData.medical_condition,
        required_date: formData.required_date,
        status: 'pending',
      }).select().single();

      if (recipientError) throw recipientError;

      // Create Initial Request automatically
      await supabase.from('requests').insert({
        recipient_id: recipientData.id,
        required_organ: formData.required_organ,
        blood_group: formData.blood_group,
        urgency_level: formData.urgency_level,
        medical_notes: formData.medical_condition,
        status: 'pending',
      });

      // Update Profile
      const { error: profileError } = await supabase.from('profiles').update({
        full_name: formData.full_name,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        profile_completed: true,
      }).eq('id', user.id);

      if (profileError) throw profileError;

      auditLog(user.id, 'recipient', 'PROFILE_CREATED', recipientData.id, 'recipients', 'Recipient profile and request created');

      await refreshProfile();
      navigate('/recipient/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Profile & Request</CardTitle>
            <CardDescription>Submit your medical details to find a matching organ donor.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-6">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                <Input label="Age" type="number" name="age" value={formData.age} onChange={handleChange} required min="0" max="120" />
                <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} required options={[
                  { value: '', label: 'Select Gender' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }
                ]} />
                <Select label="Blood Group" name="blood_group" value={formData.blood_group} onChange={handleChange} required options={[
                  { value: '', label: 'Select Blood Group' },
                  { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' }, { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' }, { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }
                ]} />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                <Select label="Required Organ" name="required_organ" value={formData.required_organ} onChange={handleChange} required options={[
                  { value: '', label: 'Select Organ' },
                  ...organsList.map(o => ({ value: o, label: o }))
                ]} />
                <Select label="Urgency Level" name="urgency_level" value={formData.urgency_level} onChange={handleChange} required options={[
                  { value: '', label: 'Select Urgency' },
                  { value: 'low', label: 'Low - Stable condition' },
                  { value: 'medium', label: 'Medium - Needs transplant soon' },
                  { value: 'high', label: 'High - Critical condition' },
                  { value: 'critical', label: 'Critical - Life threatening' }
                ]} />
                <Input label="Attending Doctor's Name" name="doctor_name" value={formData.doctor_name} onChange={handleChange} required />
                <Input label="Target Date Needed By" type="date" name="required_date" value={formData.required_date} onChange={handleChange} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
                <Input label="Full Address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Detailed Medical Condition</label>
                <textarea 
                  name="medical_condition" value={formData.medical_condition} onChange={handleChange} required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  rows={4} placeholder="Describe the current medical condition and diagnosis..."
                ></textarea>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" type="submit" isLoading={loading}>Submit Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
