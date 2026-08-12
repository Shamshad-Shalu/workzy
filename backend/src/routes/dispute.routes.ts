import { Router } from "express";

import { ROLE } from "@/constants";
import { IDisputeController } from "@/core/interfaces/controllers/IDisputeController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateDisputeDto, ResolveDisputeDto } from "@/dtos/requests/dispute.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();
const controller = container.get<IDisputeController>(TYPES.DisputeController);

router.patch(
  "/:disputeId/resolve",
  authenticate([ROLE.ADMIN]),
  validateDto(ResolveDisputeDto),
  controller.resolveDispute
);
router.use(authenticate([ROLE.USER, ROLE.WORKER, ROLE.ADMIN]));

router.get("/", controller.getAllDisputes);
router.get("/stats", controller.getDisputeStats);

router.get("/:bookingId", controller.getDisputeByBookingId);
router.post("/:bookingId", validateDto(CreateDisputeDto), controller.raiseDispute);
router.patch("/:disputeId", validateDto(CreateDisputeDto), controller.updateDispute);

export default router;
