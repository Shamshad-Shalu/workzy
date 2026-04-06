import { Router } from "express";

import { ROLE } from "@/constants";
import { authenticate } from "@/middlewares/auth.middleware";

import adminBookingRoutes from "./admin/admin.booking.routes";
import adminCategoryRoutes from "./admin/admin.categories.routes";
import adminUserRoutes from "./admin/admin.users.routes";
import adminWorkerRoutes from "./admin/admin.workers.routes";

const router = Router();

router.use(authenticate([ROLE.ADMIN]));

router.use("/users", adminUserRoutes);
router.use("/workers", adminWorkerRoutes);
router.use("/categories", adminCategoryRoutes);
router.use("/booking", adminBookingRoutes);

export default router;
