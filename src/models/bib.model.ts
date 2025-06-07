import { User } from './user.model';
import { Event } from './event.model';

export interface Bib {
  id: string;
  eventId: string;
  sellerUserId: string;
  buyerUserId?: string; // Optional, filled when sold
  price: number; // Selling price
  originalPrice?: number; // Optional, face value
  registrationNumber: string;
  status: 'pending_validation' | 'listed_public' | 'listed_private' | 'sold' | 'validation_failed' | 'expired' | 'withdrawn';
  privateListingToken?: string; // Optional, for private sale links
  size?: string;
  gender?: 'male' | 'female' | 'unisex';
  // Add other relevant bib details here
}
