import { QUOTE_API } from '@/constants/apiRoutes/quote.routes';
import type { QuoteFormType } from '@/features/worker/quote/validation/quoteSchema';
import api from '@/lib/api/axios';
import type { QuoteListQuery, QuoteListResponse, WorkerQuoteStats } from '@/types/quote';

const QuoteService = {
  listQuotes: async (params: QuoteListQuery): Promise<QuoteListResponse> => {
    const res = await api.get(QUOTE_API.ROOT, { params });
    return res.data;
  },
  createQuote: async (data: QuoteFormType): Promise<{ message: string }> => {
    const res = await api.post(QUOTE_API.ROOT, data);
    return res.data;
  },
  acceptQuote: async (quoteId: string): Promise<{ url: string }> => {
    const res = await api.post(QUOTE_API.ACCEPT(quoteId));
    return res.data;
  },
  rejectQuote: async (quoteId: string): Promise<{ message: string }> => {
    const res = await api.post(QUOTE_API.REJECT(quoteId));
    return res.data;
  },
  listWorkerQuotes: async (params: QuoteListQuery): Promise<QuoteListResponse> => {
    const res = await api.get(QUOTE_API.BY_WORKER, { params });
    return res.data;
  },
  listUserQuotes: async (params: QuoteListQuery): Promise<QuoteListResponse> => {
    const res = await api.get(QUOTE_API.BY_USER, { params });
    return res.data;
  },
  getWokerQuoteStats: async (): Promise<WorkerQuoteStats> => {
    const res = await api.get(QUOTE_API.WORKER_STATS);
    return res.data;
  },
};

export default QuoteService;
