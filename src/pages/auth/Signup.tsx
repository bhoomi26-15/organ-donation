import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Heart } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';

export function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role.");
      return;
    }
    setLoading(true);
    setError('');

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setSuccess("Account created successfully! You can now log in.");
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/role-selection`,
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-white/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 items-center pb-4">
          <div className="bg-primary-50 p-3 rounded-full mb-3">
            <Heart className="h-6 w-6 text-primary-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>Join LifeLink to make a difference</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md border border-green-200">
              {success}
            </div>
          )}
          
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <Input
              label="Full Name / Hospital Name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Select
              label="I am joining as a..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              options={[
                { value: '', label: 'Select your role' },
                { value: 'donor', label: 'Organ Donor' },
                { value: 'recipient', label: 'Organ Recipient' },
                { value: 'hospital', label: 'Hospital/Clinic' },
              ]}
            />
            <Button className="w-full" type="submit" isLoading={loading}>
              Sign up
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            type="button" 
            className="w-full bg-white" 
            onClick={handleGoogleSignup}
            disabled={loading}
          >
             <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 pt-6 text-sm text-slate-600">
          Already have an account? 
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
