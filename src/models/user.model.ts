export interface User {
  id: string;
  clerkId: string; // For linking to Clerk user
  email: string;
  firstName: string;
  lastName: string;
  bibUpBalance: number; // Default to 0
  roles: Array<'seller' | 'buyer' | 'organizer' | 'admin'>;
  // Add other relevant user profile information here
}
