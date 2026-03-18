export const PAYMENT = {
  WEBHOOK_SIGNATURE_MISSING: "Missing Stripe signature header.",
  WEBHOOK_SIGNATURE_INVALID: "Webhook signature verification failed.",

  WEBHOOK_RECEIVED: "Webhook received successfully.",
  PAYMENT_INTENT_CREATED: "Payment intent created successfully.",
  PAYMENT_INTENT_CAPTURED: "Payment captured successfully.",
  PAYMENT_INTENT_CANCELLED: "Payment cancelled successfully.",
  PAYMENT_FAILED: "Payment failed.",
  PAYMENT_SUCCEEDED: "Payment completed successfully.",
  SESSION_CREATED: "Checkout session created successfully.",
  SESSION_EXPIRED: "Checkout session expired.",
  INVALID_EVENT_TYPE: "Unhandled webhook event type.",
  METADATA_MISSING: "Required metadata is missing in payment.",
  REFUND_INITIATED: "Refund initiated successfully.",
  REFUND_FAILED: "Refund failed.",
};
