import { injectable } from "inversify";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IQuoteRepository } from "@/core/interfaces/repositories/IQuoteRepository";
import QuoteModel from "@/models/quote.model";
import { IQuote } from "@/types/quote/quote.entity";

@injectable()
export class QuoteRepository extends BaseRepository<IQuote> implements IQuoteRepository {
  constructor() {
    super(QuoteModel);
  }
}
