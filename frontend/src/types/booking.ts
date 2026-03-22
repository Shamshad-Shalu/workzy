import type { BookingFilterStatus, BookingPaymentStatus, BookingStatus, Role } from '@/constants';

export interface PaymentDetails {
  success: boolean;
  type: string;
  transactionId: string;
  productName: string;
  amountPaid: number;
  paymentMethod: string;
  date: string;
  receiptUrl?: string;
}

export interface ExtraCharge {
  amount: number;
  reason: string;
  evidenceUrl?: string; // receipt photo
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  respondedAt?: Date;
}

interface BookingStatusHistory {
  status: BookingStatus;
  changedAt: Date;
  changedBy?: Role;
  reason?: string; // rejection reason / cancel reason
}

export interface EvidenceItem {
  url: string;
  type: 'image' | 'video';
  uploadedAt: Date;
}

export interface Evidence {
  before: EvidenceItem[];
  after: EvidenceItem[];
  uploadedAt?: Date;
}

export interface Booking {
  bookingId: string;
  userId: string;
  workerId: string;
  serviceId: string;
  categoryId: string;
  // Schedule
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;

  rate: number; // worker rate per unit
  itemCount: number;
  subtotal: number; // rate * itemCount
  discountPercent: number; // 0 if no discount
  discountAmount: number; // subtotal * discountPercent/100
  chargeableAmount: number; // subtotal - discountAmount  ← platform fee based on THIS
  travelCost: number; // no platform fee on this
  platformFeePercent: number; // snapshot from category at booking time
  platformFee: number; // chargeableAmount * platformFeePercent/100
  total: number; // chargeableAmount + travelCost (user pays this)
  extraCharge?: ExtraCharge;

  evidence?: Evidence;

  paymentStatus: BookingPaymentStatus;
  status: BookingStatus;
  statusHistory: BookingStatusHistory[];

  isReviewed: boolean;
  userNote?: string;
  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface BookingCard {
  id: string;
  bookingId: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  addressLabel: string;

  total: number;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  extraCharge?: ExtraCharge;

  evidence?: Evidence;
  isReviewed: boolean;
  statusHistory: BookingStatusHistory[];
  userNote?: string;

  worker: {
    id: string;
    displayName: string;
    tagline: string;
    coverImage: string;
    profileImage: string;
    averageRating: number;
    isPremium: boolean;
  };
  category: {
    id: string;
    name: string;
    iconUrl: string;
  };
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
}

export interface BookingResponse {
  data: BookingCard[];
  cursor: string | null;
  hasMore: boolean;
  total?: number;
}

export interface BookingListParams {
  status?: BookingFilterStatus;
  limit?: number;
  cursor?: string;
  sort?: 'asc' | 'desc';
}
