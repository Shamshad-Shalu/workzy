import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, Star } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import { StarRating } from '@/components/atoms/StarRating';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import RatingDistributionBar from '@/components/molecules/RatingDistributionBar';
import { MediaViewer, type MediaItem } from '@/components/organisms/MediaViewer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import type { EvidenceItem } from '@/types/booking';

import ReviewCard from '../components/ReviewCard';
import { ReviewCardSkeleton, ReviewSummarySkeleton } from '../components/WorkerReviewsPageSkeleton';
import { useWorkerPublicReviews, useWorkerReviewStats } from '../hooks/useWorkerReviews';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const summaryVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

const CUSTOM_PARAMS = [
  { key: 'sortBy', defaultValue: 'createdAt' },
  { key: 'sortOrder', defaultValue: 'desc' },
  { key: 'rating', parser: (v: string) => (v ? Number(v) : null) },
];

export default function WorkerReviewsPage() {
  const { sortBy, sortOrder, rating, updateParams } = useUrlFilterParams<{
    sortBy: 'createdAt' | 'rating';
    sortOrder: 'asc' | 'desc';
    rating: number | null;
  }>(CUSTOM_PARAMS);

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [mediaItems, setMediaItems] = useState<EvidenceItem[]>([]);
  const { workerId } = useParams();

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWorkerPublicReviews(workerId, { sortBy, sortOrder, rating: rating ?? undefined });
  const { data: reviewStats, isLoading: statsLoading } = useWorkerReviewStats(workerId);

  const { averageRating, reviewCount, breakdown } = reviewStats ?? {};
  const reviews = data?.pages.flatMap(p => p.reviews) ?? [];
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const clearFilters = () => {
    updateParams({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      rating: null,
    });
  };
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
          <motion.div
            variants={summaryVariants}
            initial="hidden"
            animate="visible"
            className="rounded-xl border bg-card p-6"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-1 sm:min-w-[140px]">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
                  className="text-5xl font-bold text-foreground"
                >
                  {averageRating!.toFixed(1)}
                </motion.span>
                <StarRating rating={Math.round(averageRating!)} size="lg" />
                <span className="text-sm text-muted-foreground">{reviewCount} reviews</span>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map(star => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateParams({ rating: rating === star ? null : star })}
                    className={`w-full rounded-md px-2 py-0.5 transition-colors hover:bg-accent ${
                      rating === star ? 'bg-accent' : ''
                    }`}
                  >
                    <RatingDistributionBar
                      star={star}
                      count={breakdown![String(star) as keyof typeof breakdown]}
                      total={reviewCount!}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </div>
            <Select
              value={sortBy}
              onValueChange={v => updateParams({ sortBy: v as 'createdAt' | 'rating' })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Most Recent</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={v => updateParams({ sortOrder: v as 'asc' | 'desc' })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">High → Low</SelectItem>
                <SelectItem value="asc">Low → High</SelectItem>
              </SelectContent>
            </Select>
            <AnimatePresence>
              {rating !== null && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => updateParams({ rating: null })}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  {rating} star only <span className="ml-1">✕</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ) : null}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <ReviewCardSkeleton />
            </motion.div>
          ))}
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
                <ReviewCard key={review.id} review={review} onOpenMedia={handleOpenMedia} />
              ))
            )}
          </AnimatePresence>
          <div ref={sentinelRef} className="h-4" />
        </motion.div>
      )}
      {isFetchingNextPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-3"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </motion.div>
      )}
      <AnimatePresence>
        {previewIndex !== null && mediaItems[previewIndex] && (
          <MediaViewer
            item={mediaItems[previewIndex] as MediaItem}
            onClose={() => setPreviewIndex(null)}
            onPrev={() => setPreviewIndex(i => Math.max(0, i! - 1))}
            onNext={() => setPreviewIndex(i => Math.min(mediaItems.length - 1, i! + 1))}
            hasPrev={previewIndex > 0}
            hasNext={previewIndex < mediaItems.length - 1}
            counter={`${previewIndex + 1} / ${mediaItems.length}`}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
