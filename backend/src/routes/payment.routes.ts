import { Router } from "express";

import { ROLE } from "@/constants";
import { IPaymentController } from "@/core/interfaces/controllers/IPaymentController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

const controller = container.get<IPaymentController>(TYPES.PaymentController);

router.get("/", authenticate([ROLE.ADMIN]), controller.getPayments);

router.use(authenticate([ROLE.WORKER, ROLE.USER, ROLE.ADMIN]));

router.get("/user", controller.getUserPayments);
router.get("/worker", controller.getWorkerPayments);
router.get("/verify/:sessionId", controller.verifySession);

export default router;
