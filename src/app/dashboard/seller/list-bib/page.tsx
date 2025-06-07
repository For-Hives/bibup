import type { Metadata } from "next";

import { getDictionary } from "@/lib/getDictionary";
import { auth } from "@clerk/nextjs/server";
import { getLocale } from "@/lib/getLocale";

import { fetchPartneredApprovedEvents } from "@/services/event.services";

import ListNewBibClientPage from "./client"; // Assuming the client component is in client.tsx

// Metadata can be defined in the Server Component
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  return {
    description: dictionary.dashboard.seller?.listBib?.metadata?.description,
    title: dictionary.dashboard.seller?.listBib?.metadata?.title,
  };
}

// This is the Server Component that wraps the Client Component.
// It fetches data and passes it to the client component.
export default async function ListNewBibServerWrapper({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = await auth(); // Get the authenticated user's ID (Clerk ID)
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  // Fetch partnered events that can be selected in the dropdown
  const partneredEvents = await fetchPartneredApprovedEvents();

  // Render the client component, passing the fetched data as props
  return (
    <ListNewBibClientPage
      dictionary={dictionary}
      initialAuthUserId={userId}
      partneredEvents={partneredEvents}
      searchParams={searchParams}
    />
  );
}
