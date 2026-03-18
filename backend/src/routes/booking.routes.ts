import { Router } from "express";

import { ROLE } from "@/constants";
import { IBookingController } from "@/core/interfaces/controllers/IBookingController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreatebookingDTO } from "@/dtos/requests/booking.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();
const controller = container.get<IBookingController>(TYPES.BookingController);

router.use(authenticate([ROLE.USER, ROLE.WORKER]));

router.post("/", validateDto(CreatebookingDTO), controller.createBooking);
// router.get("/", controller.getBookings);
// router.get("/:id", controller.getBookingById);
// router.patch("/:id/cancel", controller.cancelBooking);
// router.patch("/:id/start", controller.startBooking);
// router.patch("/:id/complete", controller.completeBooking);

export default router;
