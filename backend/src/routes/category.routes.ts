import { Router } from "express";

import { ICategoryController } from "@/core/interfaces/controllers/ICategoryController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const router = Router();

const categoryController = container.get<ICategoryController>(TYPES.CategoryController);

router.get("/", categoryController.getCategories);
router.get("/levels", categoryController.getCategoryLevels);
router.get("/suggestions", categoryController.getCategorySuggestions);
router.get("/trending", categoryController.getTrendingCategories);
router.get("/:id/ancestors", categoryController.getCategoryAncestors);
// router.get("/:categoryId/services", categoryController.getServicesByCategory);
router.get("/:categoryId", categoryController.getCategory);

export default router;
