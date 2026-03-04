import { Router } from "express";

import { IPaymentController } from "@/core/interfaces/controllers/IPaymentController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const router = Router();

const controller = container.get<IPaymentController>(TYPES.PaymentController);

router.post("/", controller.handleWebhook);

export default router;
