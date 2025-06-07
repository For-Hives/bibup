export type BibStatus = 'registered' | 'listed_for_sale' | 'sold' | 'not_available';

export interface Bib {
  id: string; // PocketBase record ID
  raceId: string; // Linking to the races collection
  sellerUserId: string; // Linking to our users collection via PocketBase ID
  buyerUserId?: string; // Optional, linking to our users collection via PocketBase ID
  bibNumber?: string; // Optional, if the race assigns specific numbers
  price?: number; // Optional, if listed for sale
  status: BibStatus;
  createdAt: string; // Timestamp
  updatedAt: string; // Timestamp
}
