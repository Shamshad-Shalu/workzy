import adminUserRoutes from "./admin/admin.users.routes";
import adminWorkerRoutes from "./admin/admin.workers.routes";
import adminServiceRoutes from "./admin/admin.services.routes";
import { ROLE } from "@/constants";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.use(authenticate([ROLE.ADMIN]));

router.use("/users", adminUserRoutes);
router.use("/workers", adminWorkerRoutes);
router.use("/services", adminServiceRoutes);

export default router;
