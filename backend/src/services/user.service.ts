import { ROLE } from "@/constants";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { TYPES } from "@/di/types";
import { UsersResponseDTO } from "@/dtos/responses/admin/users.dto";
import User from "@/models/user.model";
import { IUser } from "@/types/user";
import { buildUserFilter } from "@/utils/admin/buildUserFilter";
import { inject, injectable } from "inversify";

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.UserRepository) private _userRepository: IUserRepository) {}

  findByEmail(email: string): Promise<IUser | null> {
    return this._userRepository.findByEmail(email);
  }

  async getUsers(
    page: number,
    limit: number,
    search: string,
    status: string,
    role: string
  ): Promise<{ users: UsersResponseDTO[]; total: number; page: number }> {
    const skip = (page - 1) * limit;

    const filter = buildUserFilter(search, status, role);

    const [usersRaw, total] = await Promise.all([
      this._userRepository.getAllUsers(skip, limit, search, status, role),
      User.countDocuments(filter),
    ]);

    const users = await UsersResponseDTO.fromEntities(usersRaw);

    return { users, total, page };
  }
}
