import type { Metadata } from "next";

import { getDictionary } from "@/lib/getDictionary";
import { auth } from "@clerk/nextjs/server";
import { getLocale } from "@/lib/getLocale";
import { redirect } from "next/navigation";
import Link from "next/link"; // Import Link

import { createEvent } from "@/services/event.services";

export const metadata: Metadata = {
  title: "Submit New Event | Organizer Dashboard | BibUp",
};

// Using Tailwind classes directly for styling this form page
// No more `styles` object

export default async function SubmitEventPage({
  // Added searchParams for error display
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);
  async function handleSubmitEvent(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (userId == null) {
      throw new Error("You must be logged in to submit an event.");
    }

    const name = formData.get("eventName") as string;
    const dateString = formData.get("eventDate") as string;
    const location = formData.get("eventLocation") as string;
    const participantCountStr = formData.get("eventParticipantCount") as string;

    // Basic server-side validation
    if (!name || !dateString || !location) {
      redirect(
        `/dashboard/organizer/submit-event?error=${encodeURIComponent("Event Name, Date, and Location are required.")}`,
      );
      return;
    }

    const eventData = {
      participantCount: participantCountStr
        ? parseInt(participantCountStr, 10)
        : 0,
      description: formData.get("eventDescription") as string | undefined,
      date: new Date(dateString),
      location,
      name,
    };

    try {
      const newEvent = await createEvent(eventData as any, userId); // `as any` to bypass strict Omit type for now

      if (newEvent) {
        redirect("/dashboard/organizer?success=true");
      } else {
        redirect(
          `/dashboard/organizer/submit-event?error=${encodeURIComponent("Failed to create event. Please check details.")}`,
        );
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      redirect(
        `/dashboard/organizer/submit-event?error=${encodeURIComponent(message)}`,
      );
    }
  }

  const errorMessage = searchParams?.error
    ? decodeURIComponent(searchParams.error as string)
    : null;
  // Success message is typically displayed on the redirect target page (Organizer Dashboard)

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto text-[var(--text-dark)]">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          {dictionary.dashboard.organizer.submitEvent.title}
        </h1>
      </header>

      {errorMessage && (
        <div className="p-4 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-lg border border-red-300 text-center">
          {dictionary.dashboard.organizer.submitEvent.errorPrefix}{" "}
          {errorMessage}
        </div>
      )}

      <form
        action={handleSubmitEvent}
        className="space-y-6 bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-xl shadow-lg border border-[var(--border-color)]"
      >
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="eventName">
            {dictionary.dashboard.organizer.submitEvent.eventNameLabel}
          </label>
          <input
            className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600"
            id="eventName"
            name="eventName"
            required
            type="text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="eventDate">
            {dictionary.dashboard.organizer.submitEvent.eventDateLabel}
          </label>
          <input
            className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600"
            id="eventDate"
            name="eventDate"
            required
            type="date"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="eventLocation"
          >
            {dictionary.dashboard.organizer.submitEvent.eventLocation}
          </label>
          <input
            className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600"
            id="eventLocation"
            name="eventLocation"
            required
            type="text"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="eventDescription"
          >
            {dictionary.dashboard.organizer.submitEvent.eventDescription}
          </label>
          <textarea
            className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600"
            id="eventDescription"
            name="eventDescription"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="eventParticipantCount"
          >
            {dictionary.dashboard.organizer.submitEvent.participantCount}
          </label>
          <input
            className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--accent-sporty)] focus:border-[var(--accent-sporty)] dark:bg-neutral-700 dark:border-neutral-600"
            id="eventParticipantCount"
            min="0"
            name="eventParticipantCount"
            type="number"
          />
        </div>
        <button className="btn btn-primary w-full" type="submit">
          {dictionary.dashboard.organizer.submitEvent.submit}
        </button>
      </form>
      <Link
        className="block text-center mt-6 text-[var(--accent-sporty)] hover:underline"
        href="/dashboard/organizer"
      >
        {dictionary.dashboard.organizer.submitEvent.backToDashboard}
      </Link>
    </div>
  );
}
