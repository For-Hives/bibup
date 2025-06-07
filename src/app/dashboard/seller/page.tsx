import type { Event } from "@/models/event.model";
import type { User } from "@/models/user.model";
import type { Bib } from "@/models/bib.model";
import type { Metadata } from "next";

import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { fetchBibsBySeller } from "@/services/bib.services.ts";
import { fetchUserByClerkId } from "@/services/user.services";

export const metadata: Metadata = {
  title: "Seller Dashboard | BibUp",
};

// Helper to get status class string from globals.css
const getBibStatusClass = (status: Bib["status"]): string => {
  switch (status) {
    case "expired":
      return "status-expired";
    case "listed_private":
      return "status-approved"; // Using approved for listed_private but could be different
    case "listed_public":
      return "status-approved"; // Using approved for listed_public
    case "pending_event_verification":
      return "status-pending"; // Also use pending style
    case "pending_validation":
      return "status-pending";
    case "sold":
      return "status-sold";
    case "validation_failed":
      return "status-rejected"; // Using rejected for validation_failed
    case "withdrawn":
      return "status-withdrawn";
    default:
      return "bg-gray-200 text-gray-800"; // Default fallback
  }
};

export default async function SellerDashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { userId: clerkUserId } = auth();
  const clerkUser = await currentUser();

  if (!clerkUserId || !clerkUser) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        Please sign in to view your seller dashboard.
      </div>
    );
  }

  const sellerName =
    clerkUser.firstName ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    "Seller";

  let bibUpUser: null | User = null;
  let listedBibs: (Bib & { expand?: { eventId: Event } })[] = [];

  if (clerkUserId) {
    bibUpUser = await fetchUserByClerkId(clerkUserId);
    listedBibs = (await fetchBibsBySeller(clerkUserId)) as (Bib & {
      expand?: { eventId: Event };
    })[];
  }

  const bibUpBalance = bibUpUser?.bibUpBalance ?? 0;

  const bibStatusFromQuery = searchParams?.bibStatus as string;
  const successMessage =
    searchParams?.success === "true"
      ? `Bib listed successfully! Current status: ${bibStatusFromQuery ? bibStatusFromQuery.replace(/_/g, " ").toUpperCase() : "PENDING VALIDATION"}.`
      : null;
  const errorMessage = searchParams?.error
    ? decodeURIComponent(searchParams.error as string)
    : null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-dark)]">
          Seller Dashboard
        </h1>
      </header>

      <p className="text-xl text-center text-[var(--text-dark)]">
        Welcome, {sellerName}!
      </p>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 mb-6 bg-[var(--success-bg)] text-[var(--success-text)] rounded-lg border border-green-300 text-center">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-lg border border-red-300 text-center">
          Error: {errorMessage}
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Box */}
        <div className="md:col-span-1 bento-box flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-2">
            Your BibUp Balance
          </h2>
          <p className="text-3xl font-bold text-[var(--accent-sporty)]">
            ${bibUpBalance.toFixed(2)}
          </p>
        </div>

        {/* Manage Bib Listings Box (takes more space) */}
        <div className="md:col-span-2 bento-box">
          <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-4">
            Manage Your Bib Listings
          </h2>
          <Link
            className="btn btn-primary w-full md:w-auto mb-6"
            href="/dashboard/seller/list-bib"
          >
            List a New Bib
          </Link>

          <h3 className="text-lg font-semibold text-[var(--text-dark)] mt-6 mb-3">
            Your Listed Bibs:
          </h3>
          {listedBibs.length > 0 ? (
            <ul className="space-y-4">
              {listedBibs.map((bib) => (
                <li
                  className="bg-white p-4 rounded-lg shadow border border-[var(--border-color)]"
                  key={bib.id}
                >
                  <div className="font-semibold text-[var(--primary-pastel)]">
                    {" "}
                    {/* Using primary-pastel for bib name, adjust if needed */}
                    Bib for:{" "}
                    {bib.expand?.eventId?.name ||
                      bib.unlistedEventName ||
                      `Event ID: ${bib.eventId || "N/A"}`}
                  </div>
                  <p className="text-sm text-[var(--text-dark)]">
                    Reg #: {bib.registrationNumber}
                  </p>
                  <p className="text-sm text-[var(--text-dark)]">
                    Price: ${bib.price.toFixed(2)}
                  </p>
                  {bib.originalPrice && (
                    <p className="text-xs text-gray-500">
                      Original: ${bib.originalPrice.toFixed(2)}
                    </p>
                  )}
                  {bib.size && (
                    <p className="text-xs text-gray-500">Size: {bib.size}</p>
                  )}
                  {bib.gender && (
                    <p className="text-xs text-gray-500">
                      Gender: {bib.gender}
                    </p>
                  )}
                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span
                      className={`status-badge ${getBibStatusClass(bib.status)}`}
                    >
                      {bib.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </p>
                  {(bib.status === "pending_validation" ||
                    bib.status === "pending_event_verification" ||
                    bib.status === "listed_public" ||
                    bib.status === "listed_private" ||
                    bib.status === "withdrawn" ||
                    bib.status === "validation_failed") && (
                    <Link
                      className="btn btn-secondary text-xs py-1 px-3 mt-2 inline-block"
                      href={`/dashboard/seller/edit-bib/${bib.id}`}
                    >
                      Edit / Manage
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-dark)]">
              You haven't listed any bibs yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
