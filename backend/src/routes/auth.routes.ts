import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { LoginRequestDTO, RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { validateRefreshToken } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { Router } from "express";
import passport from "passport";

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

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  authController.handleGoogleUser
);

export default router;
