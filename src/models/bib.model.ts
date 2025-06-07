import { Event } from "./event.model";
import { User } from "./user.model";

export interface Bib {
  buyerUserId?: string; // Optional, filled when sold
  eventId: string;
  gender?: "female" | "male" | "unisex";
  id: string;
  originalPrice?: number; // Optional, face value
  price: number; // Selling price
  privateListingToken?: string; // Optional, for private sale links
  registrationNumber: string;
  sellerUserId: string;
  size?: string;
  status:
    | "expired"
    | "listed_private"
    | "listed_public"
    | "pending_validation"
    | "sold"
    | "validation_failed"
    | "withdrawn";
  // Add other relevant bib details here
}
