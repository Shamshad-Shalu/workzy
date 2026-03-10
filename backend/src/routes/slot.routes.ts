import { Router } from "express";

import { ROLE } from "@/constants";
import { ISlotController } from "@/core/interfaces/controllers/ISlotController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateSlotDTO } from "@/dtos/requests/slot.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();
const controller = container.get<ISlotController>(TYPES.SlotController);

router.use(authenticate([ROLE.USER, ROLE.WORKER]));

router.get("/", controller.getAvailableSlots);
router.get("/dates", controller.getAvailableDates);
router.post("/reserve", validateDto(CreateSlotDTO), controller.reserveSlot);
router.delete("/:slotId", controller.releaseSlot);

export default router;
