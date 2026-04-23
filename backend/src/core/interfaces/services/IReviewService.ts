import { CreateReviewDTO, UpdateReviewDTO, ReviewReplyDTO } from "@/dtos/requests/review.dto";
import { ReviewResponseDTO, ReviewUserDTO } from "@/dtos/responses/review.dto";
import { ReviewListQueryInput, WorkerReviewStats } from "@/types/review";

import {
  ReviewAdminDTO,
  ReviewPublicDTO,
  ReviewWorkerDTO,
} from "../../../dtos/responses/review.dto";

export interface IReviewService {
  createReview(userId: string, reviewData: CreateReviewDTO): Promise<ReviewResponseDTO>;
  updateReview(reviewId: string, updateData: UpdateReviewDTO): Promise<ReviewResponseDTO>;
  getReviewById(reviewId: string): Promise<ReviewResponseDTO>;
  addReplyToReview(
    reviewId: string,
    data: ReviewReplyDTO,
    workerId: string
  ): Promise<ReviewResponseDTO>;
  toggleReviewVisibility(reviewId: string): Promise<string>;
  listReviews(
    input: ReviewListQueryInput
  ): Promise<{ reviews: ReviewAdminDTO[]; nextCursor: string | null }>;
  getPublicWorkerReviews(
    workerId: string,
    input: ReviewListQueryInput
  ): Promise<{ reviews: ReviewPublicDTO[]; nextCursor: string | null }>;

  getMyWorkerReviews(
    workerId: string,
    input: ReviewListQueryInput
  ): Promise<{ reviews: ReviewWorkerDTO[]; nextCursor: string | null }>;

  getUserReviews(
    userId: string,
    input: ReviewListQueryInput
  ): Promise<{ reviews: ReviewUserDTO[]; nextCursor: string | null }>;

  getWorkerReviewStats(workerId: string): Promise<WorkerReviewStats>;
}
