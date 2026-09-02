import { QUOTE_API } from '@/constants/apiRoutes/quote.routes';
import type { CreateQuoteFormType, EditQuoteFormType } from '@/features/quote';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type { QuoteListQuery, QuoteListResponse, WorkerQuoteStats } from '@/types/quote';

const QuoteService = {
  listQuotes: async (params: QuoteListQuery): Promise<QuoteListResponse> => {
    const res = await api.get<ApiResponse<QuoteListResponse>>(QUOTE_API.ROOT, { params });
    return res.data.data;
  },
  createQuote: async (data: CreateQuoteFormType): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<null>>(QUOTE_API.ROOT, data);
    return { message: res.data.message };
  },
  updateQuote: async (quoteId: string, data: EditQuoteFormType): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(QUOTE_API.BY_ID(quoteId), data);
    return { message: res.data.message };
  },
  acceptQuote: async (quoteId: string): Promise<{ url: string }> => {
    const res = await api.post<ApiResponse<{ url: string }>>(QUOTE_API.ACCEPT(quoteId));
    return res.data.data;
  },
  rejectQuote: async (quoteId: string): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<null>>(QUOTE_API.REJECT(quoteId));
    return { message: res.data.message };
  },
  getWorkerQuoteStats: async (workerId?: string): Promise<WorkerQuoteStats> => {
    const res = await api.get<ApiResponse<WorkerQuoteStats>>(QUOTE_API.WORKER_STATS, {
      params: workerId ? { workerId } : undefined,
    });
    return res.data.data;
  },
};

export default QuoteService;
