import { BaseRepository } from "@/core/abstracts/base.repository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import Worker from "@/models/worker.model";
import { IWorker } from "@/types/worker";
import { injectable } from "inversify";

@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
  constructor() {
    super(Worker);
  }
}
