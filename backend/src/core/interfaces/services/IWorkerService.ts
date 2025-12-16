import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { WorkerProfileResponseDTO } from "@/dtos/responses/worker/worker.profile.dto";
import { WorkerSummaryResponseDTO } from "@/dtos/responses/worker/worker.summery.dto";
import { IWorker } from "@/types/worker";

export interface IWorkerService {
  getWorkerByUserId(userId: string): Promise<IWorker | null>;
  getWorkerSummary(workerId: string): Promise<WorkerSummaryResponseDTO>;
  getWorkerProfile(workerId: string): Promise<WorkerProfileResponseDTO>;
  updateWorkerProfile(
    workerId: string,
    data: WorkerProfileRequestDTO,
    file?: Express.Multer.File
  ): Promise<WorkerProfileResponseDTO>;
}
