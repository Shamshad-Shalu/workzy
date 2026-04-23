import { RequestHandler } from "express";

export interface IReviewController {
  getReviewById: RequestHandler;
  createReview: RequestHandler;
  updateReviewById: RequestHandler;
  addReplyToReview: RequestHandler;
  ToggleReviewVisibilityById: RequestHandler;
  listReviews: RequestHandler;

  getPublicWorkerReviews: RequestHandler;
  getWorkerReviewStats: RequestHandler;
  getMyWorkerReviews: RequestHandler;
  getMyReviews: RequestHandler;
}
