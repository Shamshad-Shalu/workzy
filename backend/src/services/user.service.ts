import redisClient from "@/config/redisClient";
import { REDIS_EXPIRY, USER } from "@/constants";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { TYPES } from "@/di/types";
import { UsersResponseDTO } from "@/dtos/responses/admin/users.dto";
import { IUser } from "@/types/user";
import { buildUserFilter } from "@/utils/admin/buildUserFilter";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";
import { inject, injectable } from "inversify";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}

  async findByEmail(email: string): Promise<IUser | null> {
    return this._userRepository.findByEmail(email);
  }

  async getUsers(
    page: number,
    limit: number,
    search: string,
    status: string,
    role: string
  ): Promise<{ users: UsersResponseDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = buildUserFilter(search, status, role);

    const [usersRaw, total] = await Promise.all([
      this._userRepository.getAllUsers(skip, limit, search, status, role),
      this._userRepository.countDocuments(filter),
    ]);
    const users = await UsersResponseDTO.fromEntities(usersRaw, this._s3Service);

    return { users, total };
  }

  async toggleUserStatus(userId: string): Promise<string> {
    const user = await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);
    const newStatus = !user.isBlocked;

    await this._userRepository.update(userId, { isBlocked: newStatus });

    if (newStatus) {
      await redisClient.set(`blocked_user:${userId}`, 1, { EX: REDIS_EXPIRY });
    } else {
      await redisClient.del(`blocked_user:${userId}`);
    }
    return newStatus ? USER.BLOCKEDSUCCESS : USER.UNBLOCKED;
  }
}
