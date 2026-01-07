import { ROLE } from "@/constants";
import { authenticate } from "@/middlewares/auth.middleware";
import { TYPES } from "@/di/types";
import { container } from "@/di/container";
import { Router } from "express";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { JoinUsDTO } from "@/dtos/requests/joinUs.dto";

const router = Router();

const workerController = container.get<IWorkerController>(TYPES.WorkerController);

router.post("/joinUs/:userId", validateDto(JoinUsDTO), workerController.createWorkerProfile);
router.get("/me", authenticate([ROLE.WORKER, ROLE.USER]), workerController.getMe);

router.patch(
  "/:workerId/reApply",
  authenticate([ROLE.WORKER, ROLE.USER]),
  workerController.reSubmitWorkerDocument
);
router.use(authenticate([ROLE.WORKER]));

router.get("/:workerId/profile", workerController.getWorkerSummary);
router.get("/:workerId/profile/about", workerController.getWorkerProfile);
router.patch(
  "/:workerId/profile",
  validateDto(WorkerProfileRequestDTO, { skipMissingProperties: true }),
  workerController.updateWorkerProfile
);

export default router;
