import { Expose } from "class-transformer";
import { DEFAULT_WORKER_COVER_IMAGE } from "@/constants";
import { IAvailabilitySlots, IDocument, IRate, IWorker, WorkerStatus } from "@/types/worker";

export class WorkerProfileResponseDTO {
  @Expose() displayName!: string;
  @Expose() tagline!: string;
  @Expose() about!: string;
  @Expose() coverImage!: string;
  @Expose() defaultRate!: IRate;
  @Expose() workerstatus!: WorkerStatus;
  @Expose() skills!: string[];
  @Expose() cities!: string[];
  @Expose() availability!: IAvailabilitySlots;
  @Expose() documents!: IDocument[];

  static async fromEntity(worker: IWorker): Promise<WorkerProfileResponseDTO> {
    const dto = new WorkerProfileResponseDTO();

    dto.displayName = worker.displayName;
    dto.tagline = worker.tagline || "";
    dto.about = worker.about || "";
    dto.coverImage = worker.coverImage || DEFAULT_WORKER_COVER_IMAGE;
    dto.defaultRate = worker.defaultRate;
    dto.skills = worker.skills;
    dto.cities = worker.cities;
    dto.workerstatus = worker.status;
    dto.availability = worker.availability;
    dto.documents = worker.documents || [];
    return dto;
  }
}
