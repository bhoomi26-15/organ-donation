import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { auditLog } from '../../services/auditService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

export function DonorOnboarding() {
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
    national_id: '',
    emergency_contact: '',
    medical_history: '',
  });

  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const organsList = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea', 'Bone Marrow'];

  const handleOrganChange = (organ: string) => {
    setSelectedOrgans(prev => 
      prev.includes(organ) ? prev.filter(o => o !== organ) : [...prev, organ]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (selectedOrgans.length === 0) {
      setError('Please select at least one organ to donate.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Create Donor Record
      const { data: donorData, error: donorError } = await supabase.from('donors').insert({
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
        national_id: formData.national_id,
        emergency_contact: formData.emergency_contact,
        medical_history: formData.medical_history,
        organ_types: selectedOrgans,
        consent_accepted: true,
        donor_status: 'active',
        hospital_verification_status: 'pending',
        is_available: true,
      }).select().single();

      if (donorError) throw donorError;

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

      auditLog(user.id, 'donor', 'PROFILE_CREATED', donorData.id, 'donors', 'Donor profile created');

      await refreshProfile();
      navigate('/donor/dashboard');
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
            <CardTitle className="text-2xl">Complete Your Donor Profile</CardTitle>
            <CardDescription>We need some details to properly register you as a donor.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-6">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                <Input label="Age" type="number" name="age" value={formData.age} onChange={handleChange} required min="18" max="80" />
                <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} required options={[
                  { value: '', label: 'Select Gender' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }
                ]} />
                <Select label="Blood Group" name="blood_group" value={formData.blood_group} onChange={handleChange} required options={[
                  { value: '', label: 'Select Blood Group' },
                  { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' }, { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' }, { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }
                ]} />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                <Input label="National ID / SSN" name="national_id" value={formData.national_id} onChange={handleChange} required />
                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
              </div>
              
              <Input label="Full Address" name="address" value={formData.address} onChange={handleChange} required />
              <Input label="Emergency Contact (Name & Phone)" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} required />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Medical History</label>
                <textarea 
                  name="medical_history" value={formData.medical_history} onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  rows={3} placeholder="Please list any preexisting conditions..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Organs willing to donate</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {organsList.map(organ => (
                    <label key={organ} className="flex items-center space-x-2 p-2 border rounded hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" checked={selectedOrgans.includes(organ)} onChange={() => handleOrganChange(organ)} className="rounded text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm">{organ}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" type="submit" isLoading={loading}>Complete Registration</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
