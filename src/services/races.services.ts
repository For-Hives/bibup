"use server";

import { pb } from "@/lib/pocketbaseClient";
import { Race } from "@/models/races.model";

export async function fetchRaces(): Promise<Race[]> {
  try {
    const records = await pb.collection("races").getFullList();

    // Map
    const races = records.map((record) => record as unknown as Race);

    return races;
  } catch (error) {
    console.error("Error fetching races:", error);
    throw error;
  }
}

/**
 * Fetches a single race by its ID from PocketBase.
 * @param raceId - The ID of the race to fetch.
 * @returns The Race object or null if not found.
 */
export async function fetchRaceById(raceId: string): Promise<Race | null> {
  try {
    const record = await pb.collection('races').getOne<Race>(raceId);
    return record;
  } catch (error: any) {
    if (error.status === 404) {
      console.log(`Race with ID ${raceId} not found.`);
      return null;
    }
    console.error(`Error fetching race by ID ${raceId}:`, error);
    throw error; // Re-throw other errors
  }
}

export async function saveRace(race: Race): Promise<Race> {
  try {
    const createdRace = await pb.collection("races").create(race);
    return createdRace as unknown as Race;
  } catch (error) {
    console.error("Error saving race:", error);
    throw error;
  }
}
