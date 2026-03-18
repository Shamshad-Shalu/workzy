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
} from "@/constants";
import { IPaymentController } from "@/core/interfaces/controllers/IPaymentController";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { TYPES } from "@/di/types";
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
}
