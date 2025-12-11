import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Textarea({ error, leftIcon, rightIcon, className, ...props }: TextareaProps) {
  return (
    <div>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-3 text-muted-foreground">{leftIcon}</span>
        )}

        <textarea
          {...props}
          className={cn(
            'w-full min-h-24 py-3 px-3 rounded-lg bg-background border border-input text-foreground',
            'transition-all outline-none focus:ring-2 focus:ring-ring resize-none',
            leftIcon && 'pl-10',
            rightIcon && 'pr-12',
            error && 'border-destructive bg-destructive/10',
            className
          )}
        />

        {rightIcon && (
          <span className="absolute right-3 top-3 text-muted-foreground">{rightIcon}</span>
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
