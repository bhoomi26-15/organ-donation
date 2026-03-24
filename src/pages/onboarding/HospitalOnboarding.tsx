import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hospitalService } from '../../services/hospitalService';
import { profileService } from '../../services/profileService';
import { auditService } from '../../services/auditService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Building2 } from 'lucide-react';

export function HospitalOnboarding() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    hospital_name: profile?.hospital_name || '',
    hospital_email: profile?.email || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    state: profile?.state || '',
    address: profile?.address || '',
    license_number: '',
    authorized_person_name: '',
    authorized_person_email: '',
    authorized_person_phone: '',
    verification_document_url: '',
    departments: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError('User not found');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Create/update hospital record
      const existingHospital = await hospitalService.getHospitalByUserId(user.id);

      if (existingHospital) {
        await hospitalService.updateHospital(existingHospital.id, {
          ...formData,
          verification_status: 'pending',
        });
      } else {
        await hospitalService.createHospital({
          user_id: user.id,
          ...formData,
          verification_status: 'pending',
        });
      }

      // Update profile as completed
      await profileService.markProfileCompleted(user.id);

      await auditService.log(
        'HOSPITAL_PROFILE_COMPLETED',
        'Hospital profile submitted for verification',
        user.id,
        'hospitals',
        user.id,
        'hospital'
      );

      await refreshProfile();
      navigate('/hospital/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save hospital profile');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.hospital_name && formData.hospital_email && formData.phone;
  const isStep2Valid = formData.city && formData.state && formData.address;
  const isStep3Valid = formData.license_number && formData.authorized_person_name && formData.authorized_person_email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/20 mb-4">
            <Building2 className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-2">Hospital Registration</h1>
          <p className="text-slate-400">Complete your hospital profile for verification</p>
        </div>

        <div className="flex justify-between mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-2 rounded-full mx-1 transition-colors ${s <= step ? 'bg-red-600' : 'bg-slate-700'}`} />
          ))}
        </div>

        <Card className="border-red-600/50">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle className="text-red-400">Hospital Information</CardTitle>
                  <CardDescription>Step 1 of 3</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded border border-red-700/50">{error}</div>}
                  
                  <Input label="Hospital Name" name="hospital_name" value={formData.hospital_name} onChange={handleChange} required />
                  <Input label="Hospital Email" name="hospital_email" type="email" value={formData.hospital_email} onChange={handleChange} required />
                  <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Departments (comma-separated)</label>
                    <textarea
                      name="departments"
                      value={formData.departments}
                      onChange={handleChange}
                      placeholder="e.g., Cardiology, Transplant Surgery, Nephrology"
                      className="w-full bg-slate-900 border border-slate-700 rounded text-slate-100 p-2 focus:border-red-600 outline-none"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle className="text-red-400">Location Details</CardTitle>
                  <CardDescription>Step 2 of 3</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded border border-red-700/50">{error}</div>}
                  
                  <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                  <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
                  <Input label="Full Address" name="address" value={formData.address} onChange={handleChange} required />
                </CardContent>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle className="text-red-400">Verification Details</CardTitle>
                  <CardDescription>Step 3 of 3 - Final Step</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded border border-red-700/50">{error}</div>}
                  
                  <Input label="Hospital License Number" name="license_number" value={formData.license_number} onChange={handleChange} required />
                  
                  <Input label="Authorized Person Name" name="authorized_person_name" value={formData.authorized_person_name} onChange={handleChange} required />
                  
                  <Input label="Authorized Person Email" name="authorized_person_email" type="email" value={formData.authorized_person_email} onChange={handleChange} required />
                  
                  <Input 
                    label="Authorized Person Phone" 
                    name="authorized_person_phone" 
                    type="tel" 
                    value={formData.authorized_person_phone} 
                    onChange={handleChange} 
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Verification Document URL/Reference</label>
                    <textarea
                      name="verification_document_url"
                      value={formData.verification_document_url}
                      onChange={handleChange}
                      placeholder="URL or reference to uploaded verification documents"
                      className="w-full bg-slate-900 border border-slate-700 rounded text-slate-100 p-2 focus:border-red-600 outline-none"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </>
            )}

            <CardContent className="flex justify-between gap-4 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="secondary"
                onClick={() => step > 1 && setStep(step - 1)}
                disabled={step === 1}
              >
                Previous
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => step < 3 && setStep(step + 1)}
                  disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : false}
                >
                  Next Step
                </Button>
              ) : (
                <Button type="submit" isLoading={loading} disabled={!isStep3Valid}>
                  Complete Registration
                </Button>
              )}
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
