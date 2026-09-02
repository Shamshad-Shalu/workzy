import { PAYMENT_API } from '@/constants';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type { PaymentDetails } from '@/types/booking';
import type {
  AdminPaymentListQuery,
  PaymentAdminResponse,
  PaymentListQuery,
  PaymentUserResponse,
  PaymentWorkerResponse,
} from '@/types/payment';

const PaymentService = {
  verifyPayment: async (sessionId: string): Promise<PaymentDetails> => {
    const res = await api.get<ApiResponse<PaymentDetails>>(PAYMENT_API.VERIFY_BY_ID(sessionId));
    return res.data.data;
  },
  getUserPayments: async (query: PaymentListQuery): Promise<PaymentUserResponse> => {
    const res = await api.get<ApiResponse<PaymentUserResponse>>(PAYMENT_API.BY_USER, {
      params: query,
    });
    return res.data.data;
  },
  getWorkerPayments: async (query: PaymentListQuery): Promise<PaymentWorkerResponse> => {
    const res = await api.get<ApiResponse<PaymentWorkerResponse>>(PAYMENT_API.BY_WORKER, {
      params: query,
    });
    return res.data.data;
  },
  getAdminPayments: async (query: AdminPaymentListQuery): Promise<PaymentAdminResponse> => {
    const res = await api.get<ApiResponse<PaymentAdminResponse>>(PAYMENT_API.ROOT, {
      params: query,
    });
    return res.data.data;
  },
};

export default PaymentService;
