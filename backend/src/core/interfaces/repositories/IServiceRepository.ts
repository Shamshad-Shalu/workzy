import { BaseRepository } from "@/core/abstracts/base.repository";
import { IService } from "@/types/service";
import { WorkerServicesAggregationResult } from "@/types/service-aggregation.types";

export interface IServiceRepository extends BaseRepository<IService> {
  getWorkerServicesAggregate(
    workerId: string,
    page: number,
    limit: number,
    search: string,
    status: string,
    categoryId: string | null
  ): Promise<WorkerServicesAggregationResult>;
}
