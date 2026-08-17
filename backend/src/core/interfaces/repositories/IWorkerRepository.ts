import { DocumentType, WorkerStatus } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { PaginatedResult, CursorPaginatedResult } from "@/types/common/pagination";
import { IReviewStats, IWorker } from "@/types/worker/worker.entity";
import {
  NearbyWorkerItem,
  PublicWorkerListItem,
  WorkerListItem,
  WorkerProfile,
} from "@/types/worker/worker.projection";
import {
  NearbyWorkerListQuery,
  PublicWorkerListQuery,
  WorkerListQuery,
} from "@/types/worker/worker.query";

export interface IWorkerRepository extends BaseRepository<IWorker> {
  getWorkerByUserId(userId: string): Promise<IWorker | null>;
  getWorkerProfile(workerId: string): Promise<WorkerProfile | null>;
  listNearbyWorkers(query: NearbyWorkerListQuery): Promise<NearbyWorkerItem[]>;
  listWorkers(query: WorkerListQuery): Promise<PaginatedResult<WorkerListItem>>;
  listPublicWorkers(
    serviceId: string,
    query: PublicWorkerListQuery
  ): Promise<CursorPaginatedResult<PublicWorkerListItem>>;

  incrementRating(workerId: string, rating: number): Promise<void>;
  adjustRating(workerId: string, oldRating: number, newRating: number): Promise<void>;
  decrementRating(workerId: string, rating: number): Promise<void>;
  getWorkerReviewStats(workerId: string): Promise<IReviewStats | null>;
  getWorkerGrowthAnalytics(): Promise<{ month: number; workers: number }[]>;
  updateWorkerStatus(
    workerId: string,
    status: WorkerStatus,
    reason: string
  ): Promise<Worker | null>;
  addWorkerDocument(workerId: string, type: DocumentType, url: string): Promise<IWorker | null>;
  updateWorkerDocument(workerId: string, documentId: string, url: string): Promise<IWorker | null>;
}
