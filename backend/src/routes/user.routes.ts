import { Router } from "express";

import { ROLE } from "@/constants";
import { IUserController } from "@/core/interfaces/controllers/IUserController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ChangePasswordDto, UserProfileRequestDto } from "@/dtos/requests/profile.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();

const controller = container.get<IUserController>(TYPES.UserController);

router.use(authenticate([ROLE.USER, ROLE.WORKER]));

//profile
router.post("/profile-image", controller.uploadImage);
router.patch("/profile", validateDto(UserProfileRequestDto), controller.updateProfile);
router.post("/change-password", validateDto(ChangePasswordDto), controller.changePassword);
router.post("/change-email", controller.changeEmail);
router.post("/change-phone", controller.changePhone);
router.post("/resend-otp", controller.resentOtp);
router.post("/verify-otp", controller.confirmOtpAndUpdateContact);

export default router;
