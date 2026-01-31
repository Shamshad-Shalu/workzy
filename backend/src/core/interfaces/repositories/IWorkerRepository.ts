import { FilterQuery } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IWorker } from "@/types/worker";

export interface IWorkerRepository extends BaseRepository<IWorker> {
  getAllWorkers(
    filter: FilterQuery<IWorker>,
    skip: number,
    limit: number
  ): Promise<IWorker[] | null>;
}
