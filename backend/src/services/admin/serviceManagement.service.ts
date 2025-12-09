import redisClient from "@/config/redisClient";
import { HTTPSTATUS, REDIS_EXPIRY } from "@/constants";
import { SERVICE } from "@/constants/messages/service";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { IServiceManagementService } from "@/core/interfaces/services/admin/IServiceManagementService";
import { TYPES } from "@/di/types";
import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { ServiceResponseDTO } from "@/dtos/responses/admin/service.response.dto";
import { IService } from "@/types/service";
import { buildServiceFilter } from "@/utils/admin/buildServiceFilter";
import CustomError from "@/utils/customError";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import { uploadFileToS3 } from "../s3.service";
import { clearRedisListCache } from "@/utils/cache.util";

@injectable()
export class ServiceManagementService implements IServiceManagementService {
  constructor(@inject(TYPES.ServiceRepository) private _serviceRepository: IServiceRepository) {}

  async createService(
    serviceData: ServiceRequestDTO,
    files: { iconFile: Express.Multer.File; imgFile: Express.Multer.File }
  ): Promise<ServiceResponseDTO> {
    const isAlreadyExists = await this._serviceRepository.findOne({
      name: serviceData.name,
      parentId: serviceData.parentId || null,
    });

    if (isAlreadyExists) {
      throw new CustomError(SERVICE.EXISTS, HTTPSTATUS.FORBIDDEN);
    }

    const [imgUrl, iconUrl] = await Promise.all([
      uploadFileToS3(files.imgFile, "public/services/images"),
      uploadFileToS3(files.iconFile, "public/services/icons"),
    ]);

    const { name, platformFee, description, isAvailable, parentId } = serviceData;

    const parentObjectId = parentId ? new mongoose.Types.ObjectId(parentId) : null;

    const newService = await this._serviceRepository.create({
      name,
      platformFee,
      description,
      isAvailable,
      parentId: parentObjectId,
      imageUrl: imgUrl,
      iconUrl: iconUrl,
    });

    await clearRedisListCache("services:list");

    return ServiceResponseDTO.fromEntity(newService);
  }

  async getAllServices(
    page: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<{ services: ServiceResponseDTO[]; total: number }> {
    const cacheKey = `services:list:${parentId || "root"}:${status}:${page}:${limit}:${search || "all"}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const skip = (page - 1) * limit;
    const query = buildServiceFilter(search, status, parentId);

    const [ServiceRaw, total] = await Promise.all([
      this._serviceRepository.getAllServices(skip, limit, search, status, parentId),
      this._serviceRepository.countDocuments(query),
    ]);

    const serviceDto = ServiceResponseDTO.fromEntities(ServiceRaw as IService[]);
    const response = { services: serviceDto, total };
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: REDIS_EXPIRY });

    return response;
  }
}
