import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS, QUOTE } from "@/constants";
import { IQuoteController } from "@/core/interfaces/controllers/IQuoteController";
import { IQuoteService } from "@/core/interfaces/services/IQuoteService";
import { TYPES } from "@/di/types";
import { CreateQuoteDto } from "@/dtos/requests/quote.dto";
import CustomError from "@/utils/customError";

@injectable()
export class QuoteController implements IQuoteController {
  constructor(@inject(TYPES.QuoteService) private _quoteService: IQuoteService) {}

  createQuote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    if (!workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const data = req.body as CreateQuoteDto;
    const quote = await this._quoteService.createQuote(workerId, data);
    res.status(HTTPSTATUS.OK).json({ message: QUOTE.CREATED, quote });
  });

  // getAvailableDates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  //   const query = this.parseQuery(req);
  //   const workerId = req.query.workerId as string;
  //   const serviceId = req.query.serviceId as string;
  //   const lat = Number(req.query.lat);
  //   const lng = Number(req.query.lng);

  //   if (!workerId || !serviceId || !lat || !lng) {
  //     throw new CustomError(SLOT.FIELDS_REQUIRED, HTTPSTATUS.BAD_REQUEST);
  //   };
  //   const dates = await this._slotService.getAvailableDates({
  //     ...query,
  //     workerId,
  //     serviceId,
  //     lat,
  //     lng,
  //   });
  //   res.status(HTTPSTATUS.OK).json({ dates });
  // });

  // private parseQuery(req: Request): Omit<GetQuoteAvailableDatesDTO ,"workerId" | "serviceId"> {
  //   const itemCount = req.query.itemCount !== undefined ? Number(req.query.itemCount) : 1;
  //   const startDate = req.query.startDate as string | undefined;
  //   const endDate = req.query.endDate as string | undefined;
  //   return {
  //     itemCount,
  //     startDate,
  //     endDate,
  //   };
  // }
}
