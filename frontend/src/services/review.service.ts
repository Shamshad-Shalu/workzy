import { REVIEW_API } from '@/constants';
import type { ReviewFormType } from '@/features/user/booking/validation/ReviewFormData';
import api from '@/lib/api/axios';
import type { Review } from '@/types/review';

const ReviewService = {
  createReview: async (data: ReviewFormType): Promise<{ message: string }> => {
    const res = await api.post(REVIEW_API.ROOT, data);
    return res.data;
  },

  getReviewById: async (reviewId: string): Promise<Review> => {
    const res = await api.get(REVIEW_API.BY_ID(reviewId));
    return res.data.review;
  },

  updateReview: async (
    reviewId: string,
    data: Partial<ReviewFormType>
  ): Promise<{ message: string }> => {
    const res = await api.patch(REVIEW_API.BY_ID(reviewId), data);
    return res.data;
  },

  addReplyToReview: async (reviewId: string, message: string): Promise<{ message: string }> => {
    const res = await api.patch(REVIEW_API.REPLY(reviewId), { message });
    return res.data;
  },
  toggleReview: async (reviewId: string): Promise<{ message: string }> => {
    const res = await api.patch(REVIEW_API.TOGGLE(reviewId));
    return res.data;
  },

  // getMyReviews: async (): Promise<Review[]> => {
  //   const res = await api.get(REVIEW_API.MY_REVIEWS);
  //   return res.data.reviews;
  // },

  // getWorkerReviews: async (workerId: string): Promise<Review[]> => {
  //   const res = await api.get(REVIEW_API.WORKER_REVIEWS(workerId));
  //   return res.data.reviews;
  // },

  // getMyWorkerReviews: async (): Promise<Review[]> => {
  //   const res = await api.get(REVIEW_API.MY_WORKER_REVIEWS);
  //   return res.data.reviews;
  // },
  // listReviews: async (params?: {
  //   search?: string;
  //   rating?: number;
  //   isHidden?: boolean;
  //   limit?: number;
  //   cursor?: string;
  // }): Promise<Review[]> => {
  //   const res = await api.get(REVIEW_API.ROOT, { params });
  //   return res.data.reviews;
  // }
};

export default ReviewService;
