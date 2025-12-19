import { cn } from '@/lib/utils';
import React from 'react';

export default function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block text-sm font-medium text-foreground mb-2', className)}>
      {children}
    </label>
  );
}
