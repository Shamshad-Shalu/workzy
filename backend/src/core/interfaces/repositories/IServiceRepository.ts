import { BaseRepository } from "@/core/abstracts/base.repository";
import { CategoryOption } from "@/types/category";
import { IService } from "@/types/service";
import { WorkerServicesAggregationResult } from "@/types/service-aggregation.types";
import { WorkerListingEntity, WorkerListingFilters } from "@/types/worker";

export interface IServiceRepository extends BaseRepository<IService> {
  getWorkerServicesAggregate(
    workerId: string,
    page: number,
    limit: number,
    search: string,
    status: string,
    categoryId: string | null
  ): Promise<WorkerServicesAggregationResult>;

  getWorkerServiceParentCategories(workerId: string): Promise<CategoryOption[]>;
  listWorkers(
    serviceId: string,
    filters: WorkerListingFilters
  ): Promise<{ total: number; workersRaw: WorkerListingEntity[] }>;
}
