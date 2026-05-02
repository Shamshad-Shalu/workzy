import { CreateQuoteDto } from "@/dtos/requests/quote.dto";
import { QuoteResponseDto } from "@/dtos/responses/quote.dto";

export interface IQuoteService {
  // getAvailableDates): Promise<Record<string, boolean>>;
  createQuote(workerId: string, data: CreateQuoteDto): Promise<QuoteResponseDto>;
}
