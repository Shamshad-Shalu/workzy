import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blue' | 'green' | 'red';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all whitespace-nowrap';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent',
    ghost: 'hover:bg-accent',
    blue: 'bg-blue-600 text-white hover:bg-blue-700',
    green: 'bg-green-600 text-white hover:bg-green-700',
    red: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    xs: 'text-xs px-2 py-1 h-7',
    sm: 'text-sm px-3 py-2 h-8',
    md: 'text-sm px-4 py-2.5 h-10',
    lg: 'text-base px-5 py-3 h-12',
    icon: 'h-9 w-9 p-0 flex items-center justify-center',
  };

  return (
    <button
      className={cn(
        base,
        sizes[size],
        variants[variant],
        (loading || props.disabled) && 'opacity-60 cursor-not-allowed',
        fullWidth && 'w-full',
        className
      )}
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
