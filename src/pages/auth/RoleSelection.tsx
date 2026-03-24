import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { auditService } from '../../services/auditService';
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
      const fullName = user.user_metadata?.full_name || user.email || 'User';

      const { error } = await supabase
        .from('profiles')
        .upsert(
          { id: user.id, role, full_name: fullName, profile_completed: false },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) throw error;

      await supabase.auth.updateUser({
        data: { role }
      });

      await auditService.log(
        'ROLE_SELECTION',
        `User selected role: ${role}`,
        user.id,
        'profiles',
        user.id,
        role
      );

      await refreshProfile();
      navigate(`/onboarding/${role}`);
    } catch (err: any) {
      console.error('Error updating role:', err);
      alert('Failed to save role selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text mb-2">
            LifeLink Platform
          </h1>
          <p className="text-slate-400 text-lg">Choose how you'd like to participate in saving lives</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <button
            onClick={() => setRole('donor')}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              role === 'donor' 
                ? 'border-red-600 bg-red-600/10 ring-2 ring-red-600/50' 
                : 'border-slate-700 bg-slate-900/50 hover:border-red-600/50 hover:bg-slate-900'
            }`}
          >
            <div className={`p-3 rounded-full inline-block mb-4 ${role === 'donor' ? 'bg-red-600/30 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Organ Donor</h3>
            <p className="text-sm text-slate-400">Register as a potential organ donor to save lives and help those in need.</p>
          </button>

          <button
            onClick={() => setRole('recipient')}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              role === 'recipient' 
                ? 'border-red-600 bg-red-600/10 ring-2 ring-red-600/50' 
                : 'border-slate-700 bg-slate-900/50 hover:border-red-600/50 hover:bg-slate-900'
            }`}
          >
            <div className={`p-3 rounded-full inline-block mb-4 ${role === 'recipient' ? 'bg-red-600/30 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Recipient</h3>
            <p className="text-sm text-slate-400">Submit a request if you or a loved one needs an organ transplant.</p>
          </button>

          <button
            onClick={() => setRole('hospital')}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              role === 'hospital' 
                ? 'border-red-600 bg-red-600/10 ring-2 ring-red-600/50' 
                : 'border-slate-700 bg-slate-900/50 hover:border-red-600/50 hover:bg-slate-900'
            }`}
          >
            <div className={`p-3 rounded-full inline-block mb-4 ${role === 'hospital' ? 'bg-red-600/30 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Hospital / Clinic</h3>
            <p className="text-sm text-slate-400">Represent a medical facility and manage donors, recipients, and transplants.</p>
          </button>
        </div>

        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="w-full md:w-auto md:min-w-[200px]" 
            disabled={!role || loading} 
            onClick={handleContinue}
            isLoading={loading}
          >
            Continue to Setup
          </Button>
        </div>
      </div>
    </div>
  );
}
