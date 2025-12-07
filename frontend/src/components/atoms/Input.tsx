import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({ error, leftIcon, rightIcon, className, ...props }: InputProps) {
  return (
    <div>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </span>
        )}
        <input
          {...props}
          className={cn(
            'w-full py-3 px-3 rounded-lg bg-background border border-input text-foreground',
            'pl-10 transition-all outline-none focus:ring-2 focus:ring-ring',
            rightIcon && 'pr-12',
            error && 'border-destructive bg-destructive/10',
            className
          )}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </span>
        )}
      </div>
      <div className="min-h-[1.2rem] mt-1 flex items-center">
        {error ? (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        ) : (
          <span className="text-sm invisible">placeholder</span>
        )}
      </div>
    </div>
  );
}
