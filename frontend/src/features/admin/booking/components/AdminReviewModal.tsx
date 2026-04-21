import { Film, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/atoms/Button';
import { StarRating } from '@/components/atoms/StarRating';
import { AppModal } from '@/components/molecules/AppModal';
import { MediaViewer, type MediaItem } from '@/components/organisms/MediaViewer';
import { useReviewDetails } from '@/features/user/booking/hooks/useReview';
import { formatSmartDateTime } from '@/utils/time.format';

interface AdminReviewModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string;
  onToggleVisibility: (reviewId: string) => Promise<void>;
  isToggling?: boolean;
}

export default function AdminReviewModal({
  open,
  onClose,
  reviewId,
  onToggleVisibility,
  isToggling = false,
}: AdminReviewModalProps) {
  const { review, isLoading } = useReviewDetails(reviewId);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const mediaItems = review?.media ?? [];

  async function handleToggle() {
    if (!review) {return;}
    await onToggleVisibility(reviewId);
  }

  const footer = (
    <div className="flex justify-between gap-2">
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>

      {review && (
        <Button
          variant={review.isHidden ? 'green' : 'red'}
          onClick={handleToggle}
          loading={isToggling}
        >
          {review.isHidden ? (
            <>
              <Eye size={14} className="mr-1" /> Unhide
            </>
          ) : (
            <>
              <EyeOff size={14} className="mr-1" /> Hide
            </>
          )}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <AppModal
        open={open && previewIndex === null}
        onClose={onClose}
        title="Customer Review"
        canCloseOnOutsideClick={!isToggling}
        className="max-w-xl"
        footer={footer}
      >
        {isLoading || !review ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading review...</div>
        ) : (
          <div className="flex flex-col gap-5 py-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <StarRating rating={review.rating} />
                <span className="text-[11px] text-muted-foreground whitespace-nowrap pt-0.5">
                  {formatSmartDateTime(review.createdAt)}
                </span>
              </div>

              {review.reviewText && (
                <p className="text-sm text-foreground leading-relaxed">{review.reviewText}</p>
              )}
            </div>

            {mediaItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">Media</span>

                <div className="grid grid-cols-3 gap-3">
                  {mediaItems.map((m, i) => (
                    <div
                      key={i}
                      onClick={() => setPreviewIndex(i)}
                      className="w-full aspect-square rounded-lg border border-border bg-muted overflow-hidden cursor-pointer"
                    >
                      {m.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <video src={m.url} className="w-full h-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Film size={20} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {review.reply?.message && (
              <div className="border-t border-border pt-4">
                <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col gap-2">
                  <p className="text-xs font-medium text-foreground">Worker Reply</p>
                  <p className="text-sm text-muted-foreground">{review.reply.message}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatSmartDateTime(review.reply.repliedAt)}
                  </p>
                </div>
              </div>
            )}
            {review.isHidden && (
              <div className="text-xs text-red-500 font-medium">
                This review is currently hidden
              </div>
            )}
          </div>
        )}
      </AppModal>

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
    </>
  );
}
