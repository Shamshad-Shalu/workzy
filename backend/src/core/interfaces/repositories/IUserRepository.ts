import { BaseRepository } from "@/core/abstracts/base.repository";
import { IUser } from "@/types/user";

export interface IUserRepository extends BaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  getUserByRoleAndId(role: string, id: string): Promise<IUser | null>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  getAllUsers(
    skip: number,
    limit: number,
    search: string,
    status: string,
    role: string
  ): Promise<IUser[]>;
}
