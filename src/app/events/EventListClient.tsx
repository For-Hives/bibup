"use client";

import type { Event } from "@/models/event.model"; // Updated model import

import { useState } from "react";

// This client component now primarily just displays the events passed to it.
// It could be used for client-side filtering/sorting in the future if needed.
export default function EventListClient({
  prefetchedEvents,
}: {
  prefetchedEvents: Event[];
}) {
  const [events] = useState<Event[]>(prefetchedEvents ?? []);

  // The form for adding new events has been removed as it's more of an admin/organizer feature.
  // The useEffect for fetching has also been removed as data is primarily passed from server component.

  if (!events ?? events.length === 0) {
    return <p>No events to display.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center sm:text-left mb-4">
        Event List (Client Component):
      </h2>
      <ul>
        {events.map((event) => (
          <li
            className="text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)] font-semibold mb-2"
            key={event.id}
          >
            {/* Linking to the event detail page */}
            <a
              className="underline cursor-pointer hover:text-blue-600"
              href={`/events/${event.id}`}
            >
              {event.name}
            </a>
            <p className="text-xs text-gray-600">
              {event.location} - {new Date(event.date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
