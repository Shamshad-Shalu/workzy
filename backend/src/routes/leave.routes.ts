import { Router } from "express";

import { ROLE } from "@/constants";
import { ILeaveController } from "@/core/interfaces/controllers/ILeaveController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateLeaveDTO } from "@/dtos/requests/leave.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();

const controller = container.get<ILeaveController>(TYPES.LeaveController);

router.use(authenticate([ROLE.WORKER]));

router.post("/", validateDto(CreateLeaveDTO), controller.createLeave);
router.delete("/:leaveId", controller.cancelLeave);
router.get("/", controller.getWorkerLeaves);
router.get("/stats", controller.getWorkerLeaveStats);

export default router;
