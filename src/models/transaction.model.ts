export interface Transaction {
  amount: number; // Total amount paid by buyer
  bibId: string;
  buyerUserId: string;
  id: string;
  paymentIntentId?: string; // For Stripe or other payment processor
  platformFee: number;
  sellerUserId: string;
  status: "claimed" | "failed" | "pending" | "refunded" | "succeeded";
  transactionDate: Date; // Should be DateTime
  // Add other relevant transaction details here
}
