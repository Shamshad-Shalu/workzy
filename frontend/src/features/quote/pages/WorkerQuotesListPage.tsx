import { FileText, Search, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import SearchInput from '@/components/molecules/SearchInput';
import StatCard from '@/components/molecules/StatCard';
import { ROLE } from '@/constants';
import PageError from '@/pages/PageError';
import type { QuoteListItem } from '@/types/quote';
import { formatCurrency } from '@/utils/currency';

import {
  QuoteCard,
  QuoteCardSkeleton,
  QuoteEditModal,
  QuoteStatsSkeleton,
  QuoteStatusTabs,
  useQuoteList,
  useWorkerQuoteStats,
} from '../index';

export default function WorkerQuotesListPage() {
  const [editingQuote, setEditingQuote] = useState<QuoteListItem | null>(null);
  const {
    quotes,
    search,
    status,
    isLoading,
    error,
    refetch,
    isFetchingNextPage,
    hasActiveFilters,
    clearFilters,
    handleSearchChange,
    sentinelRef,
    updateParams,
  } = useQuoteList();

  const { data: stats, isLoading: statsLoading } = useWorkerQuoteStats();
  const { counts, acceptRate, totalEarned } = stats ?? {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Quotes</h1>
          <p className="text-sm text-muted-foreground">Track quotes you've sent to customers.</p>
        </div>
      </div>
      {statsLoading ? (
        <QuoteStatsSkeleton />
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard
            icon={<FileText className="h-4 w-4" />}
            label="Quotes sent"
            value={counts?.all}
            sub=""
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Acceptance rate"
            value={`${acceptRate}%`}
            sub=""
            tone="info"
          />
          <StatCard
            icon={<Wallet className="h-4 w-4" />}
            label="Earned (accepted)"
            value={formatCurrency(totalEarned)}
            tone="success"
            sub=""
          />
        </div>
      )}

      <QuoteStatusTabs
        value={status}
        onValueChange={v => updateParams({ status: v })}
        counts={counts}
        className="mb-4"
      />
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
        <QuoteCardSkeleton />
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
            <QuoteCard
              key={q.id}
              quote={q}
              delay={i * 0.03}
              role={ROLE.WORKER}
              onUpdate={(quote: QuoteListItem) => setEditingQuote(quote)}
            />
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && <QuoteCardSkeleton />}

      {editingQuote && (
        <QuoteEditModal
          open={!!editingQuote}
          onClose={() => setEditingQuote(null)}
          quote={editingQuote}
          serviceId={editingQuote.serviceId}
        />
      )}
    </div>
  );
}
