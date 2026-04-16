import { Router } from "express";

import { ROLE } from "@/constants";
import { IBookingController } from "@/core/interfaces/controllers/IBookingController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import {
  CancelBookingDTO,
  CompleteBookingDTO,
  CreatebookingDTO,
  ExtraChargeDTO,
  RejectBookingDTO,
  VerifyOtpDTO,
} from "@/dtos/requests/booking.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();
const controller = container.get<IBookingController>(TYPES.BookingController);

router.get("/", authenticate([ROLE.ADMIN]), controller.getBookings);

router.post(
  "/",
  authenticate([ROLE.USER, ROLE.WORKER]),
  validateDto(CreatebookingDTO),
  controller.createBooking
);
router.get("/user", authenticate([ROLE.USER, ROLE.WORKER]), controller.getUserBookings);
router.get("/worker", authenticate([ROLE.USER, ROLE.WORKER]), controller.getWorkerBookings);
router.get("/:bookingId", controller.getBookingById);

router.patch("/:bookingId/accept", authenticate([ROLE.WORKER]), controller.acceptBooking);
router.use(authenticate([ROLE.USER, ROLE.WORKER]));

router.patch("/:bookingId/cancel", validateDto(CancelBookingDTO), controller.cancelBooking);
router.patch("/:bookingId/approve", controller.approveBooking);
router.patch("/:bookingId/extra-charge/pay", controller.payExtraCharge);
router.patch("/:bookingId/extra-charge/reject", controller.rejectExtraCharge);

router.patch(
  "/:bookingId/reject",
  authenticate([ROLE.WORKER]),
  validateDto(RejectBookingDTO),
  controller.rejectBooking
);
router.patch("/:bookingId/en-route", authenticate([ROLE.WORKER]), controller.markEnRoute);
router.patch("/:bookingId/reached", controller.markReached);
router.patch(
  "/:bookingId/start",
  authenticate([ROLE.WORKER]),
  validateDto(VerifyOtpDTO),
  controller.startJob
);
router.patch(
  "/:bookingId/complete",
  authenticate([ROLE.WORKER]),
  validateDto(CompleteBookingDTO),
  controller.completeJob
);

router.patch(
  "/:bookingId/extra-charge",
  authenticate([ROLE.WORKER]),
  validateDto(ExtraChargeDTO),
  controller.requestExtraCharge
);

export default router;
