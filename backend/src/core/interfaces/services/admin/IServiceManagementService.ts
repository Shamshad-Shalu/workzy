import { ServiceRequestDTO, ServiceUpdateRequestDTO } from "@/dtos/requests/service.dto";
import { ServiceResponseDTO } from "@/dtos/responses/admin/service.response.dto";

export interface IServiceManagementService {
  createService(
    serviceData: ServiceRequestDTO,
    files: { iconFile: Express.Multer.File; imgFile: Express.Multer.File }
  ): Promise<ServiceResponseDTO>;

  toggleServiceStatus(serviceId: string): Promise<{ newStatus: boolean; message: string }>;
  getAllServices(
    page: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<{ services: ServiceResponseDTO[]; total: number }>;

  updateService(
    serviceId: string,
    updateData: ServiceUpdateRequestDTO,
    iconFile?: Express.Multer.File,
    imgFile?: Express.Multer.File
  ): Promise<ServiceResponseDTO>;
}
