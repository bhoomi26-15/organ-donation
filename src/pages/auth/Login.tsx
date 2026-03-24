import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Heart, Mail, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const redirectBasedOnRole = (role: string | null | undefined, profileCompleted: boolean | null | undefined) => {
    if (!role) return '/role-selection';
    if (!profileCompleted) return `/onboarding/${role}`;
    if (role === 'donor') return '/donor/dashboard';
    if (role === 'recipient') return '/recipient/dashboard';
    if (role === 'hospital') return '/hospital/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Fetch profile to determine redirect
      const { data: { user } } = await supabase.auth.getUser();
      let role: string | null = null;
      let profileCompleted: boolean | null = null;

      if (user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, profile_completed')
          .eq('id', user.id)
          .single();

        if (profileData) {
          role = profileData.role;
          profileCompleted = profileData.profile_completed;
        }
      }

      const from = (location.state as any)?.from?.pathname;
      if (from && from !== '/login' && from !== '/signup') {
        navigate(from, { replace: true });
      } else {
        const target = redirectBasedOnRole(role, profileCompleted);
        navigate(target, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const redirectBase = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectBase}/role-selection`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-red-600/50">
        <CardHeader className="space-y-1 items-center pb-4 border-b border-red-600/30">
          <div className="bg-red-600/20 p-3 rounded-full mb-3">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-400">Welcome Back</CardTitle>
          <CardDescription>Sign in to LifeLink</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded-md border border-red-700/50">
              {error}
            </div>
          )}
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-sm text-red-400 hover:text-red-300 hover:underline">
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            type="button" 
            className="w-full" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-800 pt-6 text-sm text-slate-400">
          Don't have an account? 
          <Link to="/signup" className="text-red-400 hover:text-red-300 font-semibold hover:underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
