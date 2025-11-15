import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { LoginRequestDTO, RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { validateRefreshToken } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { Router } from "express";

const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);

router.post("/register", validateDto(RegisterRequestDTO), authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOtp);
router.post("/login", validateDto(LoginRequestDTO), authController.login);
router.get("/logout", authController.logout);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.post("/refresh-token", validateRefreshToken, authController.refreshToken);

export default router;
