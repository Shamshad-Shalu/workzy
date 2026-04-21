import { BaseRepository } from "@/core/abstracts/base.repository";
import { IReview, IReviewPopulated, ReviewListQuery } from "@/types/review";

export interface IReviewRepository extends BaseRepository<IReview> {
  getAllReviews(
    filters: ReviewListQuery
  ): Promise<{ reviews: IReviewPopulated[]; nextCursor: string | null }>;
}
