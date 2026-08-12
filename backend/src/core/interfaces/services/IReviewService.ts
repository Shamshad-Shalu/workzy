import { CreateReviewDto, UpdateReviewDto, ReviewReplyDto } from "@/dtos/requests/review.dto";
import {
  ReviewResponseDto,
  ReviewUserDto,
  WorkerReviewStatsDto,
  ReviewAdminDto,
  ReviewWorkerDto,
} from "@/dtos/responses/review.dto";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { ReviewListQueryInput, ReviewListQuery } from "@/types/review/review.query";

export interface IReviewService {
  createReview(userId: string, reviewData: CreateReviewDto): Promise<ReviewResponseDto>;
  updateReview(reviewId: string, updateData: UpdateReviewDto): Promise<ReviewResponseDto>;
  getReviewById(reviewId: string): Promise<ReviewResponseDto>;
  addReplyToReview(
    reviewId: string,
    data: ReviewReplyDto,
    workerId: string
  ): Promise<ReviewResponseDto>;
  toggleReviewVisibility(reviewId: string): Promise<string>;
  listReviews(input: ReviewListQuery): Promise<CursorPaginatedResult<ReviewAdminDto>>;
  getWorkerReviews(
    workerId: string,
    input: ReviewListQueryInput
  ): Promise<CursorPaginatedResult<ReviewWorkerDto>>;
  getUserReviews(
    userId: string,
    input: ReviewListQueryInput
  ): Promise<CursorPaginatedResult<ReviewUserDto>>;
  getWorkerReviewStats(workerId: string): Promise<WorkerReviewStatsDto>;
}
