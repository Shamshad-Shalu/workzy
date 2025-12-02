import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { Router } from "express";

const router = Router();

const adminController = container.get<IAdminController>(TYPES.AdminController);

router.get("/", adminController.getUsers);

export default router;
