import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking/hooks/useBooking';
import { reviewKeys, type CreateReviewFormType } from '@/features/review';
import ReviewService from '@/services/review.service';

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, CreateReviewFormType>({
    mutationFn: (data: CreateReviewFormType) => ReviewService.createReview(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.lists() });
      qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
