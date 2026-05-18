import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS, QUOTE, QuoteStatus } from "@/constants";
import { IQuoteController } from "@/core/interfaces/controllers/IQuoteController";
import { IQuoteService } from "@/core/interfaces/services/IQuoteService";
import { TYPES } from "@/di/types";
import { CreateQuoteDto } from "@/dtos/requests/quote.dto";
import { QuoteListQuery } from "@/types/quote/quote.query";
import CustomError from "@/utils/customError";

@injectable()
export class QuoteController implements IQuoteController {
  constructor(@inject(TYPES.QuoteService) private _quoteService: IQuoteService) {}

  createQuote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const data = req.body as CreateQuoteDto;
    const quote = await this._quoteService.createQuote(workerId, data);
    res.status(HTTPSTATUS.OK).json({ message: QUOTE.CREATED, quote });
  });

  listWorkerQuotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const query = this.parseQuery(req);

    const { data, nextCursor } = await this._quoteService.listWorkerQuotes(workerId, query);
    res.status(HTTPSTATUS.OK).json({ quotes: data, nextCursor });
  });

  getWokerQuoteStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const stats = await this._quoteService.getWokerQuoteStats(workerId);
    res.status(HTTPSTATUS.OK).json(stats);
  });

  acceptQuote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const { quoteId } = req.params;
    const { url } = await this._quoteService.acceptQuote(userId, quoteId);
    res.status(HTTPSTATUS.OK).json({ url });
  });

  rejectQuote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const { quoteId } = req.params;
    await this._quoteService.rejectQuote(userId, quoteId);
    res.status(HTTPSTATUS.OK).json({ message: QUOTE.REJECTED });
  });

  listUserQuotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const query = this.parseQuery(req);
    const { data, nextCursor } = await this._quoteService.listUserQuotes(userId, query);
    res.status(HTTPSTATUS.OK).json({ quotes: data, nextCursor });
  });

  private parseQuery(req: Request): QuoteListQuery {
    const search = (req.query.search as string) || "";
    const status = (req.query.status as QuoteStatus | "all") ?? ("all" as QuoteStatus);
    const limit = parseInt(req.query.limit as string) || 10;
    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;

    return {
      limit,
      search,
      status,
      cursor: parsedCursor
        ? { _id: parsedCursor._id, createdAt: new Date(parsedCursor.createdAt) }
        : undefined,
    };
  }

  private requireWorkerId(req: Request): string {
    if (!req.user?.workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.workerId;
  }

  private requireUserId(req: Request): string {
    if (!req.user?.id) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.id;
  }
}
