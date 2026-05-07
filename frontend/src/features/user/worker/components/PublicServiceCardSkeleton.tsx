import { motion, type Variants } from 'framer-motion';

import { Skeleton } from '@/components/ui/skeleton';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ServiceCardSkeleton() {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-border bg-card">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
          <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-4/5 rounded-md" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>

        <div className="rounded-xl border border-dashed border-border px-3 py-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div className="space-y-1">
            <Skeleton className="h-6 w-20 rounded-md" /> {/* rate */}
            <Skeleton className="h-2.5 w-12 rounded-md" /> {/* per item label */}
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EASE,
    },
  },
};

export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} variants={itemVariants}>
          <ServiceCardSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ServiceGridSkeletonAppend({ count = 3 }: { count?: number }) {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} variants={itemVariants}>
          <ServiceCardSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
}
