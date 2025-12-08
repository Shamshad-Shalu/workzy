import { HTTPSTATUS } from "@/constants";
import { SERVICE } from "@/constants/messages/service";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { IServiceManagementService } from "@/core/interfaces/services/admin/IServiceManagementService";
import { TYPES } from "@/di/types";
import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { ServiceResponseDTO } from "@/dtos/responses/admin/service.response.dto";
import CustomError from "@/utils/customError";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class ServiceManagementService implements IServiceManagementService {
  constructor(@inject(TYPES.ServiceRepository) private _serviceRepository: IServiceRepository) {}
  async createService(serviceData: ServiceRequestDTO): Promise<ServiceResponseDTO> {
    const isAlreadyExists = await this._serviceRepository.findOne({
      name: serviceData.name,
      parentId: serviceData.parentId || null,
    });

    if (isAlreadyExists) {
      throw new CustomError(SERVICE.EXISTS, HTTPSTATUS.FORBIDDEN);
    }

    const { name, platformFee, description, isAvailable, parentId } = serviceData;
    let parentObjectId: mongoose.Types.ObjectId | null = null;
    if (parentId) {
      parentObjectId = new mongoose.Types.ObjectId(parentId);
    }

    const newService = await this._serviceRepository.create({
      name,
      platformFee,
      description,
      isAvailable,
      parentId: parentObjectId,
      imageUrl: "imageUrl",
      iconUrl: "iconUrl",
    });
    return ServiceResponseDTO.fromEntity(newService);
  }
  // getAllServices ( skip: number, limit: number,search: string, status: string,  parentId: string | null  ): Promise<IService[] | null> {

  // }
}
