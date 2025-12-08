import { IAdminServiceController } from "@/core/interfaces/controllers/admin/IAdminServiceController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { Router } from "express";

const serviceRouter = Router();

const adminServiceController = container.get<IAdminServiceController>(TYPES.adminServiceController);

serviceRouter.post("/add", validateDto(ServiceRequestDTO), adminServiceController.createService);

export default serviceRouter;
