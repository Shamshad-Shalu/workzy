import { Expose } from "class-transformer";
import { DEFAULT_WORKER_COVER_IMAGE } from "@/constants";
import { IAvailabilitySlots, IDocument, IRate, IWorker, WorkerStatus } from "@/types/worker";
import { generateSignedUrl } from "@/services/s3.service";

export class WorkerProfileResponseDTO {
  @Expose() _id!: string;
  @Expose() displayName!: string;
  @Expose() tagline!: string;
  @Expose() about!: string;
  @Expose() coverImage!: string;
  @Expose() defaultRate!: IRate;
  @Expose() status!: WorkerStatus;
  @Expose() skills!: string[];
  @Expose() cities!: string[];
  @Expose() availability!: IAvailabilitySlots;
  @Expose() documents!: IDocument[];

  static async fromEntity(worker: IWorker): Promise<WorkerProfileResponseDTO> {
    const dto = new WorkerProfileResponseDTO();

    dto._id = worker.id.toString();
    dto.displayName = worker.displayName;
    dto.tagline = worker.tagline || "";
    dto.about = worker.about || "";
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
          url: await generateSignedUrl(doc.url),
        })
      )
    );
    return dto;
  }
}
