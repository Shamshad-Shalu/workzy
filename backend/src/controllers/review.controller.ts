import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS, REVIEW } from "@/constants";
import { IReviewController } from "@/core/interfaces/controllers/IReviewController";
import { IReviewService } from "@/core/interfaces/services/IReviewService";
import { TYPES } from "@/di/types";
import { CreateReviewDTO, UpdateReviewDTO, ReviewReplyDTO } from "@/dtos/requests/review.dto";
import { ReviewListQueryInput } from "@/types/review";
import CustomError from "@/utils/customError";

@injectable()
export class ReviewController implements IReviewController {
  constructor(@inject(TYPES.ReviewService) private _reviewService: IReviewService) {}

  getReviewById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { reviewId } = req.params;
    const review = await this._reviewService.getReviewById(reviewId);
    res.status(HTTPSTATUS.CREATED).json({ review });
  });

  createReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const data = req.body as CreateReviewDTO;
    const review = await this._reviewService.createReview(userId, data);
    res.status(HTTPSTATUS.CREATED).json({ message: REVIEW.CREATED, review });
  });

  updateReviewById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { reviewId } = req.params;
    const data = req.body as UpdateReviewDTO;
    const review = await this._reviewService.updateReview(reviewId, data);
    res.status(HTTPSTATUS.OK).json({ message: REVIEW.UPDATED, review });
  });

  addReplyToReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { reviewId } = req.params;
    const data = req.body as ReviewReplyDTO;
    await this._reviewService.addReplyToReview(reviewId, data, workerId);
    res.status(HTTPSTATUS.OK).json({ message: REVIEW.REPLY_ADDED });
  });

  ToggleReviewVisibilityById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { reviewId } = req.params;
    const message = await this._reviewService.toggleReviewVisibility(reviewId);
    res.status(HTTPSTATUS.OK).json({ message });
  });

  listReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = this.parseQuery(req);
    const userId = req.query.userId as string | undefined;
    const workerId = req.query.workerId as string | undefined;

    const result = await this._reviewService.listReviews({
      ...query,
      userId,
      workerId,
    });
    res.status(HTTPSTATUS.OK).json({ reviews: result.reviews, nextCursor: result.nextCursor });
  });

  getPublicWorkerReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const query = this.parseQuery(req);
    const { reviews, nextCursor } = await this._reviewService.getPublicWorkerReviews(
      workerId,
      query
    );
    res.status(HTTPSTATUS.OK).json({ reviews: reviews, nextCursor: nextCursor });
  });
  getWorkerReviewStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const result = await this._reviewService.getWorkerReviewStats(workerId);
    res.status(HTTPSTATUS.OK).json(result);
  });

  getMyWorkerReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const query = this.parseQuery(req);

    const result = await this._reviewService.getMyWorkerReviews(workerId, query);
    res.status(HTTPSTATUS.OK).json({ reviews: result.reviews, nextCursor: result.nextCursor });
  });

  getMyReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const query = this.parseQuery(req);
    const result = await this._reviewService.getUserReviews(userId, query);
    res.status(HTTPSTATUS.OK).json({ reviews: result.reviews, nextCursor: result.nextCursor });
  });

  private parseQuery(req: Request): ReviewListQueryInput {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;
    return {
      limit,
      search: (req.query.search as string) ?? "",
      serviceId: (req.query.serviceId as string) ?? undefined,
      categoryId: (req.query.categoryId as string) ?? undefined,
      rating: req.query.rating ? Number(req.query.rating) : undefined,
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      maxRating: req.query.maxRating ? Number(req.query.maxRating) : undefined,
      cursor: parsedCursor
        ? {
            createdAt: new Date(parsedCursor.createdAt),
            rating: parsedCursor.rating ?? undefined,
            _id: parsedCursor._id,
          }
        : undefined,
      fromDate: req.query.fromDate as string | undefined,
      toDate: req.query.toDate as string | undefined,
      sortBy: req.query.sortBy as "createdAt" | "rating" | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
    };
  }
  private requireUserId(req: Request): string {
    if (!req.user?.id) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
    return req.user.id;
  }
  private requireWorkerId(req: Request): string {
    if (!req.user?.workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
    return req.user.workerId;
  }
}
