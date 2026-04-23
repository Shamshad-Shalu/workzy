import dayjs from "dayjs";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { AUTH, BOOKING, BOOKING_STATUS, HTTPSTATUS, REVIEW, WORKER } from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { IReviewRepository } from "@/core/interfaces/repositories/IReviewRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IReviewService } from "@/core/interfaces/services/IReviewService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { CreateReviewDTO, UpdateReviewDTO, ReviewReplyDTO } from "@/dtos/requests/review.dto";
import {
  ReviewAdminDTO,
  ReviewPublicDTO,
  ReviewResponseDTO,
  ReviewUserDTO,
  ReviewWorkerDTO,
} from "@/dtos/responses/review.dto";
import { ReviewListQuery, ReviewListQueryInput, WorkerReviewStats } from "@/types/review";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TYPES.ReviewRepository) private _reviewRepo: IReviewRepository,
    @inject(TYPES.BookingRepository) private _bookingRepo: IBookingRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}

  async createReview(userId: string, reviewData: CreateReviewDTO): Promise<ReviewResponseDTO> {
    const { bookingId, rating, reviewText, media } = reviewData;
    const booking = await getEntityOrThrow(this._bookingRepo, bookingId, BOOKING.NOT_FOUND);
    const { status, reviewId, workerId, serviceId, categoryId } = booking;
    if (userId !== booking.userId.toString()) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    if (status !== BOOKING_STATUS.COMPLETED && status !== BOOKING_STATUS.APPROVED) {
      throw new CustomError(REVIEW.INVALID_BOOKING_STATUS, HTTPSTATUS.BAD_REQUEST);
    }
    if (reviewId) {
      throw new CustomError(REVIEW.ALREADY_EXISTS, HTTPSTATUS.BAD_REQUEST);
    }
    const review = await this._reviewRepo.create({
      bookingId: new Types.ObjectId(booking._id),
      userId: booking.userId,
      workerId: workerId,
      serviceId: serviceId,
      categoryId: categoryId,
      rating,
      reviewText,
      media,
      createdAt: new Date(),
    });
    await Promise.all([
      this._bookingRepo.update(bookingId, {
        hasVisibleReview: true,
        reviewId: review._id,
      }),
      this._workerRepository.incrementRating(workerId.toString(), rating),
    ]);
    return ReviewResponseDTO.fromEntity(review);
  }

  async updateReview(reviewId: string, updateData: UpdateReviewDTO): Promise<ReviewResponseDTO> {
    const review = await getEntityOrThrow(this._reviewRepo, reviewId, REVIEW.NOT_FOUND);
    const oldUrls = review.media?.map((m) => m.url) ?? [];
    const newUrls = updateData.media?.map((m) => m.url) ?? [];

    const removedUrls = oldUrls.filter((url) => !newUrls.includes(url));
    const updated = await this._reviewRepo.update(reviewId, {
      ...updateData,
      isEdited: true,
    });
    const tasks: Promise<void>[] = [];
    if (updateData.rating && updateData.rating !== review.rating) {
      tasks.push(
        this._workerRepository.adjustRating(
          String(review.workerId),
          review.rating,
          updateData.rating
        )
      );
    }
    if (removedUrls.length > 0) {
      tasks.push(
        Promise.allSettled(removedUrls.map((url) => this._s3Service.deleteFile(url))).then(() => {})
      );
    }
    await Promise.all(tasks);
    if (!updated) {
      throw new CustomError(REVIEW.UPDATE_ERROR, HTTPSTATUS.BAD_REQUEST);
    }
    return ReviewResponseDTO.fromEntity(updated);
  }

  async getReviewById(reviewId: string): Promise<ReviewResponseDTO> {
    const review = await this._reviewRepo.findById(reviewId);
    if (!review) {
      throw new CustomError("review not found", HTTPSTATUS.BAD_REQUEST);
    }
    return ReviewResponseDTO.fromEntity(review);
  }

  async addReplyToReview(
    reviewId: string,
    data: ReviewReplyDTO,
    workerId: string
  ): Promise<ReviewResponseDTO> {
    const review = await this._reviewRepo.findOneAndUpdate(
      {
        _id: new Types.ObjectId(reviewId),
        workerId: new Types.ObjectId(workerId),
      },
      {
        reply: {
          message: data.message,
          repliedAt: new Date(),
        },
      }
    );
    if (!review) {
      throw new CustomError("Review not found or unauthorized");
    }
    return ReviewResponseDTO.fromEntity(review);
  }

  async toggleReviewVisibility(reviewId: string): Promise<string> {
    const review = await getEntityOrThrow(this._reviewRepo, reviewId, REVIEW.NOT_FOUND);
    const newStatus = !review.isHidden;

    await Promise.all([
      this._reviewRepo.update(reviewId, { isHidden: newStatus }),
      this._bookingRepo.update(review.bookingId.toString(), { hasVisibleReview: !newStatus }),
      newStatus
        ? this._workerRepository.decrementRating(review.workerId.toString(), review.rating)
        : this._workerRepository.incrementRating(review.workerId.toString(), review.rating),
    ]);
    return newStatus ? REVIEW.HIDDEN : REVIEW.UNHIDDEN;
  }

  async listReviews(
    input: ReviewListQueryInput
  ): Promise<{ reviews: ReviewAdminDTO[]; nextCursor: string | null }> {
    const query = this.mapToReviewListQuery(input);
    const { reviews, nextCursor } = await this._reviewRepo.getAllReviews(query);
    return {
      reviews: await ReviewAdminDTO.fromEntities(reviews, this._s3Service),
      nextCursor,
    };
  }

  async getPublicWorkerReviews(
    workerId: string,
    input: ReviewListQueryInput
  ): Promise<{ reviews: ReviewPublicDTO[]; nextCursor: string | null }> {
    const query = this.mapToReviewListQuery(input);
    const { reviews, nextCursor } = await this._reviewRepo.getAllReviews({
      isHidden: false,
      workerId,
      ...query,
    });
    return {
      reviews: await ReviewPublicDTO.fromEntities(reviews, this._s3Service),
      nextCursor,
    };
  }
  async getUserReviews(
    userId: string,
    input: ReviewListQueryInput
  ): Promise<{ reviews: ReviewUserDTO[]; nextCursor: string | null }> {
    const query = this.mapToReviewListQuery(input);
    const { reviews, nextCursor } = await this._reviewRepo.getAllReviews({
      isHidden: false,
      userId,
      ...query,
    });
    return {
      reviews: await ReviewUserDTO.fromEntities(reviews, this._s3Service),
      nextCursor,
    };
  }

  async getMyWorkerReviews(
    workerId: string,
    input: ReviewListQueryInput
  ): Promise<{ reviews: ReviewWorkerDTO[]; nextCursor: string | null }> {
    const query = this.mapToReviewListQuery(input);
    const { reviews, nextCursor } = await this._reviewRepo.getAllReviews({
      isHidden: false,
      workerId,
      ...query,
    });
    return {
      reviews: await ReviewWorkerDTO.fromEntities(reviews, this._s3Service),
      nextCursor,
    };
  }

  async getWorkerReviewStats(workerId: string): Promise<WorkerReviewStats> {
    const reviewStats = await this._workerRepository.getWorkerReviewStats(workerId);
    if (!reviewStats) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    return reviewStats;
  }

  private mapToReviewListQuery(input: ReviewListQueryInput): ReviewListQuery {
    const { fromDate, toDate, ...rest } = input;
    return {
      ...rest,
      fromDate: fromDate ? dayjs(fromDate).startOf("day").toDate() : undefined,
      toDate: toDate ? dayjs(toDate).endOf("day").toDate() : undefined,
    };
  }
}
