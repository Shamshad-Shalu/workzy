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
  onViewProfile?: (id: string) => void;
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
  onViewProfile,
}: WorkerListProps) {
  const pageCount = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <WorkerCardSkeleton key={i} />)
      ) : workers.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            No professionals found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        workers.map(worker => (
          <WorkerCard key={worker.userId} worker={worker} onViewProfile={onViewProfile!} />
        ))
      )}

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
