import { CreateQuoteDto } from "@/dtos/requests/quote.dto";
import { QuoteListItemDto, WorkerQuoteStatsDto } from "@/dtos/responses/quote.dto";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { IQuote } from "@/types/quote/quote.entity";
import { QuoteListQuery } from "@/types/quote/quote.query";

export interface IQuoteService {
  createQuote(workerId: string, data: CreateQuoteDto): Promise<IQuote>;
  acceptQuote(userId: string, quoteId: string): Promise<{ url: string }>;
  rejectQuote(userId: string, quoteId: string): Promise<void>;
  listQuotes(query: QuoteListQuery): Promise<CursorPaginatedResult<QuoteListItemDto>>;
  getWorkerQuoteStats(workerId: string): Promise<WorkerQuoteStatsDto>;
}
