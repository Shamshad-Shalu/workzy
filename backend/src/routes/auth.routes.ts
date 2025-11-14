import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { Router } from "express";

const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);

router.post("/register", authController.register);

export default router;
