import dayjs from "dayjs";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import Stripe from "stripe";

import { stripe } from "@/config/stripe";
import {
  BILL_TYPE,
  BOOKING,
  BOOKING_PAYMENT_STATUS,
  BOOKING_STATUS,
  BOOKING_STATUS_MESSAGES,
  CLIENT_URL,
  HTTPSTATUS,
  PAYMENT,
  PAYMENT_PROVIDER,
  PAYMENT_STATUS,
  ROLE,
  SLOT_STATUS,
  STRIPE_ACCOUNT_STATUS,
  SUBSCRIPTION_STATUS,
  WORKER,
} from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { IPaymentRepository } from "@/core/interfaces/repositories/IPaymentRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { ISubscriptionRepository } from "@/core/interfaces/repositories/ISubscriptionRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { ISlotService } from "@/core/interfaces/services/ISlotService";
import { TYPES } from "@/di/types";
import { PaymentAdminDTO, PaymentUserDTO, PaymentWorkerDTO } from "@/dtos/responses/payment.dto";
import { IBooking } from "@/types/booking";
import {
  BookingCheckoutParams,
  PaymentListQuery,
  PaymentListQueryInput,
  VerifySessionType,
} from "@/types/payment";
import { AddSubscriptionDto } from "@/types/subscription";
import { IWorker } from "@/types/worker";
import CustomError from "@/utils/customError";
import { generateTxnCode } from "@/utils/generateTxnCode";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

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
    const { name, workerId, subscriptionId, amount, userId, userName } = data;
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
      title: name,
      userId: new Types.ObjectId(userId),
      workerId: new Types.ObjectId(workerId),
      billType: BILL_TYPE.SUBSCRIPTION,
      referenceId: new Types.ObjectId(subscriptionId),
      amount,
      currency: "inr",
      provider: PAYMENT_PROVIDER.STRIPE,
      status: PAYMENT_STATUS.PENDING,
      userName,
      sessionId: session.id,
    });
    return session.url!;
  }

  async createBookingPaymentCheckout(data: BookingCheckoutParams): Promise<string> {
    const {
      userId,
      bookingId,
      userName,
      workerName,
      amount,
      slotId,
      serviceName,
      platformFee,
      workerId,
      workerAmount,
      workerStripeId,
    } = data;

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
          workerId,
          userId,
        },
      },
      success_url: `${CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/payment/cancelled`,
      metadata: {
        type: "BOOKING",
        bookingId,
        workerId,
        slotId,
        userId,
      },
    });

    await this._paymentRepo.create({
      transactionId: generateTxnCode("TXN"),
      title: serviceName,
      userId: new Types.ObjectId(userId),
      workerId: new Types.ObjectId(workerId),
      workerAmount,
      platformFee,
      billType: BILL_TYPE.BOOKING,
      referenceId: new Types.ObjectId(bookingId),
      status: PAYMENT_STATUS.PENDING,
      amount,
      currency: "inr",
      provider: PAYMENT_PROVIDER.STRIPE,
      sessionId: session.id,
      workerName,
      userName,
    });
    return session.url!;
  }

  async createExtraChargeCheckout(data: {
    userId: string;
    booking: IBooking;
    amount: number;
  }): Promise<string> {
    const { userId, booking, amount } = data;

    const worker = await getEntityOrThrow(
      this._workerRepository,
      booking.workerId.toString(),
      WORKER.NOT_FOUND
    );
    const workerStripeId = worker.stripeAccountId;
    if (!workerStripeId || worker.stripeAccountStatus !== STRIPE_ACCOUNT_STATUS.ACTIVE) {
      throw new CustomError(WORKER.STRIPE_NOT_ACTIVE, HTTPSTATUS.BAD_REQUEST);
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Additional Service Charge" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        transfer_data: {
          destination: workerStripeId,
        },
        metadata: {
          type: "EXTRA_CHARGE",
          bookingId: booking._id.toString(),
          userId,
        },
      },
      success_url: `${CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/payment/cancelled`,
      metadata: {
        type: "EXTRA_CHARGE",
        bookingId: booking._id.toString(),
        userId,
      },
    });
    await this._paymentRepo.create({
      transactionId: generateTxnCode("TXN"),
      title: booking.snapshot.category.name + " - Extra Charge",
      userId: new Types.ObjectId(userId),
      workerId: new Types.ObjectId(booking.workerId),
      billType: BILL_TYPE.EXTRA_CHARGE,
      referenceId: new Types.ObjectId(booking._id.toString()),
      amount,
      currency: "inr",
      provider: PAYMENT_PROVIDER.STRIPE,
      status: PAYMENT_STATUS.PENDING,
      sessionId: session.id,
      userName: booking.snapshot.user.name,
      workerName: booking.snapshot.worker.name,
    });
    return session.url!;
  }

  async releaseBookingPayment(booking: IBooking): Promise<void> {
    const payment = await this._paymentRepo.findOne({
      referenceId: new Types.ObjectId(booking._id.toString()),
      billType: BILL_TYPE.BOOKING,
      status: PAYMENT_STATUS.SUCCEEDED,
    });

    if (!payment) {
      throw new CustomError(PAYMENT.PAYMENT_NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    if (!payment.paymentIntentId) {
      throw new CustomError(PAYMENT.PAYMENT_INTENT_MISSING, HTTPSTATUS.BAD_REQUEST);
    }
    await stripe.paymentIntents.capture(payment.paymentIntentId);
    await this._paymentRepo.findOneAndUpdate(
      { _id: payment._id },
      { status: PAYMENT_STATUS.RELEASED }
    );
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const type = session.metadata?.type;
        if (type === "SUBSCRIPTION") {
          await this.handleSubscriptionPaid(session);
        } else if (type === "BOOKING") {
          await this.handleBookingPaid(session);
        } else if (type === "EXTRA_CHARGE") {
          await this.handleExtraChargePaid(session);
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
        if (session.metadata?.type === "SUBSCRIPTION") {
          await this._handleSubscriptionCheckoutExpired(session);
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

  async refundBookingPayment(bookingId: string): Promise<void> {
    const payment = await this._paymentRepo.findOne({
      referenceId: new Types.ObjectId(bookingId),
      billType: BILL_TYPE.BOOKING,
      status: PAYMENT_STATUS.SUCCEEDED,
    });
    if (!payment) {
      throw new CustomError(PAYMENT.PAYMENT_NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    if (!payment?.paymentIntentId) {
      throw new CustomError(PAYMENT.PAYMENT_INTENT_MISSING, HTTPSTATUS.BAD_REQUEST);
    }
    await stripe.paymentIntents.cancel(payment?.paymentIntentId);

    await this._paymentRepo.findOneAndUpdate(
      { _id: payment._id },
      { status: PAYMENT_STATUS.REFUNDED }
    );
  }

  private async handleExtraChargePaid(session: Stripe.Checkout.Session): Promise<void> {
    const { bookingId } = session.metadata as { bookingId: string };
    const booking = await getEntityOrThrow(this._bookingRepository, bookingId, BOOKING.NOT_FOUND);
    await Promise.all([
      this._bookingRepository.update(bookingId, {
        "extraCharge.status": "approved",
        "extraCharge.respondedAt": new Date(),
        $inc: { total: booking.extraCharge?.amount },
      }),
      this._paymentRepo.findOneAndUpdate(
        { sessionId: session.id },
        {
          status: PAYMENT_STATUS.SUCCEEDED,
          paymentIntentId: session.payment_intent as string,
        }
      ),
    ]);
  }

  private async handleBookingPaid(session: Stripe.Checkout.Session) {
    const metadata = session.metadata as {
      bookingId: string;
      slotId: string;
      workerId: string;
    };
    const { bookingId, slotId, workerId } = metadata;

    await Promise.all([
      this._slotRepository.update(slotId, {
        status: SLOT_STATUS.BOOKED,
        bookingId: new Types.ObjectId(bookingId),
      }),
      this._bookingRepository.update(bookingId, {
        paymentStatus: BOOKING_PAYMENT_STATUS.HELD,
        statusHistory: [
          {
            status: BOOKING_STATUS.PENDING,
            reason: BOOKING_STATUS_MESSAGES.PENDING,
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
      this._workerRepository.findByIdAndUpdate(workerId, { $inc: { jobsOffered: 1 } }),
    ]);
  }

  private async handleSubscriptionPaid(session: Stripe.Checkout.Session) {
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

  private async _handleSubscriptionCheckoutExpired(session: Stripe.Checkout.Session) {
    await this._paymentRepo.findOneAndUpdate(
      { sessionId: session.id },
      { status: PAYMENT_STATUS.CANCELLED }
    );
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

  async getPayments(
    input: PaymentListQueryInput
  ): Promise<{ payments: PaymentAdminDTO[]; nextCursor: string | null }> {
    const query = this.mapToPaymentDTO(input);
    const { payments, nextCursor } = await this._paymentRepo.getPayments(query);
    return {
      payments: PaymentAdminDTO.fromEntities(payments),
      nextCursor,
    };
  }

  async getUserPayments(
    userId: string,
    input: PaymentListQueryInput
  ): Promise<{ payments: PaymentUserDTO[]; nextCursor: string | null }> {
    const query = this.mapToPaymentDTO(input);
    const { payments, nextCursor } = await this._paymentRepo.getPayments({ userId, ...query });
    return { payments: PaymentUserDTO.fromEntities(payments), nextCursor };
  }

  async getWorkerPayments(
    workerId: string,
    input: PaymentListQueryInput
  ): Promise<{ payments: PaymentWorkerDTO[]; nextCursor: string | null }> {
    const query = this.mapToPaymentDTO(input);
    const { payments, nextCursor } = await this._paymentRepo.getPayments({ workerId, ...query });
    return { payments: PaymentWorkerDTO.fromEntities(payments), nextCursor };
  }

  private mapToPaymentDTO(input: PaymentListQueryInput): PaymentListQuery {
    const { cursor, fromDate, toDate, ...rest } = input;
    const fromDateTime = fromDate ? dayjs(fromDate).startOf("day").toDate() : undefined;
    const toDateTime = toDate ? dayjs(toDate).endOf("day").toDate() : undefined;
    return {
      ...rest,
      cursor: cursor
        ? {
            createdAt: new Date(cursor.createdAt),
            _id: cursor.id,
          }
        : undefined,
      fromDate: fromDateTime,
      toDate: toDateTime,
    };
  }
}
