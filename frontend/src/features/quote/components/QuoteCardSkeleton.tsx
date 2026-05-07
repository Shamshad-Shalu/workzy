import { motion } from 'framer-motion';

import { Skeleton } from '@/components/ui/skeleton';

export default function QuoteCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25, ease: 'easeOut' }}
      className="relative rounded-2xl border border-border bg-card overflow-hidden"
    >
      <Skeleton className="absolute left-0 inset-y-0 w-[3px] rounded-l-2xl" />

      <div className="pl-5 pr-4 py-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-2.5 w-12 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-5 w-16 rounded-full" />
            <div className="flex flex-col items-end gap-1.5">
              <Skeleton className="h-2.5 w-10 rounded" />
              <Skeleton className="h-6 w-20 rounded" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-3.5 w-28 rounded" />
        </div>

        <div className="rounded-lg bg-muted/50 border border-border/60 px-3 py-2 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-3/4 rounded" />
        </div>
      </div>
    </motion.div>
  );
}
