import { ChangePasswordDTO, ProfileRequestDTO } from "@/dtos/requests/profile.dto";
import { UserProfileResponseDTO } from "@/dtos/responses/profile.dto";

export interface IProfileService {
  updateProfileImage(userId: string, url: string): Promise<string>;
  updatePassword(userId: string, passwordDto: ChangePasswordDTO): Promise<boolean>;
  requestChangeEmail(userId: string, email: string): Promise<boolean>;
  requestChangePhone(userId: string, phone: string): Promise<boolean>;
  resendOtp(userId: string, type: "email" | "phone", value: string): Promise<boolean>;
  updateEmailOrPhone(userId: string, type: "email" | "phone", value: string): Promise<boolean>;
  getProfile(userId: string): Promise<UserProfileResponseDTO>;
  updateProfileBasic(userId: string, payload: ProfileRequestDTO): Promise<UserProfileResponseDTO>;
}
