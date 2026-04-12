import { motion } from 'framer-motion';

import { Skeleton } from '@/components/ui/skeleton';

export function LeaveCardSkeleton() {
  return (
    <div className="flex items-center justify-between bg-card border border-border/50 rounded-xl px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-44 rounded-md" />
          <Skeleton className="h-3 w-28 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function LeaveListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
        >
          <LeaveCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function LeaveStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-muted/50 rounded-xl p-4 space-y-2">
          <Skeleton className="h-7 w-10 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );
}
