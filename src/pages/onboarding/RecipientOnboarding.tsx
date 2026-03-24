import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { recipientService } from '../../services/recipientService';
import { profileService } from '../../services/profileService';
import { auditService } from '../../services/auditService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Heart } from 'lucide-react';

export function RecipientOnboarding() {
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
    required_organ: '',
    urgency_level: 'regular',
    doctor_name: '',
    hospital_name: '',
    medical_condition: '',
    required_date: '',
    approval_documents: '',
  });

  const urgencyOptions = [
    { value: 'regular', label: 'Regular (3-6 months)' },
    { value: 'high', label: 'High (1-3 months)' },
    { value: 'critical', label: 'Critical (< 1 month)' },
  ];

  const organOptions = [
    { value: 'heart', label: 'Heart' },
    { value: 'liver', label: 'Liver' },
    { value: 'kidney', label: 'Kidney' },
    { value: 'pancreas', label: 'Pancreas' },
    { value: 'lung', label: 'Lung' },
    { value: 'cornea', label: 'Cornea' },
    { value: 'tissue', label: 'Tissue' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      // Create/update recipient record
      const existingRecipient = await recipientService.getRecipientByUserId(user.id);

      if (existingRecipient) {
        await recipientService.updateRecipient(existingRecipient.id, {
          ...formData,
          recipient_status: 'pending_approval',
        });
      } else {
        await recipientService.createRecipient({
          user_id: user.id,
          ...formData,
          recipient_status: 'pending_approval',
        });
      }

      // Update profile as completed
      await profileService.markProfileCompleted(user.id);

      await auditService.log(
        'RECIPIENT_PROFILE_COMPLETED',
        'Recipient profile submitted for approval',
        user.id,
        'recipients',
        user.id,
        'recipient'
      );

      await refreshProfile();
      navigate('/recipient/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save recipient profile');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.full_name && formData.age && formData.gender && formData.blood_group;
  const isStep2Valid = formData.phone && formData.email && formData.city && formData.state && formData.address;
  const isStep3Valid = formData.required_organ && formData.urgency_level && formData.doctor_name && formData.hospital_name && formData.medical_condition;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/20 mb-4">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-2">Recipient Registration</h1>
          <p className="text-slate-400">Complete your profile to get listed as a recipient</p>
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
                  <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required min="0" max="120" />
                  
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
                <CardContent className="space-y-4">
                  {error && <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded border border-red-700/50">{error}</div>}
                  
                  <Select
                    label="Required Organ"
                    name="required_organ"
                    value={formData.required_organ}
                    onChange={handleChange}
                    required
                    options={organOptions}
                  />

                  <Select
                    label="Urgency Level"
                    name="urgency_level"
                    value={formData.urgency_level}
                    onChange={handleChange}
                    required
                    options={urgencyOptions}
                  />

                  <Input label="Doctor Name" name="doctor_name" value={formData.doctor_name} onChange={handleChange} required />
                  <Input label="Hospital Name" name="hospital_name" value={formData.hospital_name} onChange={handleChange} required />

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Medical Condition</label>
                    <textarea
                      name="medical_condition"
                      value={formData.medical_condition}
                      onChange={handleChange}
                      placeholder="Describe your medical condition and why you need this organ"
                      className="w-full bg-slate-900 border border-slate-700 rounded text-slate-100 p-2 focus:border-red-600 outline-none"
                      rows={3}
                      required
                    />
                  </div>

                  <Input 
                    label="Required Date (Preferred transplant date)" 
                    name="required_date" 
                    type="date" 
                    value={formData.required_date} 
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Approval Documents (Notes)</label>
                    <textarea
                      name="approval_documents"
                      value={formData.approval_documents}
                      onChange={handleChange}
                      placeholder="Medical reports, approvals, or additional documents reference"
                      className="w-full bg-slate-900 border border-slate-700 rounded text-slate-100 p-2 focus:border-red-600 outline-none"
                      rows={3}
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
