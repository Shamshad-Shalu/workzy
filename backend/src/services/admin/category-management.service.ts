import { inject, injectable } from "inversify";
import mongoose from "mongoose";

import { CATEGORY, HTTPSTATUS } from "@/constants";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { ICategoryManagementService } from "@/core/interfaces/services/admin/ICategoryManagementService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { CategoryRequestDTO, CategoryUpdateRequestDTO } from "@/dtos/requests/category.dto";
import { CategoryResponseDTO } from "@/dtos/responses/admin/category.response.dto";
import { clearRedisListCache } from "@/utils/cache.util";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

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
    const { parentId, ...rest } = categoryData;

    const data = this.sanitizeByLevel(rest);

    const parentObjectId = await this.validateAndResolveParent(
      parentId || null,
      categoryData.level
    );
    const newCategory = await this._categoryRepository.create({
      ...data,
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
      _id: { $ne: category.id },
    });

    if (isAlreadyExists) {
      throw new CustomError(CATEGORY.EXISTS, HTTPSTATUS.FORBIDDEN);
    }
    const { parentId, ...rest } = updateData;

    const filePromises: Promise<boolean>[] = [];
    if (category.imageUrl !== updateData.imageUrl) {
      filePromises.push(this._s3Service.deleteFile(category.imageUrl));
    }
    if (category.iconUrl !== updateData.iconUrl) {
      filePromises.push(this._s3Service.deleteFile(category.iconUrl));
    }
    await Promise.all(filePromises);

    const parentObjectId = await this.validateAndResolveParent(parentId || null, category.level);
    const data = this.sanitizeByLevel(rest);

    const updatedCategory = await this._categoryRepository.update(categoryId, {
      ...data,
      parentId: parentObjectId,
    });
    if (!updatedCategory) {
      throw new CustomError(CATEGORY.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    await clearRedisListCache("categories:list");

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

  private async validateAndResolveParent(
    parentId: string | null,
    level: number
  ): Promise<mongoose.Types.ObjectId | null> {
    if (!parentId) {
      return null;
    }

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      throw new CustomError(CATEGORY.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }

    const parentCategory = await this._categoryRepository.findById(parentId);
    if (!parentCategory) {
      throw new CustomError(CATEGORY.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }

    if (level !== parentCategory.level + 1) {
      throw new CustomError(CATEGORY.INVALID_LEVEL, HTTPSTATUS.BAD_REQUEST);
    }
    return new mongoose.Types.ObjectId(parentId);
  }

  private sanitizeByLevel(data: Partial<CategoryRequestDTO>): Partial<CategoryRequestDTO> {
    if (data.level === 3) return data;

    const {
      serviceType: _serviceType,
      pricingMode: _pricingMode,
      allowSuddenBooking: _allowSuddenBooking,
      allowBulkOffers: _allowBulkOffers,
      travelRatePerKM: _travelRatePerKM,
      bufferTime: _bufferTime,
      estimatedDuration: _estimatedDuration,
      rateDeviationPercent: _rateDeviationPercent,
      ...sanitized
    } = data;

    return sanitized;
  }
}
