import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IAuthService } from "@/core/interfaces/services/IAuthService";
import { TYPES } from "@/di/types";
import { RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { RegisterResponseDTO } from "@/dtos/responses/auth.dto";
import { inject, injectable } from "inversify";
import { hash } from "bcryptjs";
import redisClient from "@/config/redisClient";
import { IUser } from "@/types/user";

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }

  async register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const { name, email, password } = registerDto;
    const hashedPassword = await hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const userData = RegisterResponseDTO.fromEntity(user);
    await redisClient.del(`otp:${email}`);

    return userData;
  }
}
