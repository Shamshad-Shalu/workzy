import { IAuthService } from "@/core/interfaces/services/IAuthService";
import { TYPES } from "@/di/types";
import { LoginRequestDTO, RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { LoginResponseDTO, RegisterResponseDTO } from "@/dtos/responses/auth.dto";
import { inject, injectable } from "inversify";
import { compare, hash } from "bcryptjs";
import redisClient from "@/config/redisClient";
import { plainToInstance } from "class-transformer";
import { AUTH, EMAIL, HTTPSTATUS, ROLE, Role, USER } from "@/constants";
import { IUser } from "@/types/user";
import CustomError from "@/utils/customError";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { getUserOrThrow } from "@/utils/getUserOrThrow";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.WorkerService) private _workerService: IWorkerService
  ) {}

  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this._userRepository.findByEmail(email);
    return !!user;
  }

  async register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const { name, email, password } = registerDto;
    const hashedPassword = await hash(password, 10);

    const user = await this._userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const userData = plainToInstance(RegisterResponseDTO, user, {
      excludeExtraneousValues: true,
    });
    await redisClient.del(`otp:${email}`);

    return userData;
  }

  async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = data;

    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(USER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(AUTH.INVALID_CREDENTIALS, HTTPSTATUS.BAD_REQUEST);
    }

    const userObj = user.toObject();

    if (user.role === ROLE.WORKER) {
      const worker = await this._workerService.getWorkerByUserId(user._id);
      if (worker) {
        const workerId = worker as { _id: string };
        userObj.workerId = workerId._id.toString();
      }
    }

    return await LoginResponseDTO.fromEntity(userObj);
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    const user = await getUserOrThrow(this._userRepository, userId);
    return user.isBlocked || false;
  }

  async getUserByRoleAndId(role: Role, id: string): Promise<IUser | null> {
    return this._userRepository.getUserByRoleAndId(role, id);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new CustomError(USER.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await redisClient.del(`forgotPassword${email}`);
  }

  async handleGoogleUser(googleData: {
    googleId: string;
    email: string;
    name: string;
    profile: string;
  }): Promise<LoginResponseDTO> {
    let user = await this._userRepository.findByGoogleId(googleData.googleId);

    if (!user) {
      const dummyPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hash(dummyPassword, 10);

      user = await this._userRepository.create({
        name: googleData.name,
        googleId: googleData.googleId,
        email: googleData.email,
        profileImage: googleData.profile,
        password: hashedPassword,
        role: "user",
      });
    }
    const userObj = user.toObject();

    if (user.role === ROLE.WORKER) {
      const worker = await this._workerService.getWorkerByUserId(user._id);
      if (worker) {
        const workerId = worker as { _id: string };
        userObj.workerId = workerId._id.toString();
      }
    }
    return await LoginResponseDTO.fromEntity(userObj);
  }
}
