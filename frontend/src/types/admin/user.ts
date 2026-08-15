import type { Role } from '@/constants';

import type { User } from '../user';

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

export type UserProfileDetails = Omit<User, 'worker'> & { createdAt: Date };

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

export interface AdminUserStats {
  totalBookings: number;
  totalSpent: number;
  totalDisputes: number;
}
