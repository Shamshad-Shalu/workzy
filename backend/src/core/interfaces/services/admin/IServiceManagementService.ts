import { ServiceRequestDTO, ServiceUpdateRequestDTO } from "@/dtos/requests/service.dto";
import { ServiceResponseDTO } from "@/dtos/responses/admin/service.response.dto";

export interface IServiceManagementService {
  createService(serviceData: ServiceRequestDTO): Promise<ServiceResponseDTO>;
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
    updateData: ServiceUpdateRequestDTO
  ): Promise<ServiceResponseDTO>;
}
