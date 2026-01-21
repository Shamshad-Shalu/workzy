import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { ServiceResponseDTO } from "@/dtos/responses/service.dto";
import { WorkerServicesAggregationResult } from "@/types/service-aggregation.types";

export interface IServiceManagement {
  createService(workerId: string, data: ServiceRequestDTO): Promise<ServiceResponseDTO>;
  updateService(
    workerId: string,
    serviceId: string,
    data: ServiceRequestDTO
  ): Promise<ServiceResponseDTO>;
  updateServiceStatus(
    workerId: string,
    serviceId: string
  ): Promise<{ message: string; newStatus: boolean }>;

  getWorkerServices(
    workerId: string,
    page: number,
    limit: number,
    search: string,
    status: string,
    categoryId: string | null
  ): Promise<WorkerServicesAggregationResult>;
}
