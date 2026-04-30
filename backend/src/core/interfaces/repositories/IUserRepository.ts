import { BaseRepository } from "@/core/abstracts/base.repository";
import { PaginatedResult } from "@/types/common/pagination";
import { IUser } from "@/types/user/user.entity";
import { UserListItem } from "@/types/user/user.projection";
import { UserListQuery } from "@/types/user/user.query";

export interface IUserRepository extends BaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  getUserByRoleAndId(role: string, id: string): Promise<IUser | null>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  listUsers(query: UserListQuery): Promise<PaginatedResult<UserListItem>>;
}
