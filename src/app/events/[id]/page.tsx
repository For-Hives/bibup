import { fetchEventById } from '@/services/event.services';
import { fetchPubliclyListedBibsForEvent } from '@/services/bib.services.ts';
import { addToWaitlist } from '@/services/waitlist.services.ts';
import type { Event } from '@/models/event.model';
import type { Bib } from '@/models/bib.model';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';


type EventDetailPageProps = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata( { params }: EventDetailPageProps): Promise<Metadata> {
  const event = await fetchEventById(params.id);
  return {
    title: event ? `${event.name} | Event Details` : 'Event Not Found',
    description: event?.description || 'Details for the event.',
  };
}

export default async function EventDetailPage({ params, searchParams }: EventDetailPageProps) {
  const eventId = params.id;
  const { userId } = auth();

  const event: Event | null = await fetchEventById(eventId);

  if (!event) {
    notFound();
  }

  const publiclyListedBibs: Bib[] = await fetchPubliclyListedBibsForEvent(eventId);

  async function handleJoinWaitlist(formData: FormData) {
    "use server";
    if (!userId) {
      redirect(`/sign-in?redirect_url=/events/${eventId}`);
      return;
    }

    const eventIdFromForm = formData.get('eventId') as string;
    const result = await addToWaitlist(eventIdFromForm, userId);

    if (result && result.error === 'already_on_waitlist') {
      redirect(`/events/${eventIdFromForm}?waitlist_error=already_added`);
    } else if (result) {
      redirect(`/events/${eventIdFromForm}?waitlist_success=true`);
    } else {
      redirect(`/events/${eventIdFromForm}?waitlist_error=failed`);
    }
  }

  const waitlistSuccess = searchParams?.waitlist_success === 'true';
  const waitlistError = searchParams?.waitlist_error;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto text-[var(--text-dark)]">
      <header className="pb-6 mb-6 border-b border-[var(--border-color)]">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-pastel)] mb-2">{event.name}</h1>
        <p className="text-md text-gray-600 dark:text-gray-400"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-md text-gray-600 dark:text-gray-400"><strong>Location:</strong> {event.location}</p>
        {event.description && <p className="mt-4 text-gray-700 dark:text-gray-300">{event.description}</p>}
      </header>

      {waitlistSuccess && (
        <div className="p-3 mb-4 bg-[var(--success-bg)] text-[var(--success-text)] rounded-md border border-green-300 text-center text-sm">
          You've been successfully added to the waitlist for {event.name}! We'll notify you if a bib becomes available.
        </div>
      )}
      {waitlistError && (
        <div className="p-3 mb-4 bg-[var(--error-bg)] text-[var(--error-text)] rounded-md border border-red-300 text-center text-sm">
          {waitlistError === 'already_added'
            ? `You are already on the waitlist for ${event.name}.`
            : 'Failed to add you to the waitlist. Please try again.'}
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--text-dark)]">Bibs Available for this Event</h2>
        {publiclyListedBibs.length > 0 ? (
          <ul className="space-y-4">
            {publiclyListedBibs.map((bib) => (
              <li key={bib.id} className="bento-box flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <div className="text-xl font-bold text-[var(--accent-sporty)]">Price: ${bib.price.toFixed(2)}</div>
                  {bib.originalPrice && <p className="text-xs text-gray-500 dark:text-gray-400">Original Price: ${bib.originalPrice.toFixed(2)}</p>}
                  {bib.size && <p className="text-sm text-gray-600 dark:text-gray-300">Size: {bib.size}</p>}
                  {bib.gender && <p className="text-sm text-gray-600 dark:text-gray-300">Gender: {bib.gender}</p>}
                </div>
                <Link href={`/purchase/${bib.id}`} className="btn btn-primary mt-3 sm:mt-0">
                  Buy Bib
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bento-box text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">No bibs currently listed for resale for this event.</p>
            <form action={handleJoinWaitlist} className="inline-block">
              <input type="hidden" name="eventId" value={eventId} />
              <button type="submit" className="btn btn-waitlist">
                Join Waitlist
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Be notified if a bib becomes available.
            </p>
          </div>
        )}
      </section>

      <Link href="/events" className="block text-center mt-8 text-[var(--accent-sporty)] hover:underline">
        Back to events list
      </Link>
    </div>
  );
}
