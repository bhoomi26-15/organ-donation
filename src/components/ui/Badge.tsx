import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-800 text-slate-200 border border-slate-700',
    success: 'bg-green-900/30 text-green-200 border border-green-700/50',
    warning: 'bg-yellow-900/30 text-yellow-200 border border-yellow-700/50',
    danger: 'bg-red-900/30 text-red-200 border border-red-700/50',
    info: 'bg-blue-900/30 text-blue-200 border border-blue-700/50',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-slate-900",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
