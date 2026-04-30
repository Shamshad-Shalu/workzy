import Stripe from "stripe";

import { PaymentAdminDTO, PaymentUserDTO, PaymentWorkerDTO } from "@/dtos/responses/payment.dto";
import { IBooking } from "@/types/booking/booking.entity";
import { PaymentListQueryInput } from "@/types/payment/booking.query";
import { BookingCheckoutParams, VerifySessionType } from "@/types/payment/payment.entity";
import { IWorker } from "@/types/worker/worker.entity";

export interface IPaymentService {
  handleWebhookEvent(event: Stripe.Event): Promise<void>;
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
