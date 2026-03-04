import Stripe from "stripe";

import { AddSubscriptionDto } from "@/types/subscription";

export interface VerifySessionType {
  success: boolean;
  transactionId?: string;
  productName?: string;
  amountPaid?: number;
  paymentMethod?: string;
  date?: string;
  type?: string;
  receiptUrl?: string;
}
export interface IPaymentService {
  handleWebhookEvent(event: Stripe.Event): Promise<void>;
  createSubscriptionCheckout(data: AddSubscriptionDto): Promise<string>;
  verifySession(sessionId: string): Promise<VerifySessionType>;
  //   createBookingCheckout(userId: string, bookingId: string, amount: number): Promise<{ url: string }>;
  //   releaseBookingPayment(bookingId: string): Promise<{ success: boolean }>;
}
