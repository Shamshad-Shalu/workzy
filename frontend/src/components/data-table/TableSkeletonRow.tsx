import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonRowProps {
  isSmallScreen: boolean;
  rowCount?: number;
}

export const DataTableSkeletonRow: React.FC<SkeletonRowProps> = ({
  isSmallScreen,
  rowCount = 5,
}) => {
  if (isSmallScreen) {
    return (
      <div className="space-y-4">
        {Array.from({ length: rowCount }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('w-full h-16 rounded-lg my-3 shadow-sm animate-skeleton-sweep')}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <tr key={i} className="border-t hover:bg-secondary/50 transition-colors">
          <td colSpan={100} className="px-6 py-6">
            <Skeleton className={cn('w-full h-8 rounded-full animate-skeleton-sweep')} />
          </td>
        </tr>
      ))}
    </>
  );
};
