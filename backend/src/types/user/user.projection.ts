import { Role } from "@/constants";

export type UserListItem = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: Date;
};
