import { BaseRepository } from "@/core/abstracts/base.repository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import Worker from "@/models/worker.model";
import { IWorker } from "@/types/worker";
import { injectable } from "inversify";
import { FilterQuery } from "mongoose";

@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
  constructor() {
    super(Worker);
  }

  async getAllWorkers(
    filter: FilterQuery<IWorker>,
    skip: number,
    limit: number
  ): Promise<IWorker[] | null> {
    const workers = await this.model
      .find(filter)
      .populate("userId", "name email phone isPremium isBlocked profileImage age")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return workers as unknown as IWorker[];
  }
}
