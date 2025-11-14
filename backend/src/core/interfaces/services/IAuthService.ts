import { RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { RegisterResponseDTO } from "@/dtos/responses/auth.dto";

export interface IAuthService {
  findUserByEmail(email: string): Promise<boolean>;
  register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO>;
}
