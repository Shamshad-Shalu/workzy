import Stripe from "stripe";

import { PaymentAdminDTO, PaymentUserDTO, PaymentWorkerDTO } from "@/dtos/responses/payment.dto";
import { IBooking } from "@/types/booking";
import { BookingCheckoutParams, PaymentListQueryInput, VerifySessionType } from "@/types/payment";
import { AddSubscriptionDto } from "@/types/subscription";
import { IWorker } from "@/types/worker";

export interface IPaymentService {
  handleWebhookEvent(event: Stripe.Event): Promise<void>;
  createSubscriptionCheckout(data: AddSubscriptionDto): Promise<string>;
  verifySession(sessionId: string): Promise<VerifySessionType>;
  createBookingPaymentCheckout(data: BookingCheckoutParams): Promise<string>;
  createStripeConnectLink(worker: IWorker): Promise<string>;
  refundBookingPayment(bookingId: string): Promise<void>;
  createExtraChargeCheckout(data: {
    userId: string;
    booking: IBooking;
    amount: number;
  }): Promise<string>;
  releaseBookingPayment(booking: IBooking): Promise<void>;

  getPayments(
    input: PaymentListQueryInput
  ): Promise<{ payments: PaymentAdminDTO[]; nextCursor: string | null }>;
  getUserPayments(
    userId: string,
    input: PaymentListQueryInput
  ): Promise<{ payments: PaymentUserDTO[]; nextCursor: string | null }>;
  getWorkerPayments(
    workerId: string,
    input: PaymentListQueryInput
  ): Promise<{ payments: PaymentWorkerDTO[]; nextCursor: string | null }>;
}
