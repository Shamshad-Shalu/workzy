import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { MessageSquare, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { AppModal } from '@/components/molecules/AppModal';
import { MultiUpload } from '@/components/molecules/MultiUpload';
import { MediaViewer, type MediaItem } from '@/components/organisms/MediaViewer';
import { UploadPurposes } from '@/constants';
import { formatDate } from '@/utils/time.format';

import { useReviewDetails } from '../../hooks/useReview';
import { ReviewSchema, type ReviewFormType } from '../../validation/ReviewFormData';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ReviewFormType) => Promise<void>;
  bookingId?: string;
  reviewId?: string | null;
}

export default function ReviewModal({
  open,
  onClose,
  onSubmit,
  bookingId,
  reviewId,
}: ReviewModalProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { review } = useReviewDetails(reviewId ?? null);
  const isExpired = review ? dayjs().isAfter(dayjs(review.createdAt).add(48, 'hour')) : true;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ReviewFormType>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      bookingId: bookingId ?? '',
      media: [],
      rating: 0,
      reviewText: '',
    },
    mode: 'onChange',
  });

  const mediaItems = watch('media') ?? [];
  const rating = watch('rating');

  useEffect(() => {
    if (!bookingId || !review) {
      return;
    }

    reset({
      bookingId,
      media: review.media ?? [],
      rating: review.rating ?? 0,
      reviewText: review.reviewText ?? '',
    });
  }, [bookingId, review, reset]);

  useEffect(() => {
    if (!review) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [review]);

  const handleClose = () => {
    setIsEditMode(false);
    reset();
    onClose();
  };

  async function onSubmitForm(data: ReviewFormType) {
    await onSubmit?.(data);
    setIsEditMode(false);
  }
  if (!bookingId) {
    return null;
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" disabled={isSubmitting} onClick={handleClose}>
        Close
      </Button>
      {review && !isExpired && !isEditMode && (
        <Button onClick={() => setIsEditMode(true)}>Edit</Button>
      )}
      {isEditMode && (
        <Button
          onClick={handleSubmit(onSubmitForm)}
          disabled={!isValid || isSubmitting || isUploading}
          loading={isSubmitting}
        >
          {isUploading ? 'Waiting for uploads...' : 'Submit Review'}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <AppModal
        open={open && previewIndex === null}
        onClose={handleClose}
        canCloseOnOutsideClick={!isUploading || !isSubmitting}
        title={review ? (isEditMode ? 'Edit Review' : 'Review') : 'Write a Review'}
        className="max-w-xl"
        footer={footer}
      >
        <div className="flex flex-col gap-6 py-2">
          <div className="flex flex-col gap-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  disabled={!isEditMode}
                  onClick={() => setValue('rating', star, { shouldValidate: true })}
                  className={`text-xl ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  } ${!isEditMode ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <Star
                    className={`w-6 h-6 transition ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating === 0 && <p className="text-red-500 text-sm">Please select a rating</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Review</Label>
            <Textarea
              disabled={!isEditMode || isSubmitting}
              placeholder="Share your experience..."
              error={errors.reviewText?.message}
              {...register('reviewText', {
                setValueAs: v => String(v).trim(),
              })}
            />
          </div>
          <Controller
            name="media"
            control={control}
            render={({ field }) => (
              <MultiUpload
                label="Review Evidence"
                value={field.value}
                onChange={field.onChange}
                purpose={UploadPurposes.REVIEW_EVIDENCE}
                onPreview={setPreviewIndex}
                maxFiles={5}
                autoCompress
                disabled={!isEditMode}
                onUploadingChange={setIsUploading}
              />
            )}
          />
          {review?.reply?.message && (
            <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare size={13} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Worker's Reply</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {formatDate(review.reply.repliedAt)} ·{' '}
                  {dayjs(review.reply.repliedAt).format('h:mm A')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-9">
                {review.reply.message}
              </p>
            </div>
          )}
        </div>
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
