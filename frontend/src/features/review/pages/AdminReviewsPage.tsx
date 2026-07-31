import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, SlidersHorizontal, Star } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import StatusChangeModal from '@/components/molecules/StatusChangeModal';
import { Button as Btn } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ReviewCardSkeleton,
  useAdminReviews,
  AdminReviewFilters,
  useAdminReviewFilters,
} from '@/features/review';
import ReviewMediaViewer from '@/features/review/components/ReviewMediaViewer';
import { useToggleReviewVisibility } from '@/features/user/booking/hooks/useReview';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { cn } from '@/lib/utils';
import type { EvidenceItem } from '@/types/booking';
import type { AdminReviewView } from '@/types/review';
import { formatDateForUrl } from '@/utils/time.format';

import ReviewCard from '../components/ReviewCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

export default function AdminReviewsPage() {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [review, setReview] = useState<AdminReviewView | null>(null);
  const [mediaItems, setMediaItems] = useState<EvidenceItem[]>([]);
  const filters = useAdminReviewFilters();
  const { mutateAsync: toggleReviewVisibility, isPending: isTogglingReview } =
    useToggleReviewVisibility();

  const { hasActiveFilters, status, search, sortBy, updateParams, sortOrder, resetFilters } =
    filters;

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminReviews({
      status,
      sortBy,
      sortOrder,
      rating: filters.rating ?? undefined,
      minRating: filters.minRating ?? undefined,
      maxRating: filters.maxRating ?? undefined,
      fromDate: formatDateForUrl(filters.fromDate),
      toDate: formatDateForUrl(filters.toDate),
      search: search || undefined,
    });

  const reviews = data?.pages.flatMap(p => p.reviews) ?? [];
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const handleSearchChange = useCallback(
    (v: string) => updateParams({ search: v }),
    [updateParams]
  );
  const handleOpenMedia = (items: EvidenceItem[], index: number) => {
    setMediaItems(items);
    setPreviewIndex(index);
  };

  const handleToggleReview = async () => {
    if (!review?.id) {
      return null;
    }
    const res = await toggleReviewVisibility({ reviewId: review.id });
    if (res?.message) {
      toast.success(res.message);
      setReview(null);
    }
  };

  return (
    <main className="space-y-6 pt-0 p-4 lg:p-6">
      <PageHeader title="All Reviews" description="Platform-wide Review management" />
      <div className="md:sticky md:-top-6 md:z-20 bg-background pt-4 pb-2 ">
        <div className="bg-card border rounded-xl p-4">
          <div className="grid sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <SearchInput
                disabled={!!error}
                placeholder="Search by booking ID or name..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="sm:col-span-2">
              <Select
                value={sortBy}
                onChange={v => updateParams({ sortBy: v })}
                leftIcon={<ArrowUpDown size={14} className="mr-1" />}
                options={[
                  { label: 'Most Recent', value: 'createdAt' },
                  { label: 'Rating', value: 'rating' },
                ]}
              />
            </div>
            <div className="sm:col-span-2">
              <Select
                value={sortOrder}
                onChange={v => updateParams({ sortOrder: v })}
                options={[
                  { label: 'High → Low', value: 'desc' },
                  { label: 'Low → High', value: 'asc' },
                ]}
              />
            </div>
            <div className="sm:col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Btn variant="outline">
                    <SlidersHorizontal size={14} />
                    Filters ({filters.activeFilterCount})
                  </Btn>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] space-y-3">
                  <AdminReviewFilters {...filters} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'space-y-6 mt-4',
          reviews.length > 10 &&
            'md:overflow-y-auto md:max-h-[calc(100vh-200px)] md:custom-scrollbar'
        )}
      >
        {isLoading ? (
          <div className="space-y-4">
            <ReviewCardSkeleton showBothParties />
          </div>
        ) : error ? (
          <ErrorState
            title="Something went wrong"
            description={error?.message || 'Failed to load reviews. Please try again.'}
            onRetry={refetch}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {reviews.length === 0 ? (
                <EmptyState
                  title={hasActiveFilters ? 'Try adjusting your filters.' : 'No reviews found'}
                  description={
                    hasActiveFilters ? 'No reviews match the selected filters.' : 'No reviews found'
                  }
                  icon={<Star className="w-8 h-8 text-muted-foreground" />}
                  action={
                    <>
                      {hasActiveFilters && (
                        <Button variant="red" size="sm" onClick={resetFilters} className="mt-4">
                          Clear filters
                        </Button>
                      )}
                    </>
                  }
                />
              ) : (
                reviews.map(review => (
                  <ReviewCard
                    review={review}
                    onOpenMedia={handleOpenMedia}
                    role="admin"
                    onToggleReview={r => setReview(r)}
                  />
                ))
              )}
            </AnimatePresence>
            <div ref={sentinelRef} className="h-4" />
          </motion.div>
        )}
        {isFetchingNextPage && <ReviewCardSkeleton showBothParties count={3} />}
      </div>
      <ReviewMediaViewer
        previewIndex={previewIndex}
        mediaItems={mediaItems}
        onClose={() => setPreviewIndex(null)}
        setPreviewIndex={setPreviewIndex}
      />
      <StatusChangeModal
        open={!!review}
        onClose={() => setReview(null)}
        fromStatus={review?.isEdited ? 'Hidden' : 'Visible'}
        toStatus={review?.isEdited ? 'Visible' : 'Hidden'}
        loading={isTogglingReview}
        onConfirm={handleToggleReview}
      />
    </main>
  );
}
