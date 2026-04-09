import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { HTTPSTATUS } from "@/constants";
import { ICategoryController } from "@/core/interfaces/controllers/ICategoryController";
import { ICategoryService } from "@/core/interfaces/services/ICategoryService";
import { TYPES } from "@/di/types";
import { ServiceSort } from "@/types/category";

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

  getCategoryAncestors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const ancestors = await this._categoryService.getCategoryAncestors(id);
    res.status(200).json({ ancestors });
  });

  getCategoryLevels = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const level = Number(req.query.level);
    const parentId = (req.query.parentId as string) || null;

    const categories = await this._categoryService.getCategoriesByLevel(level, parentId);
    res.status(200).json({ categories });
  });

  getCategorySuggestions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search = (req.query.search as string) || "";
    const limit = parseInt(req.query.limit as string) || 20;

    const results = await this._categoryService.getCategorySuggestions(search, limit);
    res.status(200).json({ results });
  });

  getTrendingCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string) || 10;
    const results = await this._categoryService.getTrendingCategories(limit);
    res.status(200).json({ results });
  });

  getServicesByCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const services = await this._categoryService.getServicesByCategory(categoryId, limit);
    res.status(200).json({ services });
  });
  getPublicCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categoryId = (req.query.categoryId as string) || undefined;
    const sortBy = (req.query.sortBy as ServiceSort) || "newest";
    const limit = parseInt(req.query.limit as string) || 12;
    const cursor = (req.query.cursor as string) || undefined;

    const { categories, nextCursor } = await this._categoryService.getPublicCategories({
      categoryId,
      sortBy,
      limit,
      cursor,
    });
    res.status(HTTPSTATUS.OK).json({ categories, nextCursor });
  });
}
