import { motion } from 'framer-motion';

import { Skeleton } from '@/components/ui/skeleton';

export function AdminReviewCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card p-5 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 border-b border-border/50 pb-4">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex gap-2 items-start sm:justify-end">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-24 w-32 rounded-lg" />
        <Skeleton className="h-24 w-32 rounded-lg" />
      </div>
      <div className="flex items-center justify-between border-t border-border/50 pt-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </motion.div>
  );
}
