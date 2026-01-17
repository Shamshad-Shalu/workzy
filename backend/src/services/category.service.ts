import redisClient from "@/config/redisClient";
import { CATEGORY, HTTPSTATUS, REFRESH_TOKEN_TTL_SECONDS } from "@/constants";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { ICategoryService } from "@/core/interfaces/services/ICategoryService";
import { TYPES } from "@/di/types";
import { CategoryResponseDTO } from "@/dtos/responses/admin/category.response.dto";
import { ICategory } from "@/types/category";
import { buildCategoryFilter } from "@/utils/admin/buildCategoryFilter";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class CategoryService implements ICategoryService {
  constructor(@inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository) {}

  async getCategories(
    page: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<{ categories: CategoryResponseDTO[]; total: number }> {
    const cacheKey = `categories:list:${parentId || "root"}:${status}:${page}:${limit}:${search || "all"}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      throw new CustomError("Invalid ParentId", HTTPSTATUS.BAD_REQUEST);
    }

    const skip = (page - 1) * limit;
    const query = buildCategoryFilter(search, status, parentId);

    const [categoriesRow, total] = await Promise.all([
      this._categoryRepository.getAllCategories(skip, limit, search, status, parentId),
      this._categoryRepository.countDocuments(query),
    ]);

    const categories = CategoryResponseDTO.fromEntities(categoriesRow as ICategory[]);
    const response = { categories, total };
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: REFRESH_TOKEN_TTL_SECONDS });

    return response;
  }

  async getCategoryById(categoryId: string): Promise<CategoryResponseDTO> {
    const category = await getEntityOrThrow(
      this._categoryRepository,
      categoryId,
      CATEGORY.NOT_FOUND
    );
    return CategoryResponseDTO.fromEntity(category);
  }
}
