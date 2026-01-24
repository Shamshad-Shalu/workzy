import { ICategoryController } from "@/core/interfaces/controllers/ICategoryController";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { Router } from "express";

const router = Router();

const categoryController = container.get<ICategoryController>(TYPES.CategoryController);

router.get("/", categoryController.getCategories);
router.get("/:id/ancestors", categoryController.getCategoryAncestors);
router.get("/:categoryId", categoryController.getCategory);

export default router;
