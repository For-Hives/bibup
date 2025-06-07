import { User } from './user.model';
import { Event } from './event.model';

export interface Waitlist {
  id: string;
  userId: string;
  eventId: string;
  requestedBibSize?: string;
  requestedBibGender?: 'male' | 'female' | 'unisex';
  addedAt: Date; // Should be DateTime
  notifiedAt?: Date; // Optional, timestamp
  // Add other relevant waitlist details here
}
