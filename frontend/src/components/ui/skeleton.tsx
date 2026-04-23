import { cn } from '@/lib/utils';

import type React from 'react';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('relative overflow-hidden bg-muted rounded-md', className)}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
    </div>
  );
}

export { Skeleton };
