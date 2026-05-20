import { Router } from "express";

import { IAdminBookingController } from "@/core/interfaces/controllers/admin/IAdminBookingController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { AdminCancelDTO, AdminNoteDTO } from "@/dtos/requests/admin/booking.dto";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();

const controller = container.get<IAdminBookingController>(TYPES.AdminBookingController);

router.patch("/:bookingId/note", validateDto(AdminNoteDTO), controller.addNote);
router.patch("/:bookingId/cancel", validateDto(AdminCancelDTO), controller.cancelBooking);

export default router;
