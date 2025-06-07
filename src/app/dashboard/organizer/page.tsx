import type { Event } from "@/models/event.model";
import type { Metadata } from "next";

import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { fetchEventsByOrganizer } from "@/services/event.services";

export const metadata: Metadata = {
  title: "Organizer Dashboard | BibUp",
};

// Helper to get status class string from globals.css
const getEventStatusClass = (status: Event["status"]): string => {
  switch (status) {
    case "approved":
      return "status-approved";
    case "cancelled":
      return "status-expired"; // Using 'expired' style for cancelled
    case "completed":
      return "status-sold"; // Using 'sold' style for completed
    case "pending_approval":
      return "status-pending";
    case "rejected":
      return "status-rejected";
    default:
      return "bg-gray-200 text-gray-800"; // Default fallback
  }
};

export default async function OrganizerDashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-[var(--text-dark)]">
        Please sign in to view your dashboard.
      </div>
    );
  }

  const organizerName =
    user.firstName || user.emailAddresses[0]?.emailAddress || "Organizer";

  let submittedEvents: Event[] = [];
  if (userId) {
    submittedEvents = await fetchEventsByOrganizer(userId);
  }

  const successMessage =
    searchParams?.success === "true"
      ? "Event submitted successfully and is pending approval!"
      : null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 text-[var(--text-dark)]">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
      </header>

      <p className="text-xl text-center">Welcome, {organizerName}!</p>

      {successMessage && (
        <div className="p-4 mb-6 bg-[var(--success-bg)] text-[var(--success-text)] rounded-lg border border-green-300 text-center">
          {successMessage}
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Manage Your Events */}
        <section className="bento-box md:col-span-2">
          {" "}
          {/* Spans two columns on medium screens */}
          <h2 className="text-xl font-semibold mb-4">Manage Your Events</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Submit new events or view your existing event submissions below.
          </p>
          <Link
            className="btn btn-primary mb-6"
            href="/dashboard/organizer/submit-event"
          >
            Submit New Event
          </Link>
          <h3 className="text-lg font-semibold mt-6 mb-3">
            Your Submitted Events:
          </h3>
          {submittedEvents.length > 0 ? (
            <ul className="space-y-4">
              {submittedEvents.map((event) => (
                <li
                  className="bg-white dark:bg-neutral-700 p-4 rounded-lg shadow border border-[var(--border-color)]"
                  key={event.id}
                >
                  <div className="font-semibold text-[var(--primary-pastel)]">
                    {event.name}
                  </div>
                  <p className="text-sm">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">Location: {event.location}</p>
                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span
                      className={`status-badge ${getEventStatusClass(event.status)}`}
                    >
                      {event.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </p>
                  {/* Optional: Link to public page if approved */}
                  {event.status === "approved" && (
                    <Link
                      className="text-xs text-[var(--accent-sporty)] hover:underline mt-1 inline-block"
                      href={`/events/${event.id}`}
                    >
                      View Public Page
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't submitted any events yet.</p>
          )}
        </section>

        {/* Section 2: Partnership & Support */}
        <section className="bento-box">
          <h2 className="text-xl font-semibold mb-4">Partnership & Support</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Interested in becoming a partnered event or need assistance?
          </p>
          <a
            className="btn btn-secondary w-full"
            href="mailto:partners@bibup.com?subject=Partnership Inquiry"
            // style={{backgroundColor: 'var(--secondary-pastel)', color: 'var(--text-dark)'}} // Using btn-secondary now
          >
            Schedule a Meeting / Inquire
          </a>
          <p className="mt-4 text-xs text-center">
            Alternatively, reach out to{" "}
            <a
              className="text-[var(--accent-sporty)] hover:underline"
              href="mailto:support@bibup.com"
            >
              support@bibup.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
