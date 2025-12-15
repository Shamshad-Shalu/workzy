import { ROLE } from "@/constants";
import { authenticate } from "@/middlewares/auth.middleware";
import { TYPES } from "@/di/types";
import { container } from "@/di/container";
import { Router } from "express";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";

const router = Router();

const workerController = container.get<IWorkerController>(TYPES.WorkerController);

router.use(authenticate([ROLE.WORKER]));

router.get("/:workerId/profile", workerController.getWorkerSummary);
router.get("/:workerId/profile/about", workerController.getWorkerProfile);

export default router;
