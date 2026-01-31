import { inject } from "inversify";
import { Types } from "mongoose";

import redisClient from "@/config/redisClient";
import { CATEGORY, HTTPSTATUS, REFRESH_TOKEN_TTL_SECONDS, SERVICE, WORKER } from "@/constants";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IServiceManagement } from "@/core/interfaces/services/IServiceManagement";
import { TYPES } from "@/di/types";
import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { ServiceResponseDTO } from "@/dtos/responses/service.dto";
import { CategoryOption, ICategory } from "@/types/category";
import { WorkerServicesAggregationResult } from "@/types/service-aggregation.types";
import { clearRedisListCache } from "@/utils/cache.util";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

export class ServiceManagement implements IServiceManagement {
  constructor(
    @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository,
    @inject(TYPES.ServiceRepository) private _serviceRepository: IServiceRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository
  ) {}

  async createService(workerId: string, data: ServiceRequestDTO): Promise<ServiceResponseDTO> {
    const isAlredyExists = await this._serviceRepository.findOne({
      workerId,
      categoryId: data.categoryId,
    });
    if (isAlredyExists) {
      throw new CustomError(SERVICE.ALREADY_EXISTS, HTTPSTATUS.CONFLICT);
    }
    const category = await getEntityOrThrow(
      this._categoryRepository,
      data.categoryId,
      CATEGORY.NOT_FOUND
    );
    await this.validateServiceRate(category, data.rate);
    const service = await this._serviceRepository.create({
      ...data,
      workerId: new Types.ObjectId(workerId),
      categoryId: category.id,
    });
    await clearRedisListCache(`worker:${workerId}:services`);
    return ServiceResponseDTO.fromEntity(service, category);
  }

  async updateService(
    workerId: string,
    serviceId: string,
    data: ServiceRequestDTO
  ): Promise<ServiceResponseDTO> {
    const service = await getEntityOrThrow(this._serviceRepository, serviceId, SERVICE.NOT_FOUND);

    if (!service.workerId.equals(workerId)) {
      throw new CustomError(WORKER.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
    const category = await getEntityOrThrow(
      this._categoryRepository,
      data.categoryId,
      CATEGORY.NOT_FOUND
    );
    await this.validateServiceRate(category, data.rate);

    const updatedService = await this._serviceRepository.findByIdAndUpdate(serviceId, data);

    if (!updatedService) {
      throw new CustomError(SERVICE.UPDATE_ERROR, HTTPSTATUS.NOT_FOUND);
    }
    await clearRedisListCache(`worker:${workerId}:services`);
    return ServiceResponseDTO.fromEntity(updatedService, category);
  }

  async updateServiceStatus(
    workerId: string,
    serviceId: string
  ): Promise<{ message: string; newStatus: boolean }> {
    const service = await getEntityOrThrow(this._serviceRepository, serviceId, SERVICE.NOT_FOUND);

    if (!service.workerId.equals(workerId)) {
      throw new CustomError(WORKER.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
    const newStatus = !service.isAvailable;

    await this._serviceRepository.update(service.id, { isAvailable: newStatus });
    const message = newStatus ? SERVICE.UNBLOCKED : SERVICE.BLOCKED;
    await clearRedisListCache(`worker:${workerId}:services`);
    return { newStatus, message };
  }

  private async validateServiceRate(category: ICategory, rate: number): Promise<void> {
    const { baseRate, rateDeviationPercent } = category;
    const deviation = (baseRate * rateDeviationPercent) / 100;
    const minPrice = baseRate - deviation;
    const maxPrice = baseRate + deviation;
    if (rate < minPrice || rate > maxPrice) {
      throw new CustomError(SERVICE.PRICE_OUT_OF_RANGE, HTTPSTATUS.BAD_REQUEST);
    }
  }

  async getWorkerServices(
    workerId: string,
    page: number,
    limit: number,
    search: string,
    status: string,
    categoryId: string | null
  ): Promise<WorkerServicesAggregationResult> {
    const cacheKey = `worker:${workerId}:services:${page}:${limit}:${search}:${status}:${categoryId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const result = await this._serviceRepository.getWorkerServicesAggregate(
      workerId,
      page,
      limit,
      search,
      status,
      categoryId
    );
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: REFRESH_TOKEN_TTL_SECONDS });

    return result;
  }

  async getWorkerServiceFilters(workerId: string): Promise<CategoryOption[]> {
    await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);
    return this._serviceRepository.getWorkerServiceParentCategories(workerId);
  }
}
