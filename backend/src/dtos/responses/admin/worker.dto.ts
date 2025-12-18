import { IDocument, IRate, IWorker } from "@/types/worker";
import { IUser } from "@/types/user";
import { generateSignedUrl } from "@/services/s3.service";
import { DEFAULT_IMAGE_URL } from "@/constants";

export class WorkerResponseDTO {
  _id!: string;
  status!: string;
  documents?: IDocument[];
  displayName!: string;
  tagline!: string;
  about!: string;
  defaultRate?: IRate;
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

  static async fromEntity(entity: any): Promise<WorkerResponseDTO> {
    const dto = new WorkerResponseDTO();

    const user = entity.userId as IUser;

    dto._id = entity._id.toString();
    dto.status = entity.status;
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline;
    dto.about = entity.about;
    dto.defaultRate = entity.defaultRate;
    if (entity.documents && entity.documents.length > 0) {
      dto.documents = await Promise.all(
        entity.documents.map(async (doc: IDocument) => ({
          ...doc,
          url: await generateSignedUrl(doc.url),
        }))
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
      } else if (image.includes(".amazonaws.com")) {
        dto.profileImage = await generateSignedUrl(image);
      } else {
        dto.profileImage = image;
      }
    }

    return dto;
  }

  static async fromEntities(entities: IWorker[]): Promise<WorkerResponseDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity)));
  }
}
