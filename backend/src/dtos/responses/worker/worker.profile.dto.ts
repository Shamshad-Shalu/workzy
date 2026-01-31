import { Expose } from "class-transformer";
import { DEFAULT_WORKER_COVER_IMAGE } from "@/constants";
import { DocumentDto, IAvailabilitySlots, IWorker, WorkerStatus } from "@/types/worker";
import { IS3Service } from "@/core/interfaces/services/IS3Service";

export class WorkerProfileResponseDTO {
  @Expose() id!: string;
  @Expose() displayName!: string;
  @Expose() tagline!: string;
  @Expose() about!: string;
  @Expose() experience!: number;
  @Expose() coverImage!: string;
  @Expose() defaultRate!: number;
  @Expose() status!: WorkerStatus;
  @Expose() skills!: string[];
  @Expose() cities!: string[];
  @Expose() availability!: IAvailabilitySlots;
  @Expose() documents!: DocumentDto[];

  static async fromEntity(
    worker: IWorker,
    s3Service: IS3Service
  ): Promise<WorkerProfileResponseDTO> {
    const dto = new WorkerProfileResponseDTO();

    dto.id = worker._id.toString();
    dto.displayName = worker.displayName;
    dto.tagline = worker.tagline || "";
    dto.about = worker.about || "";
    dto.experience = worker.experience || 0;
    dto.coverImage = worker.coverImage || DEFAULT_WORKER_COVER_IMAGE;
    dto.defaultRate = worker.defaultRate;
    dto.skills = worker.skills;
    dto.cities = worker.cities;
    dto.status = worker.status;
    dto.availability = worker.availability;

    dto.documents = await Promise.all(
      (worker.documents || []).map(
        async (doc): Promise<DocumentDto> => ({
          id: doc._id,
          name: doc.name,
          type: doc.type,
          status: doc.status,
          rejectReason: doc.rejectReason,
          url: await s3Service.generateSignedUrl(doc.url),
        })
      )
    );
    return dto;
  }
}
