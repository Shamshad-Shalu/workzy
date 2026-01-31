import { Router } from "express";

import { IAdminCategoryController } from "@/core/interfaces/controllers/admin/IAdminCategoryController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CategoryRequestDTO, CategoryUpdateRequestDTO } from "@/dtos/requests/category.dto";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();

const adminCategoryController = container.get<IAdminCategoryController>(
  TYPES.AdminCategoryController
);

router.patch("/toggle-status/:categoryId", adminCategoryController.toggleCategoryStatus);

router.post("/add", validateDto(CategoryRequestDTO), adminCategoryController.createCategory);

router.patch(
  "/edit/:categoryId",
  validateDto(CategoryUpdateRequestDTO, { skipMissingProperties: true }),
  adminCategoryController.updateCategory
);

export default router;
