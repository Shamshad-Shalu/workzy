import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { ServiceResponseDTO } from "@/dtos/responses/admin/service.response.dto";

export interface IServiceManagementService {
  createService(serviceData: ServiceRequestDTO): Promise<ServiceResponseDTO>;
}
