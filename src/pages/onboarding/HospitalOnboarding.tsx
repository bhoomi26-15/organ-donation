import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { auditLog } from '../../services/auditService';
import { uploadFile } from '../../services/storageService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { UploadCloud } from 'lucide-react';

export function HospitalOnboarding() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    hospital_name: profile?.full_name || '',
    hospital_email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    license_number: '',
    authorized_person_name: '',
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!file) {
      setError('Please upload a verification document (license or registration).');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Create Hospital Record (without document URL first to get ID)
      const { data: hospitalData, error: hospitalError } = await supabase.from('hospitals').insert({
        id: user.id, // Using the same ID as profile for 1:1 relation simplicity, or let DB auto-generate
        user_id: user.id,
        hospital_name: formData.hospital_name,
        hospital_email: formData.hospital_email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        license_number: formData.license_number,
        authorized_person_name: formData.authorized_person_name,
        hospital_status: 'pending',
      }).select().single();

      if (hospitalError) throw hospitalError;

      // 2. Upload Document
      const fileRecord = await uploadFile(file, 'documents', user.id, 'hospitals', hospitalData.id);

      // 3. Update Hospital with verified document URL
      await supabase.from('hospitals')
        .update({ verification_document_url: fileRecord.file_url })
        .eq('id', hospitalData.id);

      // 4. Update Profile
      const { error: profileError } = await supabase.from('profiles').update({
        full_name: formData.hospital_name,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        profile_completed: true,
      }).eq('id', user.id);

      if (profileError) throw profileError;

      auditLog(user.id, 'hospital', 'PROFILE_CREATED', hospitalData.id, 'hospitals', 'Hospital registered and pending verification');

      await refreshProfile();
      navigate('/hospital/dashboard');
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
            <CardTitle className="text-2xl">Hospital / Clinic Registration</CardTitle>
            <CardDescription>Register your medical facility to manage donors and transplants.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-6">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Hospital/Clinic Name" name="hospital_name" value={formData.hospital_name} onChange={handleChange} required />
                <Input label="Official Email" type="email" name="hospital_email" value={formData.hospital_email} onChange={handleChange} required />
                <Input label="Business Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                <Input label="Authorized Person Name" name="authorized_person_name" value={formData.authorized_person_name} onChange={handleChange} required />
                <Input label="Medical License Number" name="license_number" value={formData.license_number} onChange={handleChange} required />
                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
              </div>
              
              <Input label="Full Address" name="address" value={formData.address} onChange={handleChange} required />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Verification Document (PDF, Image)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" required />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">Please provide a copy of your official operating license.</p>
                    {file && <p className="text-sm font-medium text-primary-600 mt-2">{file.name}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" type="submit" isLoading={loading}>Submit Registration (Pending Verification)</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
