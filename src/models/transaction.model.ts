import { User } from './user.model';
import { Bib } from './bib.model';

export interface Transaction {
  id: string;
  bibId: string;
  buyerUserId: string;
  sellerUserId: string;
  transactionDate: Date; // Should be DateTime
  amount: number; // Total amount paid by buyer
  platformFee: number;
  paymentIntentId?: string; // For Stripe or other payment processor
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'claimed';
  // Add other relevant transaction details here
}
