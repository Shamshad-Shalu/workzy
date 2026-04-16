import { Router } from "express";

import { ROLE } from "@/constants";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { JoinUsDTO } from "@/dtos/requests/joinUs.dto";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { authenticate, optionalAuth } from "@/middlewares/auth.middleware";
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
router.get("/service/:serviceId", optionalAuth, workerController.listWorkers);
router.get("/:workerId", workerController.getWorkerSummary);

router.use(authenticate([ROLE.WORKER]));

router.get("/:workerId/profile/about", workerController.getWorkerProfile);
router.patch(
  "/:workerId/profile",
  validateDto(WorkerProfileRequestDTO),
  workerController.updateWorkerProfile
);
router.get("/stripe/connect", workerController.connectStripe);
router.get("/stripe/status", workerController.getStripeStatus);

export default router;
