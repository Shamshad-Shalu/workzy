import {
  ChangePasswordDto,
  UserProfileRequestDto,
  VerifyOtpDto,
} from "@/dtos/requests/profile.dto";
import { UsersResponseDTO } from "@/dtos/responses/admin/users.dto";
import { UserProfileResponseDto } from "@/dtos/responses/user.dto";
import { PaginatedResult } from "@/types/common/pagination";
import { IUser } from "@/types/user/user.entity";
import { UserListQuery } from "@/types/user/user.query";

export interface IUserService {
  findByEmail(email: string): Promise<IUser | null>;
  listUsers(query: UserListQuery): Promise<PaginatedResult<UsersResponseDTO>>;
  updateProfileImage(userId: string, url: string): Promise<string>;
  updateProfile(userId: string, data: UserProfileRequestDto): Promise<UserProfileResponseDto>;
  confirmOtpAndUpdateContact(
    userId: string,
    data: VerifyOtpDto
  ): Promise<{ user: UserProfileResponseDto; message: string }>;

  updatePassword(userId: string, passwordDto: ChangePasswordDto): Promise<boolean>;
  requestChangeEmail(userId: string, email: string): Promise<boolean>;
  requestChangePhone(userId: string, phone: string): Promise<boolean>;
  resendOtp(userId: string, type: "email" | "phone", value: string): Promise<boolean>;
  toggleUserStatus(userId: string): Promise<string>;
  getUserById(userId: string): Promise<UserProfileResponseDto>;
  getUserStats(userId: string): Promise<{
    totalBookings: number;
    totalSpent: number;
    totalDisputes: number;
  }>;
}
