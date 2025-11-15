import { BaseRepository } from "@/core/abstracts/base.repository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import User from "@/models/user.model";
import { IUser } from "@/types/user";
import { injectable } from "inversify";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  getUserByRoleAndId(role: string, id: string): Promise<IUser | null> {
    return User.findOne({ _id: id, role }).exec();
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await User.findOne({ googleId });
  }
}
