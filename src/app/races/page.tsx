import { fetchRaces, saveRace } from "@/services/races.services";
import RaceClient from "./raceClient";

export default async function RacesPage() {
  // keep the data fetching logic on the server side
  const races = await fetchRaces();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-center sm:text-left">
          Page des courses
        </h1>
        <RaceClient prefetchedRaces={races} />
      </main>
    </div>
  );
}
