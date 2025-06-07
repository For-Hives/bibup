export interface Race {
  id: string; // PocketBase record ID
  name: string;
  date: string; // ISO date string
  location: string;
  description?: string; // Optional
  organizerId?: string; // Optional, linking to users collection
  createdAt: string; // Timestamp
  updatedAt: string; // Timestamp
}

// Ensure all models export their types/interfaces.
// The existing export `export type { Race };` is fine.
