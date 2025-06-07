import type { Event } from "@/models/event.model"; // Adjust path as necessary

import Link from "next/link";

import { fetchApprovedPublicEvents } from "@/services/event.services"; // Adjust path as necessary

interface GroupedEvents {
  [yearMonth: string]: Event[];
}

export default async function CalendarPage() {
  const events: Event[] = await fetchApprovedPublicEvents();

  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.date);
    const yearMonth = date.toLocaleString("default", {
      year: "numeric",
      month: "long",
    });
    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }
    acc[yearMonth].push(event);
    return acc;
  }, {} as GroupedEvents);

  // Sort month keys chronologically if necessary (object keys might not preserve order)
  const sortedMonthKeys = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(`01 ${a}`); // e.g., "01 January 2024"
    const dateB = new Date(`01 ${b}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <header style={{ marginBottom: "30px", textAlign: "center" }}>
        <h1>Events Calendar</h1>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto" }}>
        {sortedMonthKeys.length > 0 ? (
          sortedMonthKeys.map((monthKey) => (
            <section key={monthKey} style={{ marginBottom: "30px" }}>
              <h2
                style={{
                  borderBottom: "2px solid #eee",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                  fontSize: "1.8em",
                }}
              >
                {monthKey}
              </h2>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {groupedEvents[monthKey].map((event) => (
                  <li
                    key={event.id}
                    style={{
                      border: "1px solid #ddd",
                      background: "#f9f9f9",
                      marginBottom: "15px",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    <Link
                      href={`/events/${event.id}`}
                      style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                        fontSize: "1.2em",
                        color: "#0056b3",
                      }}
                    >
                      {event.name}
                    </Link>
                    <p style={{ margin: "5px 0 0" }}>
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p style={{ margin: "5px 0 0" }}>
                      <strong>Location:</strong> {event.location}
                    </p>
                    {event.description && (
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: "0.9em",
                          color: "#555",
                        }}
                      >
                        {event.description.substring(0, 100)}
                        {event.description.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <p style={{ textAlign: "center", fontSize: "1.2em" }}>
            No upcoming events found.
          </p>
        )}
      </main>
    </div>
  );
}

// Optional: Metadata for the page
// import type { Metadata } from 'next'
// export const metadata: Metadata = {
//   title: 'Events Calendar | BibUp',
//   description: 'Browse upcoming race events by month.',
// }
