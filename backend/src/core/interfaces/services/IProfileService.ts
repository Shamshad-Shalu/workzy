import { ChangePasswordDTO } from "@/dtos/requests/profile.dto";

export interface IProfileService {
  updateProfileImage(userId: string, file: Express.Multer.File): Promise<string>;
  updatePassword(userId: string, passwordDto: ChangePasswordDTO): Promise<boolean>;
  sentMail(userId: string, email: string): Promise<boolean>;
  resendOtp(userId: string, type: "email" | "phone", value: string): Promise<boolean>;
  updateEmailOrPhone(userId: string, type: "email" | "phone", value: string): Promise<boolean>;
}
