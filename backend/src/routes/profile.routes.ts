import { ROLE } from "@/constants";
import { IProfileController } from "@/core/interfaces/controllers/IProfileController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/multer";
import { Router } from "express";

const router = Router();

const profileController = container.get<IProfileController>(TYPES.ProfileController);

router.post(
  "/upload-profile",
  authenticate([ROLE.USER, ROLE.WORKER]),
  upload.single("image"),
  profileController.uploadImage
);

export default router;
