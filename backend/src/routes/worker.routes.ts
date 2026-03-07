import { Router } from "express";

import { ROLE } from "@/constants";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { JoinUsDTO } from "@/dtos/requests/joinUs.dto";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();

const workerController = container.get<IWorkerController>(TYPES.WorkerController);

router.post("/joinUs/:userId", validateDto(JoinUsDTO), workerController.createWorkerProfile);
router.get("/me", authenticate([ROLE.WORKER, ROLE.USER]), workerController.getMe);

router.patch(
  "/:workerId/reApply",
  authenticate([ROLE.WORKER, ROLE.USER]),
  workerController.reSubmitWorkerDocument
);
router.get("/:serviceId", workerController.listWorkers);

router.use(authenticate([ROLE.WORKER]));

router.get("/:workerId/profile", workerController.getWorkerSummary);
router.get("/:workerId/profile/about", workerController.getWorkerProfile);
router.patch(
  "/:workerId/profile",
  validateDto(WorkerProfileRequestDTO),
  workerController.updateWorkerProfile
);

export default router;
