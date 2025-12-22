import { VerifyWorkerRequestDTO } from "@/dtos/requests/admin/worker.verify.dto";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { WorkerResponseDTO } from "@/dtos/responses/admin/worker.dto";
import { WorkerProfileResponseDTO } from "@/dtos/responses/worker/worker.profile.dto";
import { WorkerSummaryResponseDTO } from "@/dtos/responses/worker/worker.summery.dto";
import { DocumentType, IWorker, WorkerStatus } from "@/types/worker";

export interface IWorkerService {
  getWorkerByUserId(userId: string): Promise<IWorker | null>;
  getWorkerSummary(workerId: string): Promise<WorkerSummaryResponseDTO>;
  getWorkerProfile(workerId: string): Promise<WorkerProfileResponseDTO>;
  updateWorkerProfile(
    workerId: string,
    data: WorkerProfileRequestDTO,
    file?: Express.Multer.File
  ): Promise<WorkerProfileResponseDTO>;
  createWorkerProfile(
    userId: string,
    data: any,
    file: Express.Multer.File
  ): Promise<WorkerProfileResponseDTO>;
  getAllWorkers(
    page: number,
    limit: number,
    search: string,
    status: string,
    workerStatus: string
  ): Promise<{ workers: WorkerResponseDTO[]; total: number }>;
  verifyWorker(workerId: string, data: VerifyWorkerRequestDTO): Promise<WorkerResponseDTO>;
  reSubmitWorkerDocument(
    workerId: string,
    data: { id: string; WorkerStatus?: WorkerStatus; type?: DocumentType },
    file: Express.Multer.File
  ): Promise<WorkerProfileResponseDTO>;
}
