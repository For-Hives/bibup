import pb from "@/lib/pocketbaseClient";
import { Bib, BibStatus } from "@/models/bib.model";
// import { Race } from "@/models/races.model.ts"; // Not immediately needed for function signatures

/**
 * Registers a new bib for a race.
 * @param bibData - Object containing raceId, sellerUserId, and optional bibNumber.
 * @returns The created Bib object.
 */
export async function registerBib(bibData: {
  raceId: string;
  sellerUserId: string;
  bibNumber?: string;
}): Promise<Bib> {
  try {
    const data = {
      raceId: bibData.raceId,
      sellerUserId: bibData.sellerUserId,
      bibNumber: bibData.bibNumber,
      status: 'registered' as BibStatus, // Initial status
    };
    const record = await pb.collection('bibs').create<Bib>(data);
    return record;
  } catch (error) {
    console.error("Failed to register bib:", error);
    throw error;
  }
}

/**
 * Lists a registered bib for sale.
 * @param bibId - The ID of the bib to list for sale.
 * @param price - The price at which to list the bib.
 * @returns The updated Bib object.
 */
export async function listBibForSale(bibId: string, price: number): Promise<Bib> {
  try {
    if (price <= 0) {
      throw new Error("Price must be a positive number.");
    }
    const data = {
      price: price,
      status: 'listed_for_sale' as BibStatus,
    };
    const record = await pb.collection('bibs').update<Bib>(bibId, data);
    return record;
  } catch (error) {
    console.error(`Failed to list bib ${bibId} for sale:`, error);
    throw error;
  }
}

/**
 * Fetches all bibs for a specific race.
 * @param raceId - The ID of the race.
 * @returns An array of Bib objects.
 */
export async function getBibsForRace(raceId: string): Promise<Bib[]> {
  try {
    const records = await pb.collection('bibs').getFullList<Bib>({
      filter: `raceId = "${raceId}"`,
    });
    return records;
  } catch (error) {
    console.error(`Failed to fetch bibs for race ${raceId}:`, error);
    throw error;
  }
}

/**
 * Fetches all bibs registered by a specific user.
 * @param sellerUserId - The ID of the user who registered the bibs.
 * @returns An array of Bib objects.
 */
export async function getBibsForUser(sellerUserId: string): Promise<Bib[]> {
  try {
    const records = await pb.collection('bibs').getFullList<Bib>({
      filter: `sellerUserId = "${sellerUserId}"`,
    });
    return records;
  } catch (error) {
    console.error(`Failed to fetch bibs for user ${sellerUserId}:`, error);
    throw error;
  }
}

/**
 * Marks a bib as purchased by a buyer.
 * @param bibId - The ID of the bib to purchase.
 * @param buyerUserId - The ID of the user purchasing the bib.
 * @returns The updated Bib object.
 */
export async function purchaseBib(bibId: string, buyerUserId: string): Promise<Bib> {
  try {
    const bibToPurchase = await pb.collection('bibs').getOne<Bib>(bibId);
    if (bibToPurchase.status !== 'listed_for_sale') {
      throw new Error(`Bib ${bibId} is not listed for sale. Current status: ${bibToPurchase.status}`);
    }
    if (!bibToPurchase.price) {
        throw new Error(`Bib ${bibId} does not have a price and cannot be purchased.`);
    }

    const data = {
      buyerUserId: buyerUserId,
      status: 'sold' as BibStatus,
    };
    const record = await pb.collection('bibs').update<Bib>(bibId, data);
    return record;
  } catch (error) {
    console.error(`Failed to purchase bib ${bibId} for user ${buyerUserId}:`, error);
    throw error;
  }
}

/**
 * Updates the status of a bib.
 * @param bibId - The ID of the bib to update.
 * @param status - The new status for the bib.
 * @returns The updated Bib object.
 */
export async function updateBibStatus(bibId: string, status: BibStatus): Promise<Bib> {
  try {
    const data: { status: BibStatus; buyerUserId?: string | null; price?: number | null } = {
      status: status,
    };

    if (status === 'registered') {
        data.buyerUserId = null;
        data.price = null;
    } else if (status === 'listed_for_sale') {
        data.buyerUserId = null;
        // Price should be set via listBibForSale.
        // If this function is used to directly list, the caller must handle price.
        // Consider fetching bib to check if price exists if moving to listed_for_sale.
    }
    // For 'sold' status, buyerUserId should be set by purchaseBib.
    // For 'not_available', no specific fields are changed here by default.

    const record = await pb.collection('bibs').update<Bib>(bibId, data);
    return record;
  } catch (error) {
    console.error(`Failed to update status for bib ${bibId} to ${status}:`, error);
    throw error;
  }
}
