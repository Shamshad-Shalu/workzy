import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking/hooks/useBooking';
import { reviewKeys, type CreateReviewFormType } from '@/features/review';
import ReviewService from '@/services/review.service';


export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    { reviewId: string; data: Partial<CreateReviewFormType> }
  >({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: Partial<CreateReviewFormType> }) =>
      ReviewService.updateReview(reviewId, data),
    onSuccess: (_, { reviewId }) => {
      qc.invalidateQueries({ queryKey: reviewKeys.lists() });
      qc.invalidateQueries({ queryKey: bookingKeys.all });
      qc.invalidateQueries({ queryKey: reviewKeys.detail(reviewId) });
    },
  });
}
