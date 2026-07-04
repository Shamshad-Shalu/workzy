import { Router } from "express";

import { ROLE } from "@/constants";
import { IChatController } from "@/core/interfaces/controllers/IChatController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
const controller = container.get<IChatController>(TYPES.ChatController);

router.use(authenticate([ROLE.USER, ROLE.WORKER, ROLE.ADMIN]));

router.get("/rooms", controller.getChatRooms);
router.post("/room", controller.getOrCreateChat);
router.get("/room/:chatId", controller.getChatRoomById);

export default router;
