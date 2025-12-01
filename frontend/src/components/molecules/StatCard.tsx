// src/components/molecules/StatCard.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // optional helper to join classes

type Tone = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'muted' | 'dark';
type Size = 'sm' | 'md' | 'lg';

export interface StatCardProps {
  icon?: React.ReactNode;
  value: React.ReactNode;
  label?: React.ReactNode;

  // high-level visual API
  variant?: 'card' | 'soft' | 'outline' | 'ghost'; // card = default boxed card
  tone?: Tone; // semantic tone for color accents
  size?: Size;

  // behavior
  onClick?: () => void;
  className?: string;

  // optional explicit overrides (rarely used)
  customBg?: string; // CSS color value eg 'linear-gradient(...)' or 'var(--color-card)'
  customText?: string; // CSS color value
  customBorder?: string; // CSS color value
  iconColor?: string; // CSS color value
  noShadow?: boolean;
}

const sizeMap: Record<Size, string> = {
  sm: 'p-3 text-sm',
  md: 'p-5 text-base',
  lg: 'p-7 text-lg',
};

/**
 * Uses CSS variables from your theme:
 * --color-card, --color-card-foreground, --color-border
 * and sidebar tokens if needed.
 */
export default function StatCard({
  icon,
  value,
  label,
  variant = 'card',
  tone = 'default',
  size = 'md',
  onClick,
  className,
  customBg,
  customText,
  customBorder,
  iconColor,
  noShadow = false,
}: StatCardProps) {
  const toneMap: Record<Tone, { accentBg: string; accentText: string }> = {
    default: {
      accentBg: 'var(--color-muted, #f3f4f6)',
      accentText: 'var(--color-muted-foreground, #6b7280)',
    },
    info: {
      accentBg: 'var(--color-chart-2, #e6f0ff)',
      accentText: 'var(--color-primary, #1f6feb)',
    },
    success: {
      accentBg: 'var(--color-chart-4, #ecfdf5)',
      accentText: 'var(--color-chart-4, #10b981)',
    },
    warning: {
      accentBg: 'var(--color-chart-4, #fffbeb)',
      accentText: 'var(--color-chart-4, #d97706)',
    },
    danger: {
      accentBg: 'var(--color-destructive, #fef2f2)',
      accentText: 'var(--color-destructive, #dc2626)',
    },
    muted: {
      accentBg: 'var(--color-muted, #f5f5f5)',
      accentText: 'var(--color-muted-foreground, #6b7280)',
    },
    dark: {
      accentBg: 'var(--color-sidebar, #111827)',
      accentText: 'var(--color-sidebar-foreground, #fff)',
    },
  };

  const toneStyle = toneMap[tone] ?? toneMap.default;

  // base styles use theme tokens
  const baseBg = customBg ?? 'var(--color-card, white)';
  const baseText = customText ?? 'var(--color-card-foreground, #111827)';
  const baseBorder = customBorder ?? 'var(--color-border, rgba(0,0,0,0.08))';

  // variant specific classes (we keep them minimal so theme CSS wins)
  const variantClasses =
    variant === 'soft'
      ? 'bg-[color:var(--color-accent)/0.08] border-transparent'
      : variant === 'outline'
        ? 'bg-transparent'
        : variant === 'ghost'
          ? 'bg-transparent border-transparent'
          : ''; // card falls back to base token

  const containerStyle: React.CSSProperties = {
    background: variant === 'card' ? baseBg : undefined,
    color: baseText,
    borderColor: variant === 'card' || variant === 'outline' ? baseBorder : undefined,
  };

  const iconWrapperStyle: React.CSSProperties = {
    background: iconColor ? undefined : toneStyle.accentBg,
    color: iconColor ?? toneStyle.accentText,
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex flex-col gap-2 rounded-2xl',
        sizeMap[size],
        !noShadow && 'shadow-sm',
        'border',
        variantClasses,
        className
      )}
      style={containerStyle}
    >
      {icon && (
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={iconWrapperStyle as React.CSSProperties}
        >
          {icon}
        </div>
      )}

      <div style={{ color: baseText }} className="font-bold text-2xl leading-tight">
        {value}
      </div>

      {label && (
        <div className="text-sm" style={{ color: 'var(--color-muted-foreground, #6b7280)' }}>
          {label}
        </div>
      )}
    </div>
  );
}
