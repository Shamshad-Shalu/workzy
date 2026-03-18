



export interface PaymentDetails {
  success: boolean;
  type: string;
  transactionId: string;
  productName: string;
  amountPaid: number;
  paymentMethod: string;
  date: string;
  receiptUrl?: string;
}