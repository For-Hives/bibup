import type { Metadata } from "next";

import { auth } from "@clerk/nextjs/server";

import { fetchPartneredApprovedEvents } from "@/services/event.services.ts";

import ListNewBibClientPage from "./client"; // Assuming the client component is in client.tsx

// Metadata can be defined in the Server Component
export const metadata: Metadata = {
  description:
    "List your race bib for sale on BibUp. Specify event details, price, and other bib information.",
  title: "List a New Bib | Seller Dashboard | BibUp",
};

// This is the Server Component that wraps the Client Component.
// It fetches data and passes it to the client component.
export default async function ListNewBibServerWrapper({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth(); // Get the authenticated user's ID (Clerk ID)

  // Fetch partnered events that can be selected in the dropdown
  const partneredEvents = await fetchPartneredApprovedEvents();

  // Render the client component, passing the fetched data as props
  return (
    <ListNewBibClientPage
      initialAuthUserId={userId}
      partneredEvents={partneredEvents}
      searchParams={searchParams}
    />
  );
}
