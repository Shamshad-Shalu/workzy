import { VerifyWorkerRequestDTO } from "@/dtos/requests/admin/worker.verify.dto";
import { JoinUsDTO, ResubmitDocument } from "@/dtos/requests/joinUs.dto";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { WorkerResponseDTO } from "@/dtos/responses/admin/worker.dto";
import { NearbyWorkerResponseDTO } from "@/dtos/responses/worker/worker.nearby.response.dto";
import { WorkerProfileResponseDTO } from "@/dtos/responses/worker/worker.profile.dto";
import { WorkerSummaryResponseDTO } from "@/dtos/responses/worker/worker.summery.dto";
import { IWorker } from "@/types/worker";

export interface IWorkerService {
  getWorkerByUserId(userId: string): Promise<IWorker | null>;
  getWorkerSummary(workerId: string): Promise<WorkerSummaryResponseDTO>;
  getWorkerProfile(workerId: string): Promise<WorkerProfileResponseDTO>;
  updateWorkerProfile(
    workerId: string,
    data: WorkerProfileRequestDTO
  ): Promise<WorkerProfileResponseDTO>;
  createWorkerProfile(userId: string, data: JoinUsDTO): Promise<WorkerProfileResponseDTO>;
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
    data: ResubmitDocument
  ): Promise<WorkerProfileResponseDTO>;
  getNearbyWorkers(
    lat: number,
    lng: number,
    radiusKm: number,
    limit: number
  ): Promise<NearbyWorkerResponseDTO[]>;
}
