import { Event } from "./event.model";
import { User } from "./user.model";

export interface Waitlist {
  addedAt: Date; // Should be DateTime
  eventId: string;
  id: string;
  notifiedAt?: Date; // Optional, timestamp
  requestedBibGender?: "female" | "male" | "unisex";
  requestedBibSize?: string;
  userId: string;
  // Add other relevant waitlist details here
}
