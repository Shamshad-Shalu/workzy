import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import {
  ReviewCard,
  ReviewCardSkeleton,
  ReviewFilterBar,
  ReviewMediaViewer,
  ReviewSummary,
  ReviewSummarySkeleton,
  useReviewFilterParams,
  useWorkerPublicReviews,
  useWorkerReviewStats,
} from '@/features/review';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { EvidenceItem } from '@/types/booking';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

export default function WorkerPublicReviewsPage() {
  const { sortBy, sortOrder, rating, updateParams, clearFilters } = useReviewFilterParams();

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [mediaItems, setMediaItems] = useState<EvidenceItem[]>([]);
  const { workerId } = useParams();

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWorkerPublicReviews(workerId, { sortBy, sortOrder, rating: rating ?? undefined });
  const { data: reviewStats, isLoading: statsLoading } = useWorkerReviewStats(workerId);

  const { averageRating, reviewCount, breakdown } = reviewStats ?? {};
  const reviews = data?.pages.flatMap(p => p.reviews) ?? [];
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const isHideButton = sortBy !== 'createdAt' || sortOrder !== 'desc' || rating !== null;
  const handleOpenMedia = (items: EvidenceItem[], index: number) => {
    setMediaItems(items);
    setPreviewIndex(index);
  };

  return (
    <main className="space-y-6">
      {statsLoading ? (
        <ReviewSummarySkeleton />
      ) : reviewStats ? (
        <div className="space-y-6">
          <ReviewSummary
            averageRating={averageRating!}
            reviewCount={reviewCount!}
            breakdown={breakdown!}
            rating={rating}
            onRatingChange={star => updateParams({ rating: star })}
          />
          <ReviewFilterBar
            sortBy={sortBy}
            sortOrder={sortOrder}
            rating={rating}
            onSortByChange={value => updateParams({ sortBy: value })}
            onSortOrderChange={value => updateParams({ sortOrder: value })}
            onClearRating={clearFilters}
          />
        </div>
      ) : null}
      {isLoading ? (
        <div className="space-y-4">
          <ReviewCardSkeleton />
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
                title={isHideButton ? 'Try adjusting your filters.' : 'No reviews found'}
                description={
                  isHideButton ? 'No reviews match the selected filters.' : 'No reviews found'
                }
                icon={<Star className="w-8 h-8 text-muted-foreground" />}
                action={
                  <>
                    {isHideButton && (
                      <Button variant="red" size="sm" onClick={clearFilters} className="mt-4">
                        Clear filters
                      </Button>
                    )}
                  </>
                }
              />
            ) : (
              reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  role="public"
                  review={review}
                  onOpenMedia={handleOpenMedia}
                />
              ))
            )}
          </AnimatePresence>
          <div ref={sentinelRef} className="h-4" />
        </motion.div>
      )}
      {isFetchingNextPage && <ReviewCardSkeleton key={3} />}
      <ReviewMediaViewer
        previewIndex={previewIndex}
        mediaItems={mediaItems}
        onClose={() => setPreviewIndex(null)}
        setPreviewIndex={setPreviewIndex}
      />
    </main>
  );
}
