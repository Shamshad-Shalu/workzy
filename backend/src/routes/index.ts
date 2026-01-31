import { Router } from "express";

import adminRoutes from "./admin.routes";
import authRoute from "./auth.routes";
import categoryRoutes from "./category.routes";
import profileRoute from "./profile.routes";
import serviceRoutes from "./service.routes";
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

export default router;
