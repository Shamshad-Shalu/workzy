import { Role } from "@/constants";
import { LoginRequestDTO, RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { LoginResponseDTO, RegisterResponseDTO } from "@/dtos/responses/auth.dto";
import { IUser } from "@/types/user";

export interface IAuthService {
  findUserByEmail(email: string): Promise<boolean>;
  register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO>;
  login(loginDto: LoginRequestDTO): Promise<LoginResponseDTO>;
  isUserBlocked(userId: string): Promise<boolean>;
  getUserByRoleAndId(role: Role, id: string): Promise<IUser | null>;
  updatePassword(email: string, newPassword: string): Promise<void>;
}
