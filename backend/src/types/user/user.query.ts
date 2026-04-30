import { Role } from "@/constants";

export type UserStatusFilter = "all" | "active" | "blocked";

export type UserListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: UserStatusFilter;
  role: Role | "all";
};
