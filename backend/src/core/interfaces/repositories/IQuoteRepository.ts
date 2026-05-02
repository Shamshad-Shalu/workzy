import { BaseRepository } from "@/core/abstracts/base.repository";
import { IQuote } from "@/types/quote/quote.entity";

export interface IQuoteRepository extends BaseRepository<IQuote> {}
