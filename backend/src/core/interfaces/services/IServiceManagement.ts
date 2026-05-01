import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { ServiceResponseDto } from "@/dtos/responses/service.dto";
import { CategoryOption } from "@/types/category";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { ServiceListQuery } from "@/types/service/service.query";

export interface IServiceManagement {
  createService(workerId: string, data: ServiceRequestDTO): Promise<ServiceResponseDto>;
  updateService(
    workerId: string,
    serviceId: string,
    data: ServiceRequestDTO
  ): Promise<ServiceResponseDto>;
  updateServiceStatus(
    workerId: string,
    serviceId: string
  ): Promise<{ message: string; newStatus: boolean }>;

  getWorkerServices(
    workerId: string,
    query: ServiceListQuery
  ): Promise<CursorPaginatedResult<ServiceResponseDto>>;

  getWorkerServiceFilters(workerId: string): Promise<CategoryOption[]>;
}
