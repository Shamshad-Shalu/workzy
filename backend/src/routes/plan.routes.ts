import { Router } from "express";

import { ROLE } from "@/constants";
import { IPlanController } from "@/core/interfaces/controllers/IPlanController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { PlanRequestDTO } from "@/dtos/requests/plan.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();

const controller = container.get<IPlanController>(TYPES.PlanController);

// router.use(authenticate([ROLE.ADMIN]));

router.get("/", controller.getAllPlans);
router.get("/:planId", controller.getPlan);
router.post("/", validateDto(PlanRequestDTO), controller.createPlan);
router.patch("/:planId", validateDto(PlanRequestDTO), controller.updatePlan);

export default router;
