import { ChangePasswordDTO } from "@/dtos/requests/profile.dto";

export interface IProfileService {
  updateProfileImage(userId: string, file: Express.Multer.File): Promise<string>;
  updatePassword(userId: string, passwordDto: ChangePasswordDTO): Promise<boolean>;
}
