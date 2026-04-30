import type { StripeAccountStatus, WorkerStatus } from '@/constants';

export interface WorkerListItem {
  email: string;
  id: string;
  displayName: string;
  profileImage?: string;
  status: WorkerStatus;
  userId: string;
  phone?: string;
  stripeAccountStatus: StripeAccountStatus;
  createdAt: Date;
}

export interface AdminWorkerListResponse {
  workers: WorkerListItem[];
  total: number;
}

export type AdminWorkerListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  stripStatus?: string;
};
