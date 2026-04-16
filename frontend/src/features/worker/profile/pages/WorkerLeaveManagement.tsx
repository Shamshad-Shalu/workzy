import { AnimatePresence, motion } from 'framer-motion';
import { CalendarOff, Plus } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/atoms/Button';
import { AppModal } from '@/components/molecules/AppModal';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/molecules/PageHeader';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { cn } from '@/lib/utils';
import type { LeaveFilter } from '@/types/leave';

import AddLeaveModal from '../components/AddLeaveModal';
import { LeaveCard } from '../components/LeaveCard';
import { LeaveListSkeleton, LeaveStatsSkeleton } from '../components/Leavecardskeleton';
import { useCancelLeave, useCreateLeave, useLeaveStats, useWorkerLeaves } from '../hooks/useLeave';

const FILTERS: { label: string; value: LeaveFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
  { label: 'This Month', value: 'this-month' },
];

export default function WorkerLeaveManagement() {
  const [activeFilter, setActiveFilter] = useState<LeaveFilter>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWorkerLeaves(activeFilter);

  const { data: stats, isLoading: loadingStats } = useLeaveStats();

  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const { mutate: createLeave, isPending: creating } = useCreateLeave();
  const { mutate: cancelLeave, isPending: cancelling } = useCancelLeave();

  const leaves = data?.pages.flatMap(p => p.leaves) ?? [];

  const handleCancel = () => {
    if (!cancelId) {
      return;
    }
    cancelLeave(cancelId, { onSuccess: () => setCancelId(null) });
  };

  return (
    <div className="py-6 ">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Leave Management" description="Manage your unavailable dates" />
        <Button
          iconLeft={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
          size="md"
        >
          Add Leave
        </Button>
      </div>
      {loadingStats ? (
        <LeaveStatsSkeleton />
      ) : (
        stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
            {(
              [
                { label: 'Total Leaves', value: stats.total },
                { label: 'Upcoming', value: stats.upcoming },
                { label: 'This Month', value: stats.thisMonth },
                { label: 'Past', value: stats.past },
              ] as const
            ).map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-muted/50 border border-border/40 rounded-xl p-4"
              >
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )
      )}

      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all',
              activeFilter === f.value
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:text-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LeaveListSkeleton />
      ) : isError ? (
        <ErrorState
          title="Couldn't load leaves"
          description="Something went wrong while fetching your leave data."
          onRetry={() => refetch()}
        />
      ) : leaves.length === 0 ? (
        <EmptyState
          icon={<CalendarOff className="w-6 h-6" />}
          title="No leaves found"
          description={
            activeFilter === 'all'
              ? "You haven't added any leaves yet."
              : `No ${activeFilter} leaves found.`
          }
          hint="Add a leave to block your availability on specific dates."
        />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {leaves.map(leave => (
              <LeaveCard key={leave.id} leave={leave} onCancel={id => setCancelId(id)} />
            ))}
          </AnimatePresence>
          <>
            {isFetchingNextPage && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <LeaveListSkeleton count={3} />
              </motion.div>
            )}
            <div ref={sentinelRef} className="h-1"></div>
          </>
        </div>
      )}

      <AddLeaveModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        isLoading={creating}
        onSubmit={createLeave}
      />

      <AppModal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        title="Cancel Leave?"
        isDescriptionHidden={false}
        confirmText="Yes, Cancel"
        cancelText="Keep It"
        buttonVariant="red"
        onConfirm={handleCancel}
        isConfirmLoading={cancelling}
        className="sm:max-w-sm"
      >
        <span className="block mb-2">
          This will remove the leave and make you available again on those dates.
        </span>
        <p></p>
      </AppModal>
    </div>
  );
}
