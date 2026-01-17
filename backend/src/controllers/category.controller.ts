import { ICategoryController } from "@/core/interfaces/controllers/ICategoryController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TYPES } from "@/di/types";
import { HTTPSTATUS } from "@/constants";
import { ICategoryService } from "@/core/interfaces/services/ICategoryService";

@injectable()
export class CategoryController implements ICategoryController {
  constructor(@inject(TYPES.CategoryService) private _categoryService: ICategoryService) {}

  getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "all";
    const parentId = !req.query.parentId ? null : (req.query.parentId as string);

    const { categories, total } = await this._categoryService.getCategories(
      page,
      limit,
      search,
      status,
      parentId
    );

    res.status(HTTPSTATUS.OK).json({
      categories,
      total,
    });
  });

  getCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categoryId = req.params.categoryId;

    const category = await this._categoryService.getCategoryById(categoryId);
    res.status(HTTPSTATUS.OK).json({
      category,
    });
  });

  //   getCategorySuggestions = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  //   })
}
