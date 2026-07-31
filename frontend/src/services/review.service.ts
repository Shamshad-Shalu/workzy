import { REVIEW_API } from '@/constants';
import type { ReviewFormType } from '@/features/user/booking/validation/ReviewFormData';
import api from '@/lib/api/axios';
import type {
  AdminReviewListQuery,
  AdminReviewListResponse,
  PublicReviewListResponse,
  Review,
  ReviewListQuery,
  WorkerReviewListResponse,
  WorkerReviewStats,
} from '@/types/review';

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

  getWorkerReviewStats: async (workerId: string): Promise<WorkerReviewStats> => {
    const res = await api.get(REVIEW_API.WORKER_REVIEWS_STATS(workerId));
    return res.data;
  },
  getWorkerPublicReviews: async (
    workerId: string,
    query: ReviewListQuery
  ): Promise<PublicReviewListResponse> => {
    const res = await api.get(REVIEW_API.WORKER_REVIEWS(workerId), { params: query });
    return res.data;
  },

  getWorkerOwnReviews: async (params: ReviewListQuery): Promise<WorkerReviewListResponse> => {
    const res = await api.get(REVIEW_API.MY_WORKER_REVIEWS, { params });
    return res.data;
  },

  listReviews: async (params: AdminReviewListQuery): Promise<AdminReviewListResponse> => {
    const res = await api.get(REVIEW_API.ROOT, { params });
    return res.data;
  },
};

export default ReviewService;
