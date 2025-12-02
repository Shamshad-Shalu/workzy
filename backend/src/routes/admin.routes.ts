import adminUserRoutes from "./admin/admin.users.routes";
import { ROLE } from "@/constants";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.use("/users", authenticate([ROLE.ADMIN]), adminUserRoutes);

export default router;
