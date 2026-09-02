import { REVIEW_API } from '@/constants';
import type { CreateReviewFormType } from '@/features/review';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
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
  createReview: async (data: CreateReviewFormType): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<null>>(REVIEW_API.ROOT, data);
    return { message: res.data.message };
  },

  getReviewById: async (reviewId: string): Promise<Review> => {
    const res = await api.get<ApiResponse<Review>>(REVIEW_API.BY_ID(reviewId));
    return res.data.data;
  },

  updateReview: async (
    reviewId: string,
    data: Partial<CreateReviewFormType>
  ): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(REVIEW_API.BY_ID(reviewId), data);
    return { message: res.data.message };
  },

  addReplyToReview: async (reviewId: string, message: string): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(REVIEW_API.REPLY(reviewId), { message });
    return { message: res.data.message };
  },
  toggleReview: async (reviewId: string): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(REVIEW_API.TOGGLE(reviewId));
    return { message: res.data.message };
  },

  getWorkerReviewStats: async (workerId: string): Promise<WorkerReviewStats> => {
    const res = await api.get<ApiResponse<WorkerReviewStats>>(
      REVIEW_API.WORKER_REVIEWS_STATS(workerId)
    );
    return res.data.data;
  },
  getWorkerPublicReviews: async (
    workerId: string,
    query: ReviewListQuery
  ): Promise<PublicReviewListResponse> => {
    const res = await api.get<ApiResponse<PublicReviewListResponse>>(
      REVIEW_API.WORKER_REVIEWS(workerId),
      { params: query }
    );
    return res.data.data;
  },

  getWorkerOwnReviews: async (params: ReviewListQuery): Promise<WorkerReviewListResponse> => {
    const res = await api.get<ApiResponse<WorkerReviewListResponse>>(REVIEW_API.MY_WORKER_REVIEWS, {
      params,
    });
    return res.data.data;
  },

  listReviews: async (params: AdminReviewListQuery): Promise<AdminReviewListResponse> => {
    const res = await api.get<ApiResponse<AdminReviewListResponse>>(REVIEW_API.ROOT, { params });
    return res.data.data;
  },
};

export default ReviewService;
