import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { VerifyWorkerRequestDTO } from "@/dtos/requests/admin/worker.verify.dto";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { Router } from "express";

const router = Router();

const adminController = container.get<IAdminController>(TYPES.AdminController);

router.get("/all", adminController.getAllWorkers);
router.patch("/verify/:workerId",validateDto(VerifyWorkerRequestDTO), adminController.verifyWorker);

export default router;
