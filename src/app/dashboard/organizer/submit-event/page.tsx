import { auth } from '@clerk/nextjs/server';
import { createEvent } from '@/services/event.services';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link'; // Import Link

export const metadata: Metadata = {
  title: 'Submit New Event | Organizer Dashboard | BibUp',
};

// Using Tailwind classes directly for styling this form page
// No more `styles` object

export default async function SubmitEventPage({ // Added searchParams for error display
  searchParams
} : {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {

  async function handleSubmitEvent(formData: FormData) {
    "use server";

    const { userId } = auth();
    if (!userId) {
      throw new Error("You must be logged in to submit an event.");
    }

    const name = formData.get('eventName') as string;
    const dateString = formData.get('eventDate') as string;
    const location = formData.get('eventLocation') as string;
    const participantCountStr = formData.get('eventParticipantCount') as string;

    // Basic server-side validation
    if (!name || !dateString || !location) {
      redirect(`/dashboard/organizer/submit-event?error=${encodeURIComponent("Event Name, Date, and Location are required.")}`);
      return;
    }

    const eventData = {
      name,
      date: new Date(dateString),
      location,
      description: formData.get('eventDescription') as string | undefined,
      participantCount: participantCountStr ? parseInt(participantCountStr, 10) : 0,
    };

    try {
      const newEvent = await createEvent(eventData as any, userId); // `as any` to bypass strict Omit type for now

      if (newEvent) {
        redirect('/dashboard/organizer?success=true');
      } else {
        redirect(`/dashboard/organizer/submit-event?error=${encodeURIComponent("Failed to create event. Please check details.")}`);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      redirect(`/dashboard/organizer/submit-event?error=${encodeURIComponent(message)}`);
    }
  }

  const errorMessage = searchParams?.error ? decodeURIComponent(searchParams.error as string) : null;
  // Success message is typically displayed on the redirect target page (Organizer Dashboard)

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto text-[var(--text-dark)]">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Submit New Event</h1>
      </header>

      {errorMessage && (
        <div className="p-4 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-lg border border-red-300 text-center">
          Error: {errorMessage}
        </div>
      )}

      <form action={handleSubmitEvent} className="space-y-6 bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-xl shadow-lg border border-[var(--border-color)]">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium mb-1">Event Name:</label>
          <input type="text" id="eventName" name="eventName" required
                 className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600" />
        </div>
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium mb-1">Date:</label>
          <input type="date" id="eventDate" name="eventDate" required
                 className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600" />
        </div>
        <div>
          <label htmlFor="eventLocation" className="block text-sm font-medium mb-1">Location:</label>
          <input type="text" id="eventLocation" name="eventLocation" required
                 className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600" />
        </div>
        <div>
          <label htmlFor="eventDescription" className="block text-sm font-medium mb-1">Description:</label>
          <textarea id="eventDescription" name="eventDescription" rows={4}
                    className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600"></textarea>
        </div>
        <div>
          <label htmlFor="eventParticipantCount" className="block text-sm font-medium mb-1">Estimated Participant Count:</label>
          <input type="number" id="eventParticipantCount" name="eventParticipantCount" min="0"
                 className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600" />
        </div>
        <button type="submit" className="btn btn-primary w-full">Submit for Approval</button>
      </form>
      <Link href="/dashboard/organizer" className="block text-center mt-6 text-[var(--accent-sporty)] hover:underline">
        Back to Organizer Dashboard
      </Link>
    </div>
  );
}
