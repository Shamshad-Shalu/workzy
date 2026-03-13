import { AnimatePresence, motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

import EmptyState from '@/components/molecules/EmptyState';
import Pagination from '@/components/molecules/Pagination';
import type { WorkerListingInfo } from '@/types/worker';

import { WorkerCard } from './WorkerCard';
import WorkerCardSkeleton from './WorkerCardSkeleton';

type WorkerListProps = {
  workers: WorkerListingInfo[];
  isLoading: boolean;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onBook: (worker: WorkerListingInfo) => void;
};

export interface WorkerListParams {
  page: number;
  limit: number;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availableNow?: boolean;
}

export function WorkerList({
  workers,
  isLoading,
  limit,
  onPageChange,
  page,
  total,
  onBook,
}: WorkerListProps) {
  const pageCount = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeletons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <WorkerCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : workers.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              icon={<SearchX className="w-6 h-6" />}
              title="No professionals found"
              description="Try adjusting your filters or expanding your search radius."
              className="py-12"
            />
          </motion.div>
        ) : (
          <motion.div
            key={`page-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {workers.map((worker, i) => (
              <WorkerCard key={worker.userId} worker={worker} index={i} onBook={onBook} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {pageCount > 1 && (
        <Pagination
          onPageChange={i => onPageChange(i + 1)}
          pageCount={pageCount}
          pageIndex={page - 1}
        />
      )}
    </div>
  );
}
