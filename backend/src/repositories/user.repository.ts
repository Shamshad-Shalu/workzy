import dayjs from "dayjs";
import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import { Role, ROLE } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import User from "@/models/user.model";
import { PaginatedResult } from "@/types/common/pagination";
import { IUser } from "@/types/user/user.entity";
import { UserListItem } from "@/types/user/user.projection";
import { UserListQuery } from "@/types/user/user.query";

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

  async findByRole(role: Role): Promise<IUser | null> {
    return await this.model.findOne({ role }).exec();
  }
  async listUsers(query: UserListQuery): Promise<PaginatedResult<UserListItem>> {
    const { page, limit, search, status, role } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IUser> = {};
    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }
    if (status === "active") filter.isBlocked = false;
    if (status === "blocked") filter.isBlocked = true;

    if (role === "all") {
      filter.role = { $ne: ROLE.ADMIN };
    } else if (role === ROLE.USER) {
      filter.role = ROLE.USER;
    } else if (role === ROLE.WORKER) {
      filter.role = ROLE.WORKER;
    }

    const [users, total] = await Promise.all([
      this.model
        .find(filter)
        .select("name email phone role isBlocked profileImage  createdAt")
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.model.countDocuments(filter),
    ]);
    return { data: users, total };
  }

  async getUserGrowthAnalytics(): Promise<{ month: number; users: number }[]> {
    const startOfYear = dayjs().startOf("year").toDate();

    const endOfYear = dayjs().endOf("year").toDate();

    return this.model.aggregate<{
      month: number;
      users: number;
    }>([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },

      {
        $group: {
          _id: {
            $month: "$createdAt",
          },

          users: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          month: "$_id",
          users: 1,
        },
      },
    ]);
  }
}
