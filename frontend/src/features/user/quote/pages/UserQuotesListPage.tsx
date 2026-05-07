import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';

import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import SearchInput from '@/components/molecules/SearchInput';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROLE } from '@/constants';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import PageError from '@/pages/PageError';
import type { QuoteListItem } from '@/types/quote';

import QuoteCard from '../../../quote/components/QuoteCard';
import QuoteCardSkeleton from '../../../quote/components/QuoteCardSkeleton';
import ApproveQuoteModal from '../components/ApproveQuoteModal';
import RejectQuoteModal from '../components/RejectQuoteModal';
import { useAcceptQuote, useRejectQuote, useUserQuotes } from '../hooks/useUserQuotes';


export default function UserQuotesListPage() {
  const [approveQuote, setApproveQuote] = useState<null | QuoteListItem>(null);
  const [rejectQuote, setRejectQuote] = useState<null | QuoteListItem>(null);

  const { search, status, updateParams } = useUrlFilterParams();
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserQuotes({ search, status });
  const { acceptQuote, isPending: isAcceptingQuote } = useAcceptQuote();

  const quotes = data?.pages.flatMap(p => p.quotes) ?? [];

  const hasActiveFilters = !!search || status !== 'all';
  const clearFilters = () => {
    updateParams({ search: '', status: 'all' });
  };
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const handleSearchChange = useCallback(
    (v: string) => updateParams({ search: v }),
    [updateParams]
  );

  const { rejectQuote: confirmReject, isPending: isRejectingQuote } = useRejectQuote();

  const handleRejectQuote = async () => {
    if (!rejectQuote?.id) {
      return;
    }
    await confirmReject(rejectQuote.id);
    setRejectQuote(null);
  };

  const handleAcceptQuote = async () => {
    if (!approveQuote?.id) {
      return;
    }
    await acceptQuote(approveQuote.id);
    setApproveQuote(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Quotes</h1>
          <p className="text-sm text-muted-foreground">Track quotes you've sent to customers.</p>
        </div>
      </div>
      <Tabs value={status} onValueChange={v => updateParams({ status: v })} className="mb-4">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="all" className="gap-1.5">
            All
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-1.5">
            Pending
          </TabsTrigger>
          <TabsTrigger value="accepted" className="gap-1.5">
            Accepted
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-1.5">
            Rejected
          </TabsTrigger>
          <TabsTrigger value="expired" className="gap-1.5">
            Expired
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
            <QuoteCard
              key={q.id}
              quote={q}
              delay={i * 0.03}
              role={ROLE.USER}
              onAccept={q => setApproveQuote(q)}
              onReject={q => setRejectQuote(q)}
            />
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

      {approveQuote && (
        <ApproveQuoteModal
          open={!!approveQuote}
          onClose={() => setApproveQuote(null)}
          isSubmitting={isAcceptingQuote}
          quote={approveQuote}
          onSubmit={handleAcceptQuote}
        />
      )}

      {rejectQuote && (
        <RejectQuoteModal
          open={!!rejectQuote}
          onClose={() => setRejectQuote(null)}
          isSubmitting={isRejectingQuote}
          quote={rejectQuote}
          onSubmit={handleRejectQuote}
        />
      )}
    </div>
  );
}
