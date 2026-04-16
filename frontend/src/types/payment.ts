import type { BillType, PaymentStatus } from '@/constants/payment';

export interface Payment {
  id: string;
  transactionId: string;
  refId: string;
  title: string;
  amount: number;
  status: PaymentStatus;
  billType: BillType;
  failureReason?: string;
  createdAt: Date;
}
export interface PaymentUser extends Payment {
  workerId: string;
  workerName: string;
}

export interface PaymentWorker extends Payment {
  userId: string;
  userName: string;
  workerAmount: number | null;
}

export interface PaymentAdmin extends Payment {
  user: {
    id: string;
    name: string;
  };
  worker: {
    id: string;
    name: string;
  };
  workerAmount: number | null;
  platformFee: number | null;
}

export interface PaymentUserResponse {
  payments: PaymentUser[];
  nextCursor: string | null;
}

export interface PaymentWorkerResponse {
  payments: PaymentWorker[];
  nextCursor: string | null;
}

export interface PaymentAdminResponse {
  payments: PaymentAdmin[];
  nextCursor: string | null;
}

export interface PaymentListQuery {
  limit: number;
  cursor?: string | null;

  search?: string;
  status?: PaymentStatus | 'all';
  fromDate?: string;
  toDate?: string;
}

export interface AdminPaymentListQuery extends PaymentListQuery {
  billType?: BillType | 'all';
  minAmount?: number;
  maxAmount?: number;

  userId?: string;
  workerId?: string;
}
