import { IAdminServiceController } from "@/core/interfaces/controllers/admin/IAdminServiceController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { upload } from "@/middlewares/upload/multer";
import { validateFileSize } from "@/middlewares/upload/validateFileSize";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { Router } from "express";

const serviceRouter = Router();

const adminServiceController = container.get<IAdminServiceController>(TYPES.adminServiceController);

serviceRouter.get("/", adminServiceController.getServices);
serviceRouter.post(
  "/add",
  upload.fields([
    { name: "iconUrl", maxCount: 1 },
    { name: "imgUrl", maxCount: 1 },
  ]),
  validateFileSize,
  validateDto(ServiceRequestDTO),
  adminServiceController.createService
);

export default serviceRouter;
