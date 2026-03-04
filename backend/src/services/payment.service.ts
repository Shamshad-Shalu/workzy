import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import Stripe from "stripe";

import { stripe } from "@/config/stripe";
import {
  BILL_TYPE,
  BillingCycle,
  CLIENT_URL,
  PAYMENT_STATUS,
  SUBSCRIPTION_STATUS,
  WORKER,
} from "@/constants";
import { IPaymentRepository } from "@/core/interfaces/repositories/IPaymentRepository";
import { IPlanRepository } from "@/core/interfaces/repositories/IPlanRepository";
import { ISubscriptionRepository } from "@/core/interfaces/repositories/ISubscriptionRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IPaymentService, VerifySessionType } from "@/core/interfaces/services/IPaymentService";
import { TYPES } from "@/di/types";
import { AddSubscriptionDto } from "@/types/subscription";
import { generateTxnCode } from "@/utils/generateTxnCode";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.PaymentRepository) private _paymentRepo: IPaymentRepository,
    @inject(TYPES.SubscriptionRepository) private _subscriptionRepo: ISubscriptionRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.PlanRepository) private _planRepo: IPlanRepository
  ) {}

  async createSubscriptionCheckout(data: AddSubscriptionDto): Promise<string> {
    const { name, workerId, planId, billingCycle, amount } = data;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/payment/cancelled`,
      metadata: {
        type: "SUBSCRIPTION",
        workerId,
        planId,
        billingCycle,
        amount: amount.toString(),
      },
    });
    return session.url!;
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const type = session.metadata?.type;

        if (type === "SUBSCRIPTION") {
          await this._handleSubscriptionPaid(session);
        } else if (type === "BOOKING") {
          this._handleBookingPaid(session);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        await this._handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        if (account.charges_enabled && account.payouts_enabled) {
          await this._workerRepository.findOneAndUpdate(
            { stripeAccountId: account.id },
            { stripeAccountStatus: "active" }
          );
        }
        break;
      }
    }
  }

  async verifySession(sessionId: string): Promise<VerifySessionType> {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.latest_charge", "line_items"],
    });

    const success = session.payment_status === "paid" && session.status === "complete";
    if (!success) return { success: false };
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    const charge = paymentIntent?.latest_charge as Stripe.Charge;
    const lineItem = session.line_items?.data?.[0];

    const type = session.metadata?.type ?? "SUBSCRIPTION";

    return {
      success,
      type, // ← SUBSCRIPTION | BOOKING
      transactionId: paymentIntent?.id ?? session.id,
      productName: lineItem?.description ?? "Payment",
      amountPaid: (session.amount_total ?? 0) / 100,
      paymentMethod:
        session.payment_method_types?.[0] === "card"
          ? "Credit / Debit Card"
          : (session.payment_method_types?.[0] ?? "Card"),
      date: new Date(session.created * 1000).toISOString(),
      receiptUrl: charge?.receipt_url ?? undefined,
    };
  }

  private async _handleSubscriptionPaid(session: Stripe.Checkout.Session) {
    const metadata = session.metadata as {
      workerId: string;
      planId: string;
      billingCycle: BillingCycle;
      amount: string;
    };
    const { workerId, planId, billingCycle, amount } = metadata;

    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);

    const startDate = new Date();
    const expiryDate = this._calcExpiry(startDate, billingCycle);

    const subscription = await this._subscriptionRepo.create({
      workerId: new Types.ObjectId(workerId),
      planId: new Types.ObjectId(planId),
      billingCycle,
      amountPaid: Number(amount),
      status: SUBSCRIPTION_STATUS.ACTIVE,
      startDate,
      expiryDate,
    });

    await this._paymentRepo.create({
      transactionId: generateTxnCode("SUB"),
      userId: worker.userId,
      billType: BILL_TYPE.SUBSCRIPTION,
      referenceId: new Types.ObjectId(subscription._id),
      amount: Number(amount),
      platformFee: 0,
      netAmount: Number(amount),
      status: PAYMENT_STATUS.SUCCEEDED,
      paymentIntentId: session.payment_intent as string,
      stripeCheckoutSessionId: session.id,
    });
  }

  private async _handlePaymentFailed(pi: Stripe.PaymentIntent) {
    const { type, workerId, userId, planId, bookingId } = pi.metadata;

    await this._paymentRepo.create({
      userId: workerId ? new Types.ObjectId(workerId) : new Types.ObjectId(userId),
      billType: type === "SUBSCRIPTION" ? BILL_TYPE.SUBSCRIPTION : BILL_TYPE.BOOKING,
      referenceId: planId ? new Types.ObjectId(planId) : new Types.ObjectId(bookingId),
      amount: pi.amount / 100,
      currency: "inr",
      status: PAYMENT_STATUS.FAILED,
      paymentIntentId: pi.id,
      failureReason: pi.last_payment_error?.message,
    });
  }

  private _calcExpiry(start: Date, cycle: string): Date {
    const d = new Date(start);
    const map: Record<string, () => void> = {
      monthly: () => d.setMonth(d.getMonth() + 1),
      quarterly: () => d.setMonth(d.getMonth() + 3),
      halfYearly: () => d.setMonth(d.getMonth() + 6),
      yearly: () => d.setFullYear(d.getFullYear() + 1),
    };
    map[cycle]?.();
    return d;
  }

  private async _handleBookingPaid(session: Stripe.Checkout.Session) {
    const { userId, bookingId, amount } = session.metadata!;
    const payment = await this._paymentRepo.create({
      transactionId: generateTxnCode("BKG"),
      userId: new Types.ObjectId(userId),
      billType: BILL_TYPE.BOOKING,
      referenceId: new Types.ObjectId(bookingId),
      amount: Number(amount),
      currency: "inr",
      status: PAYMENT_STATUS.PENDING, // ← held
      paymentIntentId: session.payment_intent as string,
      stripeCheckoutSessionId: session.id,
    });
    console.log(payment);

    // await this._bookingRepo.findByIdAndUpdate(bookingId, {
    //     paymentId    : payment._id,
    //     paymentStatus: BOOKING_PAYMENT_STATUS.HELD,
    //     status       : "confirmed",
    // });
  }
}
