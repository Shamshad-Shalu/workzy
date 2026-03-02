import { Router } from "express";

import { ROLE } from "@/constants";
import { ISubscriptionController } from "@/core/interfaces/controllers/ISubscriptionController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

const controller = container.get<ISubscriptionController>(TYPES.SubscriptionController);

router.use(authenticate([ROLE.WORKER]));

router.get("/me", controller.getMySubscription);

export default router;
