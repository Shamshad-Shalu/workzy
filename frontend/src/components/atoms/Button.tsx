import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  loading = false,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    'flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent',
    ghost: 'hover:bg-accent',
  };

  return (
    <button
      className={cn(base, variants[variant], fullWidth && 'w-full', className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}

      {!loading && iconLeft}

      {children}

      {!loading && iconRight}
    </button>
  );
}
