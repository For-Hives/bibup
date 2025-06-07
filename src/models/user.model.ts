export interface User {
  id: string; // PocketBase record ID
  clerkId: string; // Unique Clerk ID
  username?: string; // Optional username
  email: string; // User's email address
  firstName?: string; // Optional first name
  lastName?: string; // Optional last name
  profileImageUrl?: string; // Optional profile image URL
  createdAt: string; // Timestamp of user creation
  updatedAt: string; // Timestamp of last user update
}
