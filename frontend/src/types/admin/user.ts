export interface UserRow {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isPremium: boolean;
  isBlocked: boolean;
  profileImage?: string;
  createdAt: string;
}

export interface BackendUserResponse {
  users: UserRow[];
  total: number;
  currentPage: number;
}

export interface UserResponse {
  users: UserRow[];
  total: number;
  totalPages: number;
  page: number;
}
