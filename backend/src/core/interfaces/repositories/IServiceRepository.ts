import { BaseRepository } from "@/core/abstracts/base.repository";
import { CategoryOption } from "@/types/category";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { IService } from "@/types/service/service.entity";
import { PublicWorkerServiceItem, WorkerServiceItem } from "@/types/service/service.projection";
import { PublicServiceListQuery, ServiceListQuery } from "@/types/service/service.query";

export interface IServiceRepository extends BaseRepository<IService> {
  listWorkerServices(
    workerId: string,
    query: ServiceListQuery
  ): Promise<CursorPaginatedResult<WorkerServiceItem>>;
  listWorkerPublicServices(
    workerId: string,
    query: PublicServiceListQuery
  ): Promise<CursorPaginatedResult<PublicWorkerServiceItem>>;
  getWorkerServiceParentCategories(workerId: string): Promise<CategoryOption[]>;
  getServiceById(serviceId: string): Promise<WorkerServiceItem | null>;
}
