import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { TYPES } from "@/di/types";
import { IWorker } from "@/types/worker";
import { inject, injectable } from "inversify";

@injectable()
export class WorkerService implements IWorkerService {
  constructor(@inject(TYPES.WorkerRepository) private workerRepository: IWorkerRepository) {}
  getWorkerByUserId = async (userId: string): Promise<IWorker | null> => {
    return this.workerRepository.findOne({ userId });
  };
}
