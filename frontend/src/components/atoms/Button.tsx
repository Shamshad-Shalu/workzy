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
    primary: 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-600',
    secondary: 'bg-gray-100 hover:bg-gray-200',
    outline: 'border border-gray-300 hover:bg-gray-100',
    ghost: 'hover:bg-gray-100',
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
