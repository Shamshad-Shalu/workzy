import { Router } from "express";

import { ROLE } from "@/constants";
import { IServiceController } from "@/core/interfaces/controllers/IServiceController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();
const serviceController = container.get<IServiceController>(TYPES.ServiceController);

router.get("/worker/:workerId", serviceController.listWorkerPublicServices);

router.use(authenticate([ROLE.WORKER]));

router.get("/worker", serviceController.getWorkerServices);
router.get("/service-categories", serviceController.getWorkerServiceCategories);
router.post("/", validateDto(ServiceRequestDTO), serviceController.createService);
router.patch("/:serviceId", validateDto(ServiceRequestDTO), serviceController.updateService);
router.patch("/:serviceId/status", serviceController.toggleStatus);

export default router;
