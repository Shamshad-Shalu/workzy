import { CATEGORY, HTTPSTATUS } from "@/constants";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { ICategoryManagementService } from "@/core/interfaces/services/admin/ICategoryManagementService";
import { TYPES } from "@/di/types";
import { CategoryRequestDTO, CategoryUpdateRequestDTO } from "@/dtos/requests/category.dto";
import { CategoryResponseDTO } from "@/dtos/responses/admin/category.response.dto";
import CustomError from "@/utils/customError";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import { clearRedisListCache } from "@/utils/cache.util";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { ICategory } from "@/types/category";

@injectable()
export class CategoryManagementService implements ICategoryManagementService {
  constructor(
    @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}

  async createCategory(categoryData: CategoryRequestDTO): Promise<CategoryResponseDTO> {
    const isAlreadyExists = await this._categoryRepository.findOne({
      name: categoryData.name,
      parentId: categoryData.parentId || null,
    });

    if (isAlreadyExists) {
      throw new CustomError(CATEGORY.EXISTS, HTTPSTATUS.FORBIDDEN);
    }
    const { parentId, ...data } = categoryData;

    const parentObjectId =
      parentId && mongoose.Types.ObjectId.isValid(parentId)
        ? new mongoose.Types.ObjectId(parentId)
        : null;

    const newCategory = await this._categoryRepository.create({
      ...data,
      isAvailable: true,
      parentId: parentObjectId,
    });

    await clearRedisListCache("categories:list");

    return CategoryResponseDTO.fromEntity(newCategory);
  }

  async updateCategory(
    categoryId: string,
    updateData: CategoryUpdateRequestDTO
  ): Promise<CategoryResponseDTO> {
    const category = await getEntityOrThrow(
      this._categoryRepository,
      categoryId,
      CATEGORY.NOT_FOUND
    );

    const isAlreadyExists = await this._categoryRepository.findOne({
      name: updateData.name,
      parentId: updateData.parentId || null,
      _id: { $ne: categoryId },
    });

    if (isAlreadyExists) {
      throw new CustomError(CATEGORY.EXISTS, HTTPSTATUS.FORBIDDEN);
    }
    const updates: Partial<ICategory> = { ...(updateData as Partial<ICategory>) };

    const filePromises: Promise<void>[] = [];
    updates.parentId = updateData.parentId
      ? new mongoose.Types.ObjectId(updateData.parentId)
      : null;

    if (category.imageUrl !== updateData.imageUrl) {
      filePromises.push(this._s3Service.deleteFile(category.imageUrl));
    }
    if (category.iconUrl !== updateData.iconUrl) {
      filePromises.push(this._s3Service.deleteFile(category.iconUrl));
    }
    await Promise.all(filePromises);

    const updatedCategory = await this._categoryRepository.update(categoryId, updates);
    if (!updatedCategory) {
      throw new CustomError(CATEGORY.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    await clearRedisListCache("services:list");

    return CategoryResponseDTO.fromEntity(updatedCategory);
  }

  async toggleCategoryStatus(categoryId: string): Promise<{ message: string; newStatus: boolean }> {
    const category = await getEntityOrThrow(
      this._categoryRepository,
      categoryId,
      CATEGORY.NOT_FOUND
    );

    const newStatus = !category.isAvailable;

    await this._categoryRepository.update(category.id, { isAvailable: newStatus });

    const message = newStatus ? CATEGORY.UNBLOCKED : CATEGORY.BLOCKED;
    await clearRedisListCache("categories:list");

    return { newStatus, message };
  }
}
