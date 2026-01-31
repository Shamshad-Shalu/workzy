import redisClient from "@/config/redisClient";
import { CATEGORY, HTTPSTATUS, REFRESH_TOKEN_TTL_SECONDS } from "@/constants";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { ICategoryService } from "@/core/interfaces/services/ICategoryService";
import { TYPES } from "@/di/types";
import { CategoryResponseDTO } from "@/dtos/responses/admin/category.response.dto";
import {
  CategoryAncestorResponseDTO,
  CategoryLiteDTO,
  CategorySuggestionResponseDTO,
  CategoryTrendingResponseDTO,
} from "@/dtos/responses/category.dto";
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

  async getCategoryAncestors(categoryId: string): Promise<CategoryAncestorResponseDTO[]> {
    const ancestors = await this._categoryRepository.findAncestors(categoryId);
    return CategoryAncestorResponseDTO.fromEntities(ancestors);
  }

  async getCategoriesByLevel(level: number, parentId: string | null): Promise<CategoryLiteDTO[]> {
    if (![1, 2, 3].includes(level)) {
      throw new CustomError(CATEGORY.INVALID_LEVEL, HTTPSTATUS.BAD_REQUEST);
    }

    if ((level === 1 && parentId !== null) || (level > 1 && !parentId)) {
      throw new CustomError(CATEGORY.MISS_MATCH);
    }
    if (parentId) {
      const parent = await getEntityOrThrow(this._categoryRepository, parentId);
      if (parent.level !== level - 1) {
        throw new CustomError(CATEGORY.INVALID_LEVEL);
      }
    }
    const categories = await this._categoryRepository.findCategoriesByLevel(level, parentId);
    return CategoryLiteDTO.fromEntities(categories);
  }

  async getCategorySuggestions(
    search: string,
    limit: number
  ): Promise<CategorySuggestionResponseDTO[]> {
    if (!search.trim()) return [];
    const categories = await this._categoryRepository.findSuggestions(search, limit);
    return CategorySuggestionResponseDTO.fromEntities(categories);
  }

  async getTrendingCategories(limit: number): Promise<CategoryTrendingResponseDTO[]> {
    const cacheKey = `categories:trending:${limit}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    // const categories = await this._categoryRepository.findTrending(limit);
    // dummy data
    const dummyNames = [
      "696a8451292e6a0a607ba18d",
      "69773bbaf6cf9efa2c8c4f8b",
      "696a84b8292e6a0a607ba19e",
      "69773b23f6cf9efa2c8c4f69",
      "696a8799292e6a0a607ba1ac",
    ];
    const categoriesRaw = await Promise.all(
      dummyNames.map((id) => this._categoryRepository.findOne({ _id: id }))
    );
    const categoriesFiltered = categoriesRaw.filter((c): c is NonNullable<typeof c> => Boolean(c));
    const response = CategoryTrendingResponseDTO.fromEntities(categoriesFiltered);

    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 60 * 10 }); // 10 minutes
    return response;
  }
}
