import { ChangePasswordDTO } from "@/dtos/requests/profile.dto";
import { UserProfileResponseDTO } from "@/dtos/responses/profile.dto";
import { IUser } from "@/types/user";

export interface IProfileService {
  updateProfileImage(userId: string, file: Express.Multer.File): Promise<string>;
  updatePassword(userId: string, passwordDto: ChangePasswordDTO): Promise<boolean>;
  sentMail(userId: string, email: string): Promise<boolean>;
  resendOtp(userId: string, type: "email" | "phone", value: string): Promise<boolean>;
  updateEmailOrPhone(userId: string, type: "email" | "phone", value: string): Promise<boolean>;
  getProfile(userId: string): Promise<UserProfileResponseDTO>;
  updateProfile(userId: string, payload: Partial<IUser>): Promise<UserProfileResponseDTO>;
}
