import { IWorker } from "@/types/worker";

export interface IWorkerService {
  getWorkerByUserId(userId: string): Promise<IWorker | null>;
}
