import { BaseRepository } from "@/core/abstracts/base.repository";
import { IUser } from "@/types/user";

export interface IUserRepository extends BaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
