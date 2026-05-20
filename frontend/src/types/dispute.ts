import type { Role } from '@/constants';
import type { DisputeReason, DisputeResolution, DisputeStatus } from '@/constants/dispute';

export interface Dispute {
  id: string;
  disputeId: string;
  bookingId: string;
  serviceName: string;
  user: {
    id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
  worker: {
    id: string;
    name: string;
    phone: string;
    profileImage?: string;
  };
  raisedBy: Role;
  status: DisputeStatus;
  reason: DisputeReason;
  resolution?: DisputeResolution;
  description: string;

  evidence: { url: string; type: 'image' | 'video' }[];
  refundedAmount?: number;

  adminNote?: string;
  resolvedAt?: Date;
  createdAt: Date;
}

export type DisputeListItem = {
  id: string;
  disputeId: string;
  bookingId: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  worker: {
    id: string;
    name: string;
    profileImage?: string;
  };
  raisedBy: Role;
  status: DisputeStatus;
  reason: DisputeReason;
  createdAt: Date;
};

export interface DisputeListingResponse {
  disputes: DisputeListItem[];
  nextCursor: string | null;
}

export interface DisputeListQuery {
  limit: number;
  cursor?: string | null;
  search?: string;
  status?: string;
  reason?: DisputeReason | 'all';
  role: Role;
}

export interface DisputeStats {
  total: number;
  pending: number;
  under_review: number;
  resolved: number;
  dismissed: number;
}
