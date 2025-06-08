import type { Event } from '@/models/event.model' // Import Event type

import { getDictionary } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import { fetchApprovedPublicEvents } from '@/services/event.services' // Updated service import
// import EventListClient from "./EventListClient"; // Will address this if client component is complex

export default async function EventsPage() {
	const locale = await getLocale()
	const dictionary = await getDictionary(locale)

	const events: Event[] = await fetchApprovedPublicEvents()

	return (
		<div style={{ padding: '20px' }}>
			<main style={{ maxWidth: '800px', margin: '0 auto' }}>
				<h1 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '2em' }}>{dictionary.events.title}</h1>
				<p style={{ marginBottom: '30px', textAlign: 'center', color: '#666' }}>{dictionary.events.description}</p>
				{events.length > 0 ? (
					<ul style={{ listStyle: 'none', padding: 0 }}>
						{events.map(event => (
							<li
								key={event.id}
								style={{
									border: '1px solid #ccc',
									marginBottom: '15px',
									borderRadius: '5px',
									padding: '10px',
								}}
							>
								<a
									href={`/events/${event.id}`}
									style={{
										textDecoration: 'none',
										fontSize: '1.2em',
										color: '#0070f3',
									}}
								>
									{event.name}
								</a>
								<p>
									<strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
								</p>
								<p>
									<strong>Location:</strong> {event.location}
								</p>
								{/* Add a short description or other relevant info if desired */}
							</li>
						))}
					</ul>
				) : (
					<p style={{ textAlign: 'center' }}>{dictionary.events.noEvents}</p>
				)}
				{/*
          If EventListClient is needed for interactions, its usage would be here.
          For now, focusing on server-rendered list.
          <EventListClient prefetchedEvents={events} />
        */}
			</main>
		</div>
	)
}
