import { motion } from 'framer-motion';
import { FileText, Search, TrendingUp, Wallet } from 'lucide-react';
import { useCallback } from 'react';

import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import SearchInput from '@/components/molecules/SearchInput';
import StatCard from '@/components/molecules/StatCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROLE } from '@/constants';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import PageError from '@/pages/PageError';
import { formatCurrency } from '@/utils/currency';

import QuoteCard from '../../../quote/components/QuoteCard';
import QuoteCardSkeleton from '../../../quote/components/QuoteCardSkeleton';
import StatsSkeleton from '../../../quote/components/StatsSkeleton';
import { useWokerQuoteStats, useWorkerQuotes } from '../hooks/useWorkerQuotes';

export default function WorkerQuotesListPage() {
  const { search, status, updateParams } = useUrlFilterParams();
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWorkerQuotes({ search, status });
  const { data: stats, isLoading: statsLoading } = useWokerQuoteStats();

  const quotes = data?.pages.flatMap(p => p.quotes) ?? [];
  const { counts, acceptRate, totalEarned } = stats ?? {};

  const hasActiveFilters = !!search || status !== 'all';
  const clearFilters = () => {
    updateParams({ search: '', status: 'all' });
  };
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const handleSearchChange = useCallback(
    (v: string) => updateParams({ search: v }),
    [updateParams]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Quotes</h1>
          <p className="text-sm text-muted-foreground">Track quotes you've sent to customers.</p>
        </div>
        {/* <Button>
          <Plus className="h-4 w-4" />
          New Quote
        </Button> */}
      </div>
      {statsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            icon={<FileText className="h-4 w-4" />}
            label="Quotes sent"
            value={counts?.all ?? 0}
            sub=""
            tone="amber"
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Acceptance rate"
            value={`${acceptRate ?? 0}%`}
            sub=""
            tone="emerald"
          />
          <StatCard
            icon={<Wallet className="h-4 w-4" />}
            label="Earned (accepted)"
            value={formatCurrency(totalEarned ?? 0)}
            tone="violet"
            sub=""
          />
        </div>
      )}

      <Tabs value={status} onValueChange={v => updateParams({ status: v })} className="mb-4">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="all" className="gap-1.5">
            All <Pill>{counts?.all}</Pill>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-1.5">
            Pending <Pill>{counts?.pending}</Pill>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="gap-1.5">
            Accepted <Pill>{counts?.accepted}</Pill>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-1.5">
            Rejected <Pill>{counts?.rejected}</Pill>
          </TabsTrigger>
          <TabsTrigger value="expired" className="gap-1.5">
            Expired <Pill>{counts?.expired}</Pill>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by booking, customer, service…"
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <QuoteCardSkeleton key={i} delay={i * 0.07} />
          ))}
        </div>
      ) : error ? (
        <PageError onRetry={refetch} description={error.message} />
      ) : quotes.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'Try adjusting your filters.' : 'No quotes found'}
          description={
            hasActiveFilters ? 'No quotes match the selected filters.' : 'No quotes found'
          }
          action={
            <>
              {hasActiveFilters && (
                <Button variant="red" size="sm" onClick={clearFilters} className="mt-4">
                  Clear filters
                </Button>
              )}
            </>
          }
        />
      ) : (
        <div className="space-y-3">
          {quotes.map((q, i) => (
            <QuoteCard key={q.id} quote={q} delay={i * 0.03} role={ROLE.WORKER} />
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-3 mt-3"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <QuoteCardSkeleton key={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}
