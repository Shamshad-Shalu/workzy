import { BaseRepository } from "@/core/abstracts/base.repository";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { IReview } from "@/types/review/review.entity";
import { ReviewListItem } from "@/types/review/review.projection";
import { ReviewListQuery } from "@/types/review/review.query";

export interface IReviewRepository extends BaseRepository<IReview> {
  getAllReviews(filters: ReviewListQuery): Promise<CursorPaginatedResult<ReviewListItem>>;
}
