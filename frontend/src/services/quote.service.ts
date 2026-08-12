import { QUOTE_API } from '@/constants/apiRoutes/quote.routes';
import type { CreateQuoteFormType, EditQuoteFormType } from '@/features/quote';
import api from '@/lib/api/axios';
import type { QuoteListQuery, QuoteListResponse, WorkerQuoteStats } from '@/types/quote';

const QuoteService = {
  listQuotes: async (params: QuoteListQuery): Promise<QuoteListResponse> => {
    const res = await api.get(QUOTE_API.ROOT, { params });
    return res.data;
  },
  createQuote: async (data: CreateQuoteFormType): Promise<{ message: string }> => {
    const res = await api.post(QUOTE_API.ROOT, data);
    return res.data;
  },
  updateQuote: async (quoteId: string, data: EditQuoteFormType): Promise<{ message: string }> => {
    const res = await api.patch(QUOTE_API.BY_ID(quoteId), data);
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
  getWorkerQuoteStats: async (): Promise<WorkerQuoteStats> => {
    const res = await api.get(QUOTE_API.WORKER_STATS);
    return res.data;
  },
};

export default QuoteService;
