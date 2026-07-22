import { Router } from "express";

import { IAdminWorkerController } from "@/core/interfaces/controllers/admin/IAdminWorkerController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { WorkerReviewRequestDTO } from "@/dtos/requests/admin/worker-review.dto";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();

const controller = container.get<IAdminWorkerController>(TYPES.AdminWorkerController);

router.get("/", controller.listWorkers);
router.get("/:workerId/stats", controller.getWorkerStats);

router.patch("/:workerId/status", controller.toggleStatus);
router.patch("/:workerId/review", validateDto(WorkerReviewRequestDTO), controller.reviewWorker);

export default router;
