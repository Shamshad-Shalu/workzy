import { WorkerSummaryResponseDTO } from "@/dtos/responses/worker/worker.summery.dto";
import { IWorker } from "@/types/worker";

export interface IWorkerService {
  getWorkerByUserId(userId: string): Promise<IWorker | null>;
  getWorkerSummary(workerId: string): Promise<WorkerSummaryResponseDTO>;
}
