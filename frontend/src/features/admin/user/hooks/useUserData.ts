import { useState, useCallback } from 'react';
import { userApi } from '../api/userApi';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  phone?: number;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface ApiResponse {
  users: ApiUser[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface FilterParams {
  page: number;
  search?: string;
  status?: string;
  limit?: number;
}

export const useUserData = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (params: FilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }
      if (params.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }

      const data = await userApi.getUsers(queryParams);

      setData(data);
    } catch (err) {
      toast.error(handleApiError(err));
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchUsers };
};
