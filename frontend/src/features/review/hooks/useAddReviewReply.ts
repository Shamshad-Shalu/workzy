import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking/hooks/useBooking';
import { reviewKeys } from '@/features/review';
import ReviewService from '@/services/review.service';

export function useAddReviewReply() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { reviewId: string; message: string }>({
    mutationFn: ({ reviewId, message }: { reviewId: string; message: string }) =>
      ReviewService.addReplyToReview(reviewId, message),
    onSuccess: (_, { reviewId }) => {
      qc.invalidateQueries({ queryKey: reviewKeys.lists() });
      qc.invalidateQueries({ queryKey: bookingKeys.all });
      qc.invalidateQueries({ queryKey: reviewKeys.detail(reviewId) });
    },
  });
}
