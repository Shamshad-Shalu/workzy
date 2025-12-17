import { ROLE } from "@/constants";
import { authenticate } from "@/middlewares/auth.middleware";
import { TYPES } from "@/di/types";
import { container } from "@/di/container";
import { Router } from "express";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { upload } from "@/middlewares/upload/multer";
import { validateFileSize } from "@/middlewares/upload/validateFileSize";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { parseMultipart } from "@/middlewares/parseMultipart.middleware";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";

const router = Router();

const workerController = container.get<IWorkerController>(TYPES.WorkerController);

router.post("/joinUs/:userId",
  upload.single("document"),
  validateFileSize,
  parseMultipart({ forceJson: ["defaultRate"] }),
  workerController.createWorkerProfile
)
router.use(authenticate([ROLE.WORKER]));

router.get("/:workerId/profile", workerController.getWorkerSummary);
router.get("/:workerId/profile/about", workerController.getWorkerProfile);
router.patch(
  "/:workerId/profile",
  upload.single("coverImage"),
  validateFileSize,
  parseMultipart({ forceJson: ["defaultRate", "skills", "cities", "availability"] }),
  validateDto(WorkerProfileRequestDTO, { skipMissingProperties: true }),
  workerController.updateWorkerProfile
);

export default router;
