import { IAdminServiceController } from "@/core/interfaces/controllers/admin/IAdminServiceController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ServiceRequestDTO, ServiceUpdateRequestDTO } from "@/dtos/requests/service.dto";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { Router } from "express";

const router = Router();

const adminServiceController = container.get<IAdminServiceController>(TYPES.adminServiceController);

router.get("/", adminServiceController.getServices);
router.patch("/toggle-status/:serviceId", adminServiceController.toggleStatus);

router.post("/add", validateDto(ServiceRequestDTO), adminServiceController.createService);

router.patch(
  "/edit/:serviceId",
  validateDto(ServiceUpdateRequestDTO, { skipMissingProperties: true }),
  adminServiceController.updateService
);

export default router;
