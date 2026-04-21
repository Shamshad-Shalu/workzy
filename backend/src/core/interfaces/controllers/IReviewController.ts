import { RequestHandler } from "express";

export interface IReviewController {
  getReviewById: RequestHandler;
  createReview: RequestHandler;
  updateReviewById: RequestHandler;
  addReplyToReview: RequestHandler;
  ToggleReviewVisibilityById: RequestHandler;
  listReviews: RequestHandler;

  getReviewsByWorkerId: RequestHandler;
  getMyWorkerReviews: RequestHandler;
  getMyReviews: RequestHandler;
}
