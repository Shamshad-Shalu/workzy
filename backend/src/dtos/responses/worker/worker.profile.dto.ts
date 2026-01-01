import { Expose } from "class-transformer";
import { DEFAULT_WORKER_COVER_IMAGE } from "@/constants";
import { IAvailabilitySlots, IDocument, IRate, IWorker, WorkerStatus } from "@/types/worker";
import { IS3Service } from "@/core/interfaces/services/IS3Service";

export class WorkerProfileResponseDTO {
  @Expose() _id!: string;
  @Expose() displayName!: string;
  @Expose() tagline!: string;
  @Expose() about!: string;
  @Expose() experience!: number;
  @Expose() coverImage!: string;
  @Expose() defaultRate!: IRate;
  @Expose() status!: WorkerStatus;
  @Expose() skills!: string[];
  @Expose() cities!: string[];
  @Expose() availability!: IAvailabilitySlots;
  @Expose() documents!: IDocument[];

  static async fromEntity(
    worker: IWorker,
    s3Service: IS3Service
  ): Promise<WorkerProfileResponseDTO> {
    const dto = new WorkerProfileResponseDTO();

    dto._id = worker.id.toString();
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
        async (doc): Promise<IDocument> => ({
          _id: doc._id,
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
