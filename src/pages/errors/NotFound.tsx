import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
        <FileQuestion className="w-10 h-10 text-slate-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
}
