import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { stripe } from "@/config/stripe";
import { HTTPSTATUS, STRIPE_WEBHOOK_SECRET } from "@/constants";
import { IPaymentController } from "@/core/interfaces/controllers/IPaymentController";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { TYPES } from "@/di/types";
import CustomError from "@/utils/customError";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(@inject(TYPES.PaymentService) private _paymentService: IPaymentService) {}

  handleWebhook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      throw new CustomError("Missing stripe signature", HTTPSTATUS.BAD_REQUEST);
    }
    const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    await this._paymentService.handleWebhookEvent(event);
    res.status(HTTPSTATUS.OK).json({ recieved: true });
  });

  verifySession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // const{ sessionId} = req.params;
    // const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { sessionId } = req.params;
    const result = await this._paymentService.verifySession(sessionId);
    res.status(HTTPSTATUS.OK).json(result);
  });
}
