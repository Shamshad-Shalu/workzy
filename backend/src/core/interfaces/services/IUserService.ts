import { IUser } from "@/types/user";

export interface IUserService {
  findByEmail(email: string): Promise<IUser | null>;
}
