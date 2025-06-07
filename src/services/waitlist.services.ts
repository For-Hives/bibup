"use server";

import { pb } from "@/lib/pocketbaseClient";
import type { Waitlist } from "@/models/waitlist.model";
import type { Event } from "@/models/event.model"; // For expanding event details

/**
 * Adds a user to the waitlist for a specific event.
 * Prevents duplicate entries.
 * @param eventId The ID of the event.
 * @param userId The ID of the user joining the waitlist.
 * @returns The created waitlist entry, the existing entry if already added, or null on error.
 *          Returns an object with `error: 'already_on_waitlist'` for duplicates.
 */
export async function addToWaitlist(
  eventId: string,
  userId: string
): Promise<(Waitlist & { error?: string }) | null> {
  if (!eventId || !userId) {
    console.error("Event ID and User ID are required to join a waitlist.");
    return null;
  }

  try {
    // Check for existing waitlist entry
    try {
      const existingEntry = await pb.collection('waitlists').getFirstListItem<Waitlist>(
        `userId = "${userId}" && eventId = "${eventId}"`
      );
      if (existingEntry) {
        console.log(`User ${userId} is already on the waitlist for event ${eventId}.`);
        return { ...existingEntry, error: 'already_on_waitlist' };
      }
    } catch (error: any) {
      // PocketBase throws 404 if getFirstListItem finds no record, which is expected if not on waitlist.
      // We only care about other errors here.
      if (error.status !== 404) {
        throw error; // Re-throw unexpected errors
      }
    }

    // Create new waitlist entry
    const dataToCreate: Omit<Waitlist, 'id' | 'addedAt' | 'notifiedAt'> & { addedAt: Date } = {
      eventId: eventId,
      userId: userId,
      addedAt: new Date(),
      // requestedBibSize, requestedBibGender can be added later if needed
    };

    const record = await pb.collection("waitlists").create<Waitlist>(dataToCreate);
    return record;

  } catch (error) {
    console.error(`Error adding user ${userId} to waitlist for event ${eventId}:`, error);
    if (error && typeof error === 'object' && 'message' in error) {
        console.error('PocketBase error details:', error.message);
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            console.error('PocketBase response data:', (error.response as any).data);
        }
    }
    return null;
  }
}

/**
 * Fetches all waitlist entries for a specific user.
 * @param userId The ID of the user whose waitlist entries are to be fetched.
 */
export async function fetchUserWaitlists(userId: string): Promise<(Waitlist & { expand?: { eventId: Event } })[]> {
  if (!userId) {
    console.error("User ID is required to fetch their waitlists.");
    return [];
  }

  try {
    const records = await pb.collection("waitlists").getFullList<Waitlist & { expand?: { eventId: Event } }>({
      filter: `userId = "${userId}"`,
      sort: '-addedAt', // Sort by when they were added, newest first
      expand: 'eventId', // Expand related event details
    });
    return records;
  } catch (error) {
    console.error(`Error fetching waitlists for user ID "${userId}":`, error);
    return [];
  }
}
