import { Router } from "express";

import { IAdminUserController } from "@/core/interfaces/controllers/admin/IAdminUserController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const router = Router();

const controller = container.get<IAdminUserController>(TYPES.AdminUserController);

router.get("/", controller.listUsers);
router.patch("/:userId/toggle-status", controller.toggleStatus);

export default router;
