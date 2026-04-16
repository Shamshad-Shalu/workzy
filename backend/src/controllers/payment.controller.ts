import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";
import Stripe from "stripe";

import logger from "@/config/logger";
import { stripe } from "@/config/stripe";
import {
  HTTPSTATUS,
  STRIPE_WEBHOOK_SECRET,
  STRIPE_CONNECT_WEBHOOK_SECRET,
  PAYMENT,
  PaymentStatus,
  BillType,
  AUTH,
} from "@/constants";
import { IPaymentController } from "@/core/interfaces/controllers/IPaymentController";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { TYPES } from "@/di/types";
import { PaymentListQueryInput } from "@/types/payment";
import CustomError from "@/utils/customError";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(@inject(TYPES.PaymentService) private _paymentService: IPaymentService) {}

  handleWebhook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    if (typeof sig !== "string") {
      throw new CustomError(PAYMENT.WEBHOOK_SIGNATURE_MISSING, HTTPSTATUS.BAD_REQUEST);
    }
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_CONNECT_WEBHOOK_SECRET);
      } catch (err: unknown) {
        if (err instanceof Error) {
          logger.error(`${PAYMENT.WEBHOOK_SIGNATURE_INVALID}:${err.message}`);
        }
        throw new CustomError(PAYMENT.WEBHOOK_SIGNATURE_INVALID, HTTPSTATUS.BAD_REQUEST);
      }
    }
    await this._paymentService.handleWebhookEvent(event);
    res.status(HTTPSTATUS.OK).json({ received: true });
  });

  verifySession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;
    const result = await this._paymentService.verifySession(sessionId);
    res.status(HTTPSTATUS.OK).json(result);
  });

  getPayments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = this.parseQuery(req);
    const userId = req.query.userId as string | undefined;
    const workerId = req.query.workerId as string | undefined;
    const { nextCursor, payments } = await this._paymentService.getPayments({
      userId,
      workerId,
      ...query,
    });
    res.status(HTTPSTATUS.OK).json({ payments, nextCursor });
  });

  getUserPayments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
    const query = this.parseQuery(req);
    const { nextCursor, payments } = await this._paymentService.getUserPayments(userId, query);
    res.status(HTTPSTATUS.OK).json({ payments, nextCursor });
  });

  getWorkerPayments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    if (!workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
    const query = this.parseQuery(req);
    const { nextCursor, payments } = await this._paymentService.getWorkerPayments(workerId, query);
    res.status(HTTPSTATUS.OK).json({ payments, nextCursor });
  });

  private parseQuery(req: Request): PaymentListQueryInput {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;

    return {
      limit,
      status: (req.query.status as PaymentStatus) ?? ("all" as PaymentStatus),
      billType: (req.query.billType as BillType) || "all",
      minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
      maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
      search: (req.query.search as string) ?? "",
      cursor: parsedCursor,
      fromDate: req.query.fromDate as string | undefined,
      toDate: req.query.toDate as string | undefined,
    };
  }
}
