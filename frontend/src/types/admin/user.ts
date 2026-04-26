import type { Role } from '@/constants';

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: Date;
}

export interface AdminUserListResponse {
  users: UserListItem[];
  total: number;
}

export type AdminUserListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  role?: string;
};
