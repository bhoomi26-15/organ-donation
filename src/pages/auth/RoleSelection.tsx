import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';

export function RoleSelection() {
  const [role, setRole] = useState<'donor' | 'recipient' | 'hospital' | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role) {
      if (profile.role === 'admin') navigate('/admin/dashboard');
      else navigate(`/onboarding/${profile.role}`);
    }
  }, [profile, navigate]);

  const handleContinue = async () => {
    if (!role || !user) return;
    setLoading(true);

    try {
      // First, get google full name if not already saved
      const fullName = user.user_metadata?.full_name || '';

      const { error } = await supabase
        .from('profiles')
        .update({ role, full_name: fullName, profile_completed: false })
        .eq('id', user.id);

      if (error) throw error;

      // Update auth metadata just in case
      await supabase.auth.updateUser({
        data: { role: role }
      });

      // Insert audit log
      await supabase.from('audit_logs').insert({
        actor_uid: user.id,
        actor_role: role,
        action_type: 'ROLE_SELECTION_GOOGLE_OAUTH',
        target_id: user.id,
        target_table: 'profiles',
        description: `User selected role ${role} via Google Login`
      });

      await refreshProfile();
      navigate(`/onboarding/${role}`);
    } catch (err: any) {
      console.error('Error updating role:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900">Welcome to LifeLink</h1>
          <p className="text-slate-500 mt-2 text-lg">Please select how you would like to join the platform.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <button
            onClick={() => setRole('donor')}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              role === 'donor' 
                ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-100' 
                : 'border-slate-200 bg-white hover:border-primary-300'
            }`}
          >
            <div className={`p-3 rounded-full inline-block mb-4 ${role === 'donor' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'}`}>
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Organ Donor</h3>
            <p className="text-sm text-slate-500">I want to register as a potential organ donor to save lives.</p>
          </button>

          <button
            onClick={() => setRole('recipient')}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              role === 'recipient' 
                ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-100' 
                : 'border-slate-200 bg-white hover:border-primary-300'
            }`}
          >
            <div className={`p-3 rounded-full inline-block mb-4 ${role === 'recipient' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'}`}>
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Recipient</h3>
            <p className="text-sm text-slate-500">I or a loved one needs an organ transplant and want to submit a request.</p>
          </button>

          <button
            onClick={() => setRole('hospital')}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              role === 'hospital' 
                ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-100' 
                : 'border-slate-200 bg-white hover:border-primary-300'
            }`}
          >
            <div className={`p-3 rounded-full inline-block mb-4 ${role === 'hospital' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'}`}>
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hospital / Clinic</h3>
            <p className="text-sm text-slate-500">I represent a medical facility facilitating transplants and verifying donors.</p>
          </button>
        </div>

        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="w-full md:w-auto md:min-w-[200px]" 
            disabled={!role} 
            onClick={handleContinue}
            isLoading={loading}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
