import Stripe from "stripe";

import { BookingCheckoutParams, VerifySessionType } from "@/types/payment";
import { AddSubscriptionDto } from "@/types/subscription";
import { IWorker } from "@/types/worker";

export interface IPaymentService {
  handleWebhookEvent(event: Stripe.Event): Promise<void>;
  createSubscriptionCheckout(data: AddSubscriptionDto): Promise<string>;
  verifySession(sessionId: string): Promise<VerifySessionType>;
  createBookingPaymentCheckout(data: BookingCheckoutParams): Promise<string>;
  createStripeConnectLink(worker: IWorker): Promise<string>;
  //   releaseBookingPayment(bookingId: string): Promise<{ success: boolean }>;
}
