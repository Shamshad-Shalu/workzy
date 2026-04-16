import { Router } from "express";

import adminRoutes from "./admin.routes";
import authRoute from "./auth.routes";
import bookingRoutes from "./booking.routes";
import categoryRoutes from "./category.routes";
import homeRoutes from "./home.routes";
import leaveRoutes from "./leave.routes";
import paymentRoutes from "./payment.routes";
import planRoutes from "./plan.routes";
import profileRoute from "./profile.routes";
import serviceRoutes from "./service.routes";
import slotRoutes from "./slot.routes";
import subscriptionRoutes from "./subscription.routes";
import uploadRoutes from "./upload.routes";
import workerRoutes from "./worker.routes";

const router = Router();

router.use("/auth", authRoute);
router.use("/profile", profileRoute);
router.use("/admin", adminRoutes);
router.use("/worker", workerRoutes);
router.use("/upload", uploadRoutes);
router.use("/categories", categoryRoutes);
router.use("/services", serviceRoutes);
router.use("/home", homeRoutes);
router.use("/plans", planRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/payments", paymentRoutes);
router.use("/slots", slotRoutes);
router.use("/booking", bookingRoutes);
router.use("/leave", leaveRoutes);

export default router;
