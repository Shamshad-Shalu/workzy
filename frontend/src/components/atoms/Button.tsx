import React from 'react';

import { cn } from '@/lib/utils';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blue' | 'green' | 'red' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'responsiveLg';
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}



const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      fullWidth = false,
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent',
      ghost: 'hover:bg-accent',
      blue: 'bg-blue-600 text-white hover:bg-blue-700',
      green: 'bg-green-600 text-white hover:bg-green-700',
      red: 'bg-red-600 text-white hover:bg-red-700',
      warning: 'bg-amber-400 text-white hover:bg-amber-500',
    };

    const sizes = {
      xs: 'text-xs px-2 py-1 h-7',
      sm: 'text-sm px-3 py-2 h-8',
      md: 'text-sm px-4 py-2.5 h-10',
      lg: 'text-base px-5 py-3 h-12',
      icon: 'h-9 w-9 p-0 flex items-center justify-center',
      responsiveLg: 'text-sm px-3 py-2 h-9 sm:text-base sm:px-5 sm:py-3 sm:h-12',
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          sizes[size],
          variants[variant],
          (loading || props.disabled) && 'opacity-60 cursor-not-allowed pointer-events-none',
          fullWidth && 'w-full',
          className
        )}
        type={props.type ?? 'button'}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}

        {!loading && iconLeft}

        {children}

        {!loading && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
