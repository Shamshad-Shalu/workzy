import { motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import SearchInput from '@/components/molecules/SearchInput';
import { type ServiceType, SERVICE_TYPE } from '@/constants';
import WorkerServiceCard from '@/features/service/components/WorkerServiceCard';
import WorkerServiceGridSkeleton from '@/features/service/components/WorkerServiceCardSkeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';

import { useWorkerServices } from '../hooks/useWorkerServices';

export default function WorkerServicesPage() {
  const { workerId = '' } = useParams<{ workerId: string }>();
  const navigate = useNavigate();

  const { updateParams, search, type } = useUrlFilterParams<{
    type: ServiceType | 'all';
  }>([{ key: 'type', defaultValue: 'all' }]);

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWorkerServices(workerId, { search, type });

  const hasActiveFilters = !!search || type !== 'all';
  const services = data?.pages.flatMap(p => p.services) ?? [];
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const handleSearchChange = useCallback(
    (v: string) => updateParams({ search: v }),
    [updateParams]
  );

  const clearFilters = () => updateParams({ search: '', type: 'all' });

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <SearchInput
            placeholder="Search services…"
            value={search}
            onChange={handleSearchChange}
            className="pl-9 pr-9"
          />
        </div>

        <Select
          value={type}
          onChange={v => updateParams({ type: v })}
          leftIcon={<Filter />}
          disabled={!!error}
          options={[
            { label: 'All types', value: 'all' },
            ...Object.values(SERVICE_TYPE).map(v => ({ label: v, value: v })),
          ]}
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {error ? (
        <ErrorState onRetry={refetch} description={error.message} />
      ) : isLoading ? (
        <WorkerServiceGridSkeleton count={6} />
      ) : services.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No matches' : 'No services found'}
          description={
            hasActiveFilters
              ? 'Try adjusting your filters.'
              : `This worker hasn't added any services yet`
          }
          action={
            hasActiveFilters ? (
              <Button variant="red" size="sm" onClick={clearFilters} className="mt-4">
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {services.map(service => (
              <motion.div
                key={service.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <WorkerServiceCard
                  service={service}
                  onBookService={() => navigate(`/services/${service.categoryId}`)}
                />
              </motion.div>
            ))}
          </motion.div>
          <div ref={sentinelRef} className="h-4" />
          {isFetchingNextPage && <WorkerServiceGridSkeleton count={3} />}
        </>
      )}
    </div>
  );
}
