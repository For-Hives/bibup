import type { Event } from "@/models/event.model";
import type { Bib } from "@/models/bib.model";
import type { Metadata } from "next";

import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { fetchBibById } from "@/services/bib.services.ts";

type BibPurchasePageProps = {
  params: { bibId: string };
  searchParams?: { [key: string]: string | string[] | undefined }; // For error display
};

export default async function BibPurchasePage({
  searchParams,
  params,
}: BibPurchasePageProps) {
  const { userId: currentUserId } = auth();
  const { bibId } = params;

  if (!currentUserId) {
    redirect(`/sign-in?redirect_url=/purchase/${bibId}`);
  }

  const bib = (await fetchBibById(bibId)) as
    | (Bib & { expand?: { eventId: Event } })
    | null;

  if (!bib) {
    notFound();
  }

  const errorMessage = searchParams?.error
    ? decodeURIComponent(searchParams.error as string)
    : null;

  if (bib.status !== "listed_public") {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto text-center text-[var(--text-dark)]">
        <p className="p-4 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-lg border border-red-300">
          This bib is no longer available for purchase (Status: {bib.status}).
        </p>
        <Link
          className="text-[var(--accent-sporty)] hover:underline"
          href="/events"
        >
          Browse other events
        </Link>
      </div>
    );
  }

  if (bib.sellerUserId === currentUserId) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto text-center text-[var(--text-dark)]">
        <p className="p-4 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-lg border border-red-300">
          You cannot purchase your own bib listing.
        </p>
        <Link
          className="text-[var(--accent-sporty)] hover:underline"
          href={`/events/${bib.eventId}`}
        >
          Back to event page
        </Link>
      </div>
    );
  }

  const eventName = bib.expand?.eventId?.name || `Event ID: ${bib.eventId}`;
  const eventDate = bib.expand?.eventId
    ? new Date(bib.expand.eventId.date).toLocaleDateString()
    : "N/A";

  async function handleConfirmPurchase(formData: FormData) {
    "use server";
    if (!currentUserId) {
      redirect(
        `/purchase/${bibId}?error=${encodeURIComponent("User authentication failed. Please sign in again.")}`,
      );
      return;
    }
    const { processBibSale } = await import("@/services/bib.services.ts");
    try {
      const result = await processBibSale(bibId, currentUserId);
      if (result.success && result.transaction) {
        redirect(
          `/dashboard/buyer?purchase_success=true&bib_id=${bibId}&event_name=${encodeURIComponent(eventName)}&transaction_id=${result.transaction.id}`,
        );
      } else {
        redirect(
          `/purchase/${bibId}?error=${encodeURIComponent(result.error || "Purchase failed. Please try again.")}`,
        );
      }
    } catch (error) {
      console.error("Error in handleConfirmPurchase Server Action:", error);
      let message = "An unexpected error occurred during purchase.";
      if (error instanceof Error) message = error.message;
      redirect(`/purchase/${bibId}?error=${encodeURIComponent(message)}`);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto text-[var(--text-dark)]">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Confirm Your Bib Purchase</h1>
      </header>

      {errorMessage && (
        <div className="p-3 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-md border border-red-300 text-center text-sm">
          Error: {errorMessage}
        </div>
      )}

      <div className="bento-box space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--border-color)] pb-3 mb-4">
          Review Bib Details:
        </h2>
        <p>
          <span className="font-semibold">Event:</span> {eventName}
        </p>
        <p>
          <span className="font-semibold">Event Date:</span> {eventDate}
        </p>
        <p>
          <span className="font-semibold">Registration Number:</span> (Provided
          after purchase)
        </p>
        {bib.size && (
          <p>
            <span className="font-semibold">Size:</span> {bib.size}
          </p>
        )}
        {bib.gender && (
          <p>
            <span className="font-semibold">Gender:</span> {bib.gender}
          </p>
        )}

        <div className="text-2xl font-bold text-[var(--accent-sporty)] my-4 text-center">
          Price: ${bib.price.toFixed(2)}
        </div>
      </div>

      <form action={handleConfirmPurchase} className="mt-6">
        <button className="btn btn-primary w-full text-lg py-3" type="submit">
          Confirm & Proceed to Payment (Simulated)
        </button>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        By clicking "Confirm & Proceed", you agree to purchase this bib. Further
        payment processing will be simulated in this version.
      </p>
      <Link
        className="block text-center mt-6 text-[var(--accent-sporty)] hover:underline"
        href={`/events/${bib.eventId}`}
      >
        Cancel and return to event page
      </Link>
    </div>
  );
}

export async function generateMetadata({
  params,
}: BibPurchasePageProps): Promise<Metadata> {
  const bib = await fetchBibById(params.bibId);
  if (!bib) {
    return { title: "Bib Not Found | BibUp" };
  }
  const eventName =
    (bib as Bib & { expand?: { eventId: Event } }).expand?.eventId?.name ||
    "Event";
  return {
    description: `Confirm your purchase for a bib for ${eventName} priced at $${bib.price.toFixed(2)}.`,
    title: `Purchase Bib for ${eventName} | BibUp`,
  };
}
