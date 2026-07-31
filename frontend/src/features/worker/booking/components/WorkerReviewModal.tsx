import { Film } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/atoms/Button';
import { StarRating } from '@/components/atoms/StarRating';
import { Textarea } from '@/components/atoms/Textarea';
import { AppModal } from '@/components/molecules/AppModal';
import { MediaViewer, type MediaItem } from '@/components/organisms/MediaViewer';
import { useReviewDetails } from '@/features/review';
import { formatSmartDateTime } from '@/utils/time.format';

interface WorkerReviewReplyModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string;
  onSubmit: (message: string) => Promise<void>;
  isReplying?: boolean;
}

const MAX_CHARS = 500;

export default function WorkerReviewReplyModal({
  open,
  onClose,
  reviewId,
  onSubmit,
  isReplying = false,
}: WorkerReviewReplyModalProps) {
  const { data: review, isLoading } = useReviewDetails(reviewId);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const hasReply = !!review?.reply?.message;
  const showInput = !hasReply || isEditing;
  const mediaItems = review?.media ?? [];

  function handleEditClick() {
    setMessage(review?.reply?.message ?? '');
    setIsEditing(true);
  }

  function handleClose() {
    setMessage('');
    setIsEditing(false);
    onClose();
  }

  async function handleSubmit() {
    if (!message.trim()) {
      return;
    }
    await onSubmit(message.trim());
    setMessage('');
    setIsEditing(false);
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" disabled={isReplying} onClick={handleClose}>
        {showInput ? 'Cancel' : 'Close'}
      </Button>
      {showInput && (
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || message.length > MAX_CHARS || isReplying}
          loading={isReplying}
        >
          {isEditing ? 'Update reply' : 'Post reply'}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <AppModal
        open={open && previewIndex === null}
        onClose={handleClose}
        canCloseOnOutsideClick={!isReplying}
        title="Customer review"
        className="max-w-xl"
        footer={footer}
      >
        {isLoading || !review ? (
          <div className="py-8 flex items-center justify-center text-sm text-muted-foreground">
            Loading review...
          </div>
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
            {mediaItems && mediaItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">Media</span>

                <div className="grid grid-cols-3 gap-3">
                  {mediaItems.map((m, i) => (
                    <div
                      key={i}
                      onClick={() => setPreviewIndex(i)}
                      className="w-full aspect-square rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden"
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
            <div className="border-t border-border pt-4">
              {hasReply && !isEditing ? (
                <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-foreground">Your reply</p>
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Edit reply
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.reply!.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatSmartDateTime(review.reply!.repliedAt)}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    {isEditing ? 'Edit your reply' : 'Your reply'}
                  </label>
                  <Textarea
                    placeholder="Write a professional reply to this review..."
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    disabled={isReplying}
                    maxLength={MAX_CHARS}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Visible to the customer publicly
                    </span>
                    <span
                      className={`text-[11px] ${
                        message.length > MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'
                      }`}
                    >
                      {message.length} / {MAX_CHARS}
                    </span>
                  </div>
                </div>
              )}
            </div>
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
