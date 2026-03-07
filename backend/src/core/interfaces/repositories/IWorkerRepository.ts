import { FilterQuery } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import {
  IWorker,
  NearbyWorkerEntity,
  WorkerListingEntity,
  WorkerListingFiltersDist,
} from "@/types/worker";

export interface IWorkerRepository extends BaseRepository<IWorker> {
  getAllWorkers(
    filter: FilterQuery<IWorker>,
    skip: number,
    limit: number
  ): Promise<IWorker[] | null>;
  findNearbyWorkers(
    lat: number,
    lng: number,
    radiusKm: number,
    limit: number
  ): Promise<NearbyWorkerEntity[]>;
  listWorkers(
    serviceId: string,
    params: WorkerListingFiltersDist
  ): Promise<{ total: number; workersRaw: WorkerListingEntity[] }>;
}
