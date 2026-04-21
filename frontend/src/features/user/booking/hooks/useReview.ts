import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking/hooks/useBooking';
import ReviewService from '@/services/review.service';
import type { Review } from '@/types/review';

import type { ReviewFormType } from '../validation/ReviewFormData';

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  user: (status: string) => [...reviewKeys.lists(), 'user', status] as const,
  worker: (status: string) => [...reviewKeys.lists(), 'worker', status] as const,
  admin: (filters: string) => [...reviewKeys.lists(), 'admin', filters] as const,
  detail: (id: string) => [...reviewKeys.all, 'detail', id] as const,
};

export function useReviewDetails(reviewId: string | null) {
  const query = useQuery<Review>({
    queryKey: reviewKeys.detail(reviewId!),
    queryFn: async () => {
      const res = await ReviewService.getReviewById(reviewId!);
      return res;
    },
    enabled: !!reviewId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    review: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateBookingReview() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, ReviewFormType>({
    mutationFn: (data: ReviewFormType) => ReviewService.createReview(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.lists() });
      qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

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

export function useEditBookingReview() {
  const qc = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    { reviewId: string; data: Partial<ReviewFormType> }
  >({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: Partial<ReviewFormType> }) =>
      ReviewService.updateReview(reviewId, data),
    onSuccess: (_, { reviewId }) => {
      qc.invalidateQueries({ queryKey: reviewKeys.lists() });
      qc.invalidateQueries({ queryKey: bookingKeys.all });
      qc.invalidateQueries({ queryKey: reviewKeys.detail(reviewId) });
    },
  });
}
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
