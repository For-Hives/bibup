import { User } from './user.model';

export interface Event {
  id: string;
  name: string;
  date: Date; // Should be DateTime
  location: string;
  description?: string;
  organizerId: User['id']; // References a User ID
  status: 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  isPartnered: boolean; // Defaults to false
  participantCount: number;
  bibsSold: number; // For KPI
  // Add other relevant event details here
}
