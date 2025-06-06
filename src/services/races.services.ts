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

export async function saveRace(race: Race): Promise<Race> {
  try {
    const createdRace = await pb.collection("races").create(race);
    return createdRace as unknown as Race;
  } catch (error) {
    console.error("Error saving race:", error);
    throw error;
  }
}
