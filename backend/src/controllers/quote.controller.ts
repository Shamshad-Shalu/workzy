import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS, QUOTE, QuoteStatus, ROLE } from "@/constants";
import { IQuoteController } from "@/core/interfaces/controllers/IQuoteController";
import { IQuoteService } from "@/core/interfaces/services/IQuoteService";
import { TYPES } from "@/di/types";
import { CreateQuoteDto, UpdateQuoteDto } from "@/dtos/requests/quote.dto";
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

  updateQuote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { quoteId } = req.params;
    const data = req.body as UpdateQuoteDto;
    const quote = await this._quoteService.updateQuote(workerId, quoteId, data);
    res.status(HTTPSTATUS.OK).json({ message: QUOTE.UPDATED, quote });
  });

  getWorkerQuoteStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let workerId: string;
    if (req.user?.role === ROLE.ADMIN && req.query.workerId) {
      workerId = req.query.workerId as string;
    } else {
      workerId = this.requireWorkerId(req);
    }
    const stats = await this._quoteService.getWorkerQuoteStats(workerId);
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

  listQuotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, workerId } = this.resolveActorIds(req);

    const search = (req.query.search as string) || "";
    const status = (req.query.status as QuoteStatus | "all") ?? ("all" as QuoteStatus);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;
    const { data, nextCursor } = await this._quoteService.listQuotes({
      limit,
      search,
      status,
      cursor: parsedCursor,
      userId,
      workerId,
    });
    res.status(HTTPSTATUS.OK).json({ quotes: data, nextCursor });
  });

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

  private resolveActorIds(req: Request): { userId?: string; workerId?: string } {
    const role = req.user?.role;
    if (role === ROLE.ADMIN) {
      return {
        userId: req.query.userId as string | undefined,
        workerId: req.query.workerId as string | undefined,
      };
    }

    if (role === ROLE.USER) return { userId: this.requireUserId(req) };
    if (role === ROLE.WORKER) return { workerId: this.requireWorkerId(req) };

    return {};
  }
}
