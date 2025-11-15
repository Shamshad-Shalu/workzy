import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { TYPES } from "@/di/types";
import { IUser } from "@/types/user";
import { inject, injectable } from "inversify";

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }
}
