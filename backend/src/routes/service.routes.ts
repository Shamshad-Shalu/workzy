import { IServiceController } from "@/core/interfaces/controllers/IServiceController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { Router } from "express";

const router = Router();

const serviceController = container.get<IServiceController>(TYPES.ServiceController);

router.post("/", serviceController.createService);

export default router;
