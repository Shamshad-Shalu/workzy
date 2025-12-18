import { BaseRepository } from "@/core/abstracts/base.repository";
import { IWorker } from "@/types/worker";
import { FilterQuery } from "mongoose";

export interface IWorkerRepository extends BaseRepository<IWorker> {
  getAllWorkers(
    filter: FilterQuery<IWorker>,
    skip: number,
    limit: number
  ): Promise<IWorker[] | null>;
}
