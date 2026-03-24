import React from 'react';
import { cn } from './Button';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ className, size = 'md' }: LoaderProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-t-red-600 border-slate-700",
        sizes[size]
      )} />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader size="lg" />
    </div>
  );
}
