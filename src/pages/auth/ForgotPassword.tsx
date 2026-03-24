import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent to your email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-white/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <CardDescription>Enter your email and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}
          {message && <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md">{message}</div>}
          
          <form onSubmit={handleReset} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button className="w-full" type="submit" isLoading={loading}>
              Send reset link
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-slate-600 p-6 pt-0">
          Remember your password? 
          <Link to="/login" className="text-primary-600 hover:text-primary-700 ml-1 font-medium hover:underline">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
