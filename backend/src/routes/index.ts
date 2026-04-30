import { Router } from "express";

import adminRoutes from "./admin.routes";
import authRoute from "./auth.routes";
import bookingRoutes from "./booking.routes";
import categoryRoutes from "./category.routes";
import homeRoutes from "./home.routes";
import leaveRoutes from "./leave.routes";
import paymentRoutes from "./payment.routes";
import reviewRoutes from "./review.routes";
import serviceRoutes from "./service.routes";
import slotRoutes from "./slot.routes";
import uploadRoutes from "./upload.routes";
import userRoutes from "./user.routes";
import workerRoutes from "./worker.routes";

const router = Router();

router.use("/auth", authRoute);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/workers", workerRoutes);
router.use("/upload", uploadRoutes);
router.use("/categories", categoryRoutes);
router.use("/services", serviceRoutes);
router.use("/home", homeRoutes);
router.use("/payments", paymentRoutes);
router.use("/slots", slotRoutes);
router.use("/booking", bookingRoutes);
router.use("/leave", leaveRoutes);
router.use("/reviews", reviewRoutes);

export default router;
