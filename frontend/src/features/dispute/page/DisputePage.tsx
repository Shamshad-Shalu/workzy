import { Filter, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import { DataList } from '@/components/data-table/DataList';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import { type Role } from '@/constants';
import {
  DISPUTE_STATUS_VALUES,
  DISPUTE_REASON_LABELS,
  type DisputeReason,
} from '@/constants/dispute';
import disputeColumns from '@/features/dispute/components/disputeColumns';
import DisputeModal from '@/features/dispute/components/DisputeModal';
import DisputeStatsSection from '@/features/dispute/components/DisputeStatsSection';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { cn } from '@/lib/utils';

import { useDisputes, useDisputeStats } from '../hooks/useDisputes';

export default function DisputePage({ role }: { role: Role }) {
  const [disputeBId, setDisputeBId] = useState<string | null>(null);
  const { updateParams, search, status, reason } = useUrlFilterParams<{
    reason: DisputeReason | 'all';
  }>([{ key: 'reason', defaultValue: 'all' }]);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
    refetch,
  } = useDisputes({ search, status, reason, role });
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useDisputeStats(role);

  const disputes = data?.pages.flatMap(page => page.disputes) ?? [];

  const hasActiveFilters = !!search || status !== 'all' || reason !== 'all';
  const clearFilters = () => updateParams({ search: '', status: 'all', reason: 'all' });
  const handleSearchChange = useCallback(
    (v: string) => {
      updateParams({ search: v });
    },
    [updateParams]
  );

  return (
    <div>
      <PageHeader title="Disputes" description="Manage and resolve all booking disputes" />
      <DisputeStatsSection
        isError={isStatsError}
        isLoading={isStatsLoading}
        statsData={statsData}
      />
      <div className="grid sm:grid-cols-12 gap-4 mt-12">
        <div className={cn('sm:col-span-8', hasActiveFilters && 'sm:col-span-7')}>
          <SearchInput
            disabled={isError}
            placeholder="Search by bookingId or ServiceName..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="sm:col-span-2">
          <Select
            value={status}
            onChange={v => updateParams({ status: v })}
            leftIcon={<Filter />}
            disabled={isError}
            options={[
              { label: 'All Status', value: 'all' },
              ...DISPUTE_STATUS_VALUES.map(val => ({
                label: val.charAt(0).toUpperCase() + val.replaceAll('_', ' ').slice(1),
                value: val,
              })),
            ]}
          />
        </div>
        <div className="sm:col-span-2">
          <Select
            value={reason}
            onChange={v => updateParams({ reason: v })}
            leftIcon={<Filter />}
            disabled={isError}
            options={[
              { label: 'All Reasons', value: 'all' },
              ...Object.entries(DISPUTE_REASON_LABELS).map(([value, label]) => ({
                label,
                value,
              })),
            ]}
          />
        </div>
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            size="md"
            iconLeft={<X className="h-3 w-3" />}
            variant="red"
            className="ml-auto"
          >
            Clear
          </Button>
        )}
      </div>
      <div className="mt-6">
        <DataList
          data={disputes}
          isLoading={isLoading}
          isError={!!error}
          errorState={
            error ? <ErrorState description={error.message} onRetry={refetch} /> : undefined
          }
          emptyState={
            <EmptyState
              title="No disputes found"
              description="There are no disputes matching your criteria."
              action={
                hasActiveFilters ? (
                  <Button onClick={clearFilters} variant="outline">
                    Clear filters
                  </Button>
                ) : null
              }
            />
          }
          columns={disputeColumns(id => setDisputeBId(id), role)}
          mode="table"
          paginationType="cursor"
          hasNextPage={!!hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
      <DisputeModal
        open={!!disputeBId}
        onClose={() => setDisputeBId(null)}
        bookingId={disputeBId}
        role={role}
      />
    </div>
  );
}
