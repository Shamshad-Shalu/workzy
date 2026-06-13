import { Router } from "express";

import { ROLE } from "@/constants";
import { IMessageController } from "@/core/interfaces/controllers/IMessageController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
const controller = container.get<IMessageController>(TYPES.MessageController);

router.use(authenticate([ROLE.USER, ROLE.WORKER, ROLE.ADMIN]));

router.get("/:chatId", controller.getMessages);
router.get("/:chatId/:messageId/context", controller.getMessageContext);
export default router;
