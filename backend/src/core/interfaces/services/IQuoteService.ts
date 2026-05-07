import { CreateQuoteDto } from "@/dtos/requests/quote.dto";
import {
  QuoteResponseDto,
  QuoteResponseListDto,
  WorkerQuoteStatsDto,
} from "@/dtos/responses/quote.dto";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { QuoteListQuery } from "@/types/quote/quote.query";

export interface IQuoteService {
  createQuote(workerId: string, data: CreateQuoteDto): Promise<QuoteResponseDto>;
  getWokerQuoteStats(workerId: string): Promise<WorkerQuoteStatsDto>;
  listWorkerQuotes(
    workerId: string,
    query: QuoteListQuery
  ): Promise<CursorPaginatedResult<QuoteResponseListDto>>;
  listUserQuotes(
    userId: string,
    query: QuoteListQuery
  ): Promise<CursorPaginatedResult<QuoteResponseListDto>>;
  acceptQuote(userId: string, quoteId: string): Promise<{ url: string }>;
  rejectQuote(userId: string, quoteId: string): Promise<void>;
}
