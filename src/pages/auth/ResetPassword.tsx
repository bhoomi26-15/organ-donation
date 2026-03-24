import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-white/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}
          {success ? (
             <div className="p-4 text-center">
               <div className="text-green-600 mb-2 font-medium">Password updated successfully!</div>
               <p className="text-sm text-slate-500">Redirecting you to login...</p>
             </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button className="w-full" type="submit" isLoading={loading}>
                Update Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
