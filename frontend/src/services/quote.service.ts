import { QUOTE_API } from '@/constants/apiRoutes/quote.routes';
import type { QuoteFormType } from '@/features/worker/quote/validation/quoteSchema';
import api from '@/lib/api/axios';

const QuoteService = {
  listWorkerQuotes: async (workerId: string) => {
    const res = await api.get(QUOTE_API.BY_ID(workerId));
    return res.data;
  },
  createQuote: async (data: QuoteFormType): Promise<{ message: string }> => {
    const res = await api.post(QUOTE_API.ROOT, data);
    return res.data;
  },
};

export default QuoteService;
