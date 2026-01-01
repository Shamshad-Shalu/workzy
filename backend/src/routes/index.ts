import { Router } from "express";
import authRoute from "./auth.routes";
import profileRoute from "./profile.routes";
import adminRoutes from "./admin.routes";
import workerRoutes from "./worker.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoute);
router.use("/profile", profileRoute);
router.use("/admin", adminRoutes);
router.use("/worker", workerRoutes);
router.use("/upload", uploadRoutes);

export default router;
