import { Role } from "@/constants";
import { LoginRequestDTO, RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { LoginResponseDto, RegisterResponseDTO } from "@/dtos/responses/auth.dto";
import { IUser } from "@/types/user/user.entity";

export interface IAuthService {
  findUserByEmail(email: string): Promise<boolean>;
  register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO>;
  login(loginDto: LoginRequestDTO): Promise<LoginResponseDto>;
  isUserBlocked(userId: string): Promise<boolean>;
  getUserByRoleAndId(role: Role, id: string): Promise<IUser | null>;
  updatePassword(email: string, newPassword: string): Promise<void>;
  handleGoogleUser(googleData: {
    googleId: string;
    email: string;
    name: string;
    profile: string;
  }): Promise<LoginResponseDto>;
  getUserInfo(userId: string, role: Role): Promise<LoginResponseDto | null>;
}
