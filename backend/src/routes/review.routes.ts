import { Router } from "express";

import { ROLE } from "@/constants";
import { IReviewController } from "@/core/interfaces/controllers/IReviewController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateReviewDto, UpdateReviewDto, ReviewReplyDto } from "@/dtos/requests/review.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();

const controller = container.get<IReviewController>(TYPES.ReviewController);

router.get("/", controller.listReviews);
router.get("/worker/me", authenticate([ROLE.WORKER]), controller.getMyWorkerReviews);
router.get("/worker/:workerId", controller.getPublicWorkerReviews);
router.get("/worker/:workerId/stats", controller.getWorkerReviewStats);
router.get("/:reviewId", controller.getReviewById);
router.patch(
  "/:reviewId/toggle",
  authenticate([ROLE.ADMIN]),
  controller.ToggleReviewVisibilityById
);

router.use(authenticate([ROLE.WORKER, ROLE.USER]));

router.get("/user/me", controller.getUserReviews);
router.post("/", validateDto(CreateReviewDto), controller.createReview);
router.patch("/:reviewId", validateDto(UpdateReviewDto), controller.updateReviewById);
router.patch("/:reviewId/reply", validateDto(ReviewReplyDto), controller.addReplyToReview);

export default router;
