import { ROLE } from "@/constants";
import { IUploadController } from "@/core/interfaces/controllers/IUploadController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { RequestUploadUrlDTO } from "@/dtos/requests/upload.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { Router } from "express";

const router = Router();
const uploadController = container.get<IUploadController>(TYPES.UploadController);

router.post(
  "/request-url",
  authenticate([ROLE.USER, ROLE.WORKER, ROLE.ADMIN]),
  validateDto(RequestUploadUrlDTO),
  uploadController.requestUploadUrl
);

export default router;
