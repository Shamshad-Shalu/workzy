import type { QuoteStatus } from '@/constants/quote';

import type { BookingSlot } from './booking';

export interface QuoteListItem {
  id: string;
  bookingId: string;
  serviceId: string;
  dates: BookingSlot[];
  totalPrice: number;
  message?: string;
  status: QuoteStatus;
  createdAt: Date;
  worker: {
    id: string;
    name: string;
    profileImage?: string;
  };
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  category: {
    id: string;
    name: string;
    iconUrl: string;
  };
}

export interface QuoteListResponse {
  quotes: QuoteListItem[];
  nextCursor: string | null;
}

export interface QuoteListQuery {
  userId?: string;
  workerId?: string;
  search?: string;
  status?: string;
  cursor?: string;
  limit: number;
}

export interface WorkerQuoteStats {
  acceptRate: number;
  totalEarned: number;
  counts: {
    all: number;
    pending: number;
    accepted: number;
    rejected: number;
    expired: number;
  };
}
