import { Router } from "express";

import { ROLE } from "@/constants";
import { IHomeController } from "@/core/interfaces/controllers/IHomeController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { SaveLayoutDTO } from "@/dtos/requests/admin/homeLayout.request.dto";
import {
  HomeSectionRequestDTO,
  HomeSectionUpdateRequestDTO,
} from "@/dtos/requests/admin/homeSection.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();
const controller = container.get<IHomeController>(TYPES.HomeController);

router.get("/", controller.getHome);
router.get("/nearby-workers", controller.getNearbyWorkers);

router.use(authenticate([ROLE.ADMIN]));

//section
router.get("/sections", controller.listSections);
router.post("/sections", validateDto(HomeSectionRequestDTO), controller.createSection);
router.patch(
  "/sections/:sectionId",
  validateDto(HomeSectionUpdateRequestDTO),
  controller.updateSection
);
router.delete("/sections/:sectionId", controller.deleteSection);
router.patch("/sections/:sectionId/toggle-status", controller.toggleSectionStatus);

// layout
router.get("/layout", controller.getLayout);
router.put("/layout", validateDto(SaveLayoutDTO), controller.saveLayout);
export default router;
