import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import Stripe from "stripe";

import { stripe } from "@/config/stripe";
import {
  BILL_TYPE,
  BOOKING_PAYMENT_STATUS,
  BOOKING_STATUS,
  CLIENT_URL,
  PAYMENT_PROVIDER,
  PAYMENT_STATUS,
  ROLE,
  SLOT_STATUS,
  STRIPE_ACCOUNT_STATUS,
  SUBSCRIPTION_STATUS,
} from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { IPaymentRepository } from "@/core/interfaces/repositories/IPaymentRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { ISubscriptionRepository } from "@/core/interfaces/repositories/ISubscriptionRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { ISlotService } from "@/core/interfaces/services/ISlotService";
import { TYPES } from "@/di/types";
import { BookingCheckoutParams, VerifySessionType } from "@/types/payment";
import { AddSubscriptionDto } from "@/types/subscription";
import { IWorker } from "@/types/worker";
import { generateTxnCode } from "@/utils/generateTxnCode";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.PaymentRepository) private _paymentRepo: IPaymentRepository,
    @inject(TYPES.SubscriptionRepository) private _subscriptionRepo: ISubscriptionRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository,
    @inject(TYPES.SlotService) private _slotService: ISlotService
  ) {}

  async createSubscriptionCheckout(data: AddSubscriptionDto): Promise<string> {
    const { name, workerId, subscriptionId, amount, userId } = data;
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
      payment_intent_data: {
        metadata: {
          type: "SUBSCRIPTION",
          workerId,
          subscriptionId,
        },
      },
      success_url: `${CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/payment/cancelled`,
      metadata: {
        type: "SUBSCRIPTION",
        workerId,
        subscriptionId,
      },
    });
    await this._paymentRepo.create({
      transactionId: generateTxnCode("TXN"),
      userId: new Types.ObjectId(userId),
      billType: BILL_TYPE.SUBSCRIPTION,
      referenceId: new Types.ObjectId(subscriptionId),
      amount,
      currency: "inr",
      provider: PAYMENT_PROVIDER.STRIPE,
      status: PAYMENT_STATUS.PENDING,
      sessionId: session.id,
    });
    return session.url!;
  }

  async createBookingPaymentCheckout(data: BookingCheckoutParams): Promise<string> {
    const { userId, bookingId, amount, slotId, serviceName, platformFee, workerStripeId } = data;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: serviceName },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        capture_method: "manual",
        application_fee_amount: platformFee * 100,
        transfer_data: {
          destination: workerStripeId,
        },
        metadata: {
          type: "BOOKING",
          bookingId,
          slotId,
          userId,
        },
      },
      success_url: `${CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/payment/cancelled`,
      metadata: {
        type: "BOOKING",
        bookingId,
        slotId,
        userId,
      },
    });
    await this._paymentRepo.create({
      transactionId: generateTxnCode("TXN"),
      userId: new Types.ObjectId(userId),
      billType: BILL_TYPE.BOOKING,
      referenceId: new Types.ObjectId(bookingId),
      status: BOOKING_PAYMENT_STATUS.PENDING,
      amount,
      currency: "inr",
      provider: PAYMENT_PROVIDER.STRIPE,
      sessionId: session.id,
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
          await this._handleBookingPaid(session);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        await this._handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.type === "BOOKING") {
          await this._handleBookingCheckoutExpired(session);
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        console.log({
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          details_submitted: account.details_submitted,
        });
        if (account.payouts_enabled) {
          await this._workerRepository.findOneAndUpdate(
            { stripeAccountId: account.id },
            { stripeAccountStatus: "active" }
          );
        }
        break;
      }
    }
  }

  async createStripeConnectLink(worker: IWorker): Promise<string> {
    let accountId = worker?.stripeAccountId;
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "AE",
        capabilities: {
          // card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      accountId = account.id;
      await this._workerRepository.update(worker._id, {
        stripeAccountId: accountId,
        stripeAccountStatus: STRIPE_ACCOUNT_STATUS.PENDING,
      });
    }
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${CLIENT_URL}/worker/profile/account?stripe=refresh`,
      return_url: `${CLIENT_URL}/worker/profile/account?stripe=success`,
      type: "account_onboarding",
    });
    return link.url;
  }

  private async _handleBookingPaid(session: Stripe.Checkout.Session) {
    const metadata = session.metadata as {
      bookingId: string;
      slotId: string;
    };
    const { bookingId, slotId } = metadata;

    const [slot, booking, payment] = await Promise.all([
      this._slotRepository.update(slotId, {
        status: SLOT_STATUS.BOOKED,
        bookingId: new Types.ObjectId(bookingId),
      }),
      this._bookingRepository.update(bookingId, {
        paymentStatus: BOOKING_PAYMENT_STATUS.HELD,
        status: BOOKING_STATUS.CONFIRMED,
        statusHistory: [
          {
            status: BOOKING_STATUS.CONFIRMED,
            changedBy: ROLE.USER,
            changedAt: new Date(),
          },
        ],
      }),
      this._paymentRepo.findOneAndUpdate(
        { sessionId: session.id },
        {
          status: PAYMENT_STATUS.SUCCEEDED,
          paymentIntentId: session.payment_intent as string,
        }
      ),
    ]);
    console.log("webhook updated::", { booking, payment, slot });
  }

  private async _handleSubscriptionPaid(session: Stripe.Checkout.Session) {
    const metadata = session.metadata as {
      workerId: string;
      subscriptionId: string;
    };
    const { workerId, subscriptionId } = metadata;
    await Promise.all([
      this._workerRepository.update(workerId, { isPremium: true }),
      this._paymentRepo.findOneAndUpdate(
        { sessionId: session.id },
        {
          status: PAYMENT_STATUS.SUCCEEDED,
          paymentIntentId: session.payment_intent as string,
        }
      ),
      this._subscriptionRepo.findByIdAndUpdate(subscriptionId, {
        status: SUBSCRIPTION_STATUS.ACTIVE,
      }),
    ]);
  }

  async verifySession(sessionId: string): Promise<VerifySessionType> {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.latest_charge", "line_items"],
    });
    const type = session.metadata?.type;
    const success =
      type === "BOOKING"
        ? session.status === "complete"
        : session.payment_status === "paid" && session.status === "complete";
    if (!success) return { success: false };
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    const charge = paymentIntent?.latest_charge as Stripe.Charge;
    const lineItem = session.line_items?.data?.[0];

    return {
      success,
      type,
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

  private async _handlePaymentFailed(pi: Stripe.PaymentIntent) {
    const { type, bookingId, userId, subscriptionId, slotId } = pi.metadata;
    if (type === "BOOKING" && bookingId) {
      await Promise.all([
        this._bookingRepository.update(bookingId, {
          paymentStatus: BOOKING_PAYMENT_STATUS.FAILED,
          status: BOOKING_STATUS.CANCELLED,
        }),
        this._paymentRepo.findOneAndUpdate(
          { referenceId: new Types.ObjectId(bookingId), billType: BILL_TYPE.BOOKING },
          {
            status: PAYMENT_STATUS.FAILED,
            paymentIntentId: pi.id,
            failureReason: pi.last_payment_error?.message,
          }
        ),
        ...(slotId && userId ? [this._slotService.releaseSlot(slotId, userId)] : []),
      ]);
      return;
    }
    if (type === "SUBSCRIPTION" && subscriptionId) {
      await Promise.all([
        this._subscriptionRepo.findByIdAndUpdate(subscriptionId, {
          status: SUBSCRIPTION_STATUS.FAILED,
        }),
        this._paymentRepo.findOneAndUpdate(
          { referenceId: new Types.ObjectId(subscriptionId), billType: BILL_TYPE.SUBSCRIPTION },
          {
            status: PAYMENT_STATUS.FAILED,
            paymentIntentId: pi.id,
            failureReason: pi.last_payment_error?.message,
          }
        ),
      ]);
      return;
    }
  }

  private async _handleBookingCheckoutExpired(session: Stripe.Checkout.Session) {
    const { bookingId, slotId, userId } = session.metadata as {
      bookingId: string;
      slotId: string;
      userId: string;
    };

    await Promise.all([
      this._bookingRepository.update(bookingId, {
        paymentStatus: BOOKING_PAYMENT_STATUS.CANCELLED,
        status: BOOKING_STATUS.CANCELLED,
      }),
      this._paymentRepo.findOneAndUpdate(
        { sessionId: session.id },
        { status: PAYMENT_STATUS.CANCELLED }
      ),
      ...(slotId && userId ? [this._slotService.releaseSlot(slotId, userId)] : []),
    ]);
  }
}
