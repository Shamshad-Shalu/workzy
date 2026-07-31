import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking/hooks/useBooking';
import { reviewKeys } from '@/features/review';
import ReviewService from '@/services/review.service';


export function useToggleReviewVisibility() {
  const qc = useQueryClient();

  return useMutation<{ message: string }, Error, { reviewId: string }>({
    mutationFn: ({ reviewId }) => ReviewService.toggleReview(reviewId),
    onSuccess: (_, { reviewId }) => {
      qc.invalidateQueries({ queryKey: reviewKeys.lists() });
      qc.invalidateQueries({ queryKey: bookingKeys.all });
      qc.invalidateQueries({ queryKey: reviewKeys.detail(reviewId) });
    },
  });
}
