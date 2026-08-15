import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { CATEGORY, HTTPSTATUS } from "@/constants";
import { IAdminCategoryController } from "@/core/interfaces/controllers/admin/IAdminCategoryController";
import { ICategoryManagementService } from "@/core/interfaces/services/admin/ICategoryManagementService";
import { TYPES } from "@/di/types";
import { CategoryRequestDTO } from "@/dtos/requests/category.dto";
import { ApiResponse } from "@/utils/apiResponse";

@injectable()
export class AdminCategoryController implements IAdminCategoryController {
  constructor(
    @inject(TYPES.CategoryManagementService) private _categoryManagement: ICategoryManagementService
  ) {}

  createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = req.body as CategoryRequestDTO;

    const category = await this._categoryManagement.createCategory(data);
    res.status(HTTPSTATUS.CREATED).json(new ApiResponse({ category }, CATEGORY.CREATED));
  });

  updateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categoryId = req.params.categoryId;
    const updateData = req.body;

    const category = await this._categoryManagement.updateCategory(categoryId, updateData);
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ category }, CATEGORY.UPDATED));
  });

  toggleCategoryStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categoryId = req.params.categoryId;
    const { newStatus, message } = await this._categoryManagement.toggleCategoryStatus(categoryId);

    res.status(HTTPSTATUS.OK).json(new ApiResponse({ isAvailable: newStatus }, message));
  });
}
