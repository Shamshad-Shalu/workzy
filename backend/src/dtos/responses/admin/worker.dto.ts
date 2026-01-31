import { DEFAULT_IMAGE_URL } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IUser } from "@/types/user";
import { DocumentDto, IDocument, IWorker } from "@/types/worker";

export class WorkerResponseDTO {
  id!: string;
  status!: string;
  documents?: DocumentDto[];
  displayName!: string;
  tagline!: string;
  about!: string;
  defaultRate?: number;
  experience!: number;
  createdAt!: Date;

  userId!: string;
  name!: string;
  age?: number;
  email!: string;
  phone!: string;
  isPremium!: boolean;
  isBlocked!: boolean;
  profileImage!: string;

  static async fromEntity(entity: any, s3Service: IS3Service): Promise<WorkerResponseDTO> {
    const dto = new WorkerResponseDTO();

    const user = entity.userId as IUser;

    dto.id = entity._id.toString();
    dto.status = entity.status;
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline;
    dto.about = entity.about;
    dto.defaultRate = entity.defaultRate;
    if (entity.documents && entity.documents.length > 0) {
      dto.documents = await Promise.all(
        (entity.documents || []).map(
          async (doc: IDocument): Promise<DocumentDto> => ({
            id: doc._id,
            name: doc.name,
            type: doc.type,
            status: doc.status,
            rejectReason: doc.rejectReason,
            url: await s3Service.generateSignedUrl(doc.url),
          })
        )
      );
    } else {
      dto.documents = [];
    }
    dto.experience = entity.experience;
    dto.createdAt = entity.createdAt;

    if (user) {
      dto.userId = user._id.toString();
      dto.name = user.name;
      dto.email = user.email;
      dto.phone = user.phone || "-";
      dto.isPremium = user.isPremium;
      dto.isBlocked = user.isBlocked;
      dto.age = user.age;

      const image = user.profileImage;
      if (!image) {
        dto.profileImage = DEFAULT_IMAGE_URL;
      } else if (image.includes("private/user/profiles")) {
        dto.profileImage = await s3Service.generateSignedUrl(image);
      } else {
        dto.profileImage = image;
      }
    }

    return dto;
  }

  static async fromEntities(
    entities: IWorker[],
    s3Service: IS3Service
  ): Promise<WorkerResponseDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}
