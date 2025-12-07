import { USER } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import User from "@/models/user.model";
import { IUser } from "@/types/user";
import { buildUserFilter } from "@/utils/admin/buildUserFilter";
import { injectable } from "inversify";
import { Types } from "mongoose";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async findUserById(id: string): Promise<IUser | null> {
    const objId = new Types.ObjectId(id);
    return this.findById(objId);
  }

  async getUserByRoleAndId(role: string, id: string): Promise<IUser | null> {
    return User.findOne({ _id: id, role }).exec();
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await User.findOne({ googleId });
  }
  async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
    const updatedUser = this.model.findByIdAndUpdate(userId, userData, { new: true });

    if (!updatedUser) {
      throw new Error(USER.NOT_FOUND);
    }
    return updatedUser;
  }

  async getAllUsers(
    skip: number,
    limit: number,
    search: string,
    status: string,
    role: string
  ): Promise<IUser[]> {
    const filter = buildUserFilter(search, status, role);
    return this.model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
  }
}
