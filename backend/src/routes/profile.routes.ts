import { ROLE } from "@/constants";
import { IProfileController } from "@/core/interfaces/controllers/IProfileController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/upload/multer";
import { validateFileSize } from "@/middlewares/upload/validateFileSize";
import { Router } from "express";

const router = Router();

const profileController = container.get<IProfileController>(TYPES.ProfileController);

router.use(authenticate([ROLE.USER, ROLE.WORKER]));

router.post("/change-password", profileController.changePassword);

router.post(
  "/upload-profile",
  upload.single("image"),
  validateFileSize,
  profileController.uploadImage
);

export default router;
