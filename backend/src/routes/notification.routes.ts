import { Router } from "express";

import { ROLE } from "@/constants";
import type { INotificationController } from "@/core/interfaces/controllers/INotificationController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
const controller = container.get<INotificationController>(TYPES.NotificationController);

router.use(authenticate([ROLE.ADMIN, ROLE.USER, ROLE.WORKER]));

router.get("/", controller.getNotifications);
router.patch("/:id/read", controller.markAsRead);
router.patch("/read-all", controller.markAllAsRead);

export default router;
