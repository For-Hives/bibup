import { fetchApprovedPublicEvents } from "@/services/event.services"; // Updated service import
import type { Event } from "@/models/event.model"; // Import Event type
// import EventListClient from "./EventListClient"; // Will address this if client component is complex

export default async function EventsPage() {
  const events: Event[] = await fetchApprovedPublicEvents();

  return (
    <div style={{ padding: '20px' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2em', marginBottom: '20px', textAlign: 'center' }}>
          Upcoming Events
        </h1>
        {events.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {events.map((event) => (
              <li key={event.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <a href={`/events/${event.id}`} style={{ fontSize: '1.2em', textDecoration: 'none', color: '#0070f3' }}>
                  {event.name}
                </a>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                {/* Add a short description or other relevant info if desired */}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center' }}>No upcoming events found.</p>
        )}
        {/*
          If EventListClient is needed for interactions, its usage would be here.
          For now, focusing on server-rendered list.
          <EventListClient prefetchedEvents={events} />
        */}
      </main>
    </div>
  );
}
