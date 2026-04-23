import { motion } from 'framer-motion';

import { Skeleton } from '@/components/ui/skeleton';

export function ReviewCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-24 w-32 rounded-lg" />
        <Skeleton className="h-24 w-32 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-24 rounded-full" />
    </motion.div>
  );
}

export function ReviewSummarySkeleton() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border bg-card p-6"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2 sm:min-w-[140px]">
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map(s => (
              <Skeleton key={s} className="h-4 w-full rounded-full" />
            ))}
          </div>
        </div>
      </motion.div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[140px]" />
      </div>
    </div>
  );
}

export function WorkerReviewsPageSkeleton() {
  return (
    <div className="space-y-6">
      <ReviewSummarySkeleton />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[140px]" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <ReviewCardSkeleton />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
