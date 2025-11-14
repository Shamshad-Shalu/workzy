import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { validateDto } from "@/middlewares/validate-dto.middleware";
import { Router } from "express";

const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);

router.post("/register", validateDto(RegisterRequestDTO), authController.register);

export default router;
