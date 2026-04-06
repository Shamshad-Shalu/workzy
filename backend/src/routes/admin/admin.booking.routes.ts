import { Router } from "express";

import { IAdminBookingController } from "@/core/interfaces/controllers/admin/IAdminBookingController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const router = Router();

const bookingController = container.get<IAdminBookingController>(TYPES.AdminBookingController);

router.get("/", bookingController.getAllBookings);

export default router;
