import { BaseRepository } from "@/core/abstracts/base.repository";
import { WorkerQuoteStatsDto } from "@/dtos/responses/quote.dto";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { IQuote } from "@/types/quote/quote.entity";
import { QuoteListItem } from "@/types/quote/quote.projection";
import { QuoteListQuery } from "@/types/quote/quote.query";

export interface IQuoteRepository extends BaseRepository<IQuote> {
  listQuotes(query: QuoteListQuery): Promise<CursorPaginatedResult<QuoteListItem>>;
  getWorkerQuoteStats(workerId: string): Promise<WorkerQuoteStatsDto>;
  expireQuotes(): Promise<number>;
}
