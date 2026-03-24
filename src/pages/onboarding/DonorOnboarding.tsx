import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { donorService } from '../../services/donorService';
import { profileService } from '../../services/profileService';
import { auditService } from '../../services/auditService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Heart } from 'lucide-react';

export function DonorOnboarding() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    age: '',
    gender: '',
    blood_group: '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    city: profile?.city || '',
    state: profile?.state || '',
    address: profile?.address || '',
    organ_types: [] as string[],
    medical_history: '',
    emergency_contact: '',
    national_id: '',
    consent_accepted: false,
  });

  const organOptions = [
    { value: 'heart', label: 'Heart' },
    { value: 'liver', label: 'Liver' },
    { value: 'kidney', label: 'Kidney' },
    { value: 'pancreas', label: 'Pancreas' },
    { value: 'lung', label: 'Lung' },
    { value: 'cornea', label: 'Cornea' },
    { value: 'tissue', label: 'Tissue' },
  ];

  const handleOrganToggle = (organ: string) => {
    setFormData(prev => ({
      ...prev,
      organ_types: prev.organ_types.includes(organ)
        ? prev.organ_types.filter(o => o !== organ)
        : [...prev.organ_types, organ]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
      // Create/update donor record
      const existingDonor = await donorService.getDonorByUserId(user.id);

      if (existingDonor) {
        await donorService.updateDonor(existingDonor.id, {
          ...formData,
          donor_status: 'pending_verification',
        });
      } else {
        await donorService.createDonor({
          user_id: user.id,
          ...formData,
          donor_status: 'pending_verification',
          is_available: true,
        });
      }

      // Update profile as completed
      await profileService.markProfileCompleted(user.id);

      await auditService.log(
        'DONOR_PROFILE_COMPLETED',
        'Donor profile submitted for verification',
        user.id,
        'donors',
        user.id,
        'donor'
      );

      await refreshProfile();
      navigate('/donor/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save donor profile');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.full_name && formData.age && formData.gender && formData.blood_group;
  const isStep2Valid = formData.phone && formData.email && formData.city && formData.state && formData.address;
  const isStep3Valid = formData.organ_types.length > 0 && formData.emergency_contact && formData.national_id && formData.consent_accepted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/20 mb-4">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-2">Donor Registration</h1>
          <p className="text-slate-400">Complete your profile to get listed as a donor</p>
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
                  <CardTitle className="text-red-400">Personal Information</CardTitle>
                  <CardDescription>Step 1 of 3</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded border border-red-700/50">{error}</div>}
                  
                  <Input label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                  <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required min="18" max="65" />
                  
                  <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />

                  <Select
                    label="Blood Group"
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    required
                    options={[
                      { value: 'O+', label: 'O+' },
                      { value: 'O-', label: 'O-' },
                      { value: 'A+', label: 'A+' },
                      { value: 'A-', label: 'A-' },
                      { value: 'B+', label: 'B+' },
                      { value: 'B-', label: 'B-' },
                      { value: 'AB+', label: 'AB+' },
                      { value: 'AB-', label: 'AB-' },
                    ]}
                  />
                </CardContent>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle className="text-red-400">Contact & Location</CardTitle>
                  <CardDescription>Step 2 of 3</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded border border-red-700/50">{error}</div>}
                  
                  <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                  <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
                  <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
                </CardContent>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle className="text-red-400">Medical Information</CardTitle>
                  <CardDescription>Step 3 of 3 - Final Step</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded border border-red-700/50">{error}</div>}
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Organs Available for Donation</label>
                    <div className="grid grid-cols-2 gap-3">
                      {organOptions.map(organ => (
                        <button
                          key={organ.value}
                          type="button"
                          onClick={() => handleOrganToggle(organ.value)}
                          className={`p-2 rounded border-2 text-sm font-medium transition ${
                            formData.organ_types.includes(organ.value)
                              ? 'border-red-600 bg-red-600/20 text-red-300'
                              : 'border-slate-700 bg-transparent text-slate-400 hover:border-red-600/50'
                          }`}
                        >
                          {organ.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Medical History</label>
                    <textarea
                      name="medical_history"
                      value={formData.medical_history}
                      onChange={handleChange}
                      placeholder="Any relevant medical conditions or treatments"
                      className="w-full bg-slate-900 border border-slate-700 rounded text-slate-100 p-2 focus:border-red-600 outline-none"
                      rows={3}
                    />
                  </div>

                  <Input label="Emergency Contact" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} required />
                  <Input label="National ID" name="national_id" value={formData.national_id} onChange={handleChange} required />

                  <label className="flex items-start cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      name="consent_accepted"
                      checked={formData.consent_accepted}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded border-slate-600 text-red-600"
                      required
                    />
                    <span className="text-sm text-slate-300">
                      I consent to donate my organs and have read and agree to the donor agreement
                    </span>
                  </label>
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
