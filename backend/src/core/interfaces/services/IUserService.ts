import { UsersResponseDTO } from "@/dtos/responses/admin/users.dto";
import { IUser } from "@/types/user";

export interface IUserService {
  findByEmail(email: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null>;
  getUsers(
    page: number,
    limit: number,
    search: string,
    status: string,
    role: string
  ): Promise<{ users: UsersResponseDTO[]; total: number }>;
}
