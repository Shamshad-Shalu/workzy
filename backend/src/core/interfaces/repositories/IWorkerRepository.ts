import { FilterQuery } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { WorkerReviewStats } from "@/types/review";
import {
  IWorker,
  NearbyWorkerEntity,
  WorkerListingEntity,
  WorkerListingFilters,
  WorkerSummaryEntity,
} from "@/types/worker";

export interface IWorkerRepository extends BaseRepository<IWorker> {
  getWorkerSummary(workerId: string): Promise<WorkerSummaryEntity | null>;
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
    params: WorkerListingFilters
  ): Promise<{ total: number; workersRaw: WorkerListingEntity[] }>;
  incrementRating(workerId: string, rating: number): Promise<void>;
  adjustRating(workerId: string, oldRating: number, newRating: number): Promise<void>;
  decrementRating(workerId: string, rating: number): Promise<void>;
  getWorkerReviewStats(workerId: string): Promise<WorkerReviewStats | null>;
}
