import type { Event } from "@/models/event.model";
import type { Bib } from "@/models/bib.model";
import type { Metadata } from "next";

import { notFound, redirect } from "next/navigation";
import { getDictionary } from "@/lib/getDictionary";
import { auth } from "@clerk/nextjs/server";
import { getLocale } from "@/lib/getLocale";
import Link from "next/link";

import { fetchBibById } from "@/services/bib.services";

type BibPurchasePageProps = {
  params: { bibId: string };
  searchParams?: { [key: string]: string | string[] | undefined }; // For error display
};

export default async function BibPurchasePage({
  searchParams,
  params,
}: BibPurchasePageProps) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  const { userId: currentUserId } = await auth();
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
          {dictionary.purchase.errors.bibNotAvailable.replace(
            "{status}",
            bib.status,
          )}
        </p>
        <Link
          className="text-[var(--accent-sporty)] hover:underline"
          href="/events"
        >
          {dictionary.purchase.browseOtherEvents}
        </Link>
      </div>
    );
  }

  if (bib.sellerUserId === currentUserId) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto text-center text-[var(--text-dark)]">
        <p className="p-4 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-lg border border-red-300">
          {dictionary.purchase.errors.cannotPurchaseOwnBib}
        </p>
        <Link
          className="text-[var(--accent-sporty)] hover:underline"
          href={`/events/${bib.eventId}`}
        >
          {dictionary.purchase.backToEventPage}
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
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);

    if (!currentUserId) {
      redirect(
        `/purchase/${bibId}?error=${encodeURIComponent(dictionary.purchase.errors.authFailed)}`,
      );
      return;
    }
    const { processBibSale } = await import("@/services/bib.services");
    try {
      const result = await processBibSale(bibId, currentUserId);
      if (result.success && result.transaction) {
        redirect(
          `/dashboard/buyer?purchase_success=true&bib_id=${bibId}&event_name=${encodeURIComponent(eventName)}&transaction_id=${result.transaction.id}`,
        );
      } else {
        redirect(
          `/purchase/${bibId}?error=${encodeURIComponent(result.error || dictionary.purchase.errors.purchaseFailed)}`,
        );
      }
    } catch (error) {
      console.error("Error in handleConfirmPurchase Server Action:", error);
      let message = dictionary.purchase.errors.unexpectedError;
      if (error instanceof Error) message = error.message;
      redirect(`/purchase/${bibId}?error=${encodeURIComponent(message)}`);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto text-[var(--text-dark)]">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">{dictionary.purchase.title}</h1>
      </header>

      {errorMessage && (
        <div className="p-3 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-md border border-red-300 text-center text-sm">
          {dictionary.purchase.errors.errorPrefix} {errorMessage}
        </div>
      )}

      <div className="bento-box space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--border-color)] pb-3 mb-4">
          {dictionary.purchase.details.title}
        </h2>
        <p>
          <span className="font-semibold">
            {dictionary.purchase.details.event}:
          </span>{" "}
          {eventName}
        </p>
        <p>
          <span className="font-semibold">
            {dictionary.purchase.details.eventDate}:
          </span>{" "}
          {eventDate}
        </p>
        <p>
          <span className="font-semibold">
            {dictionary.purchase.details.registrationNumber}:
          </span>{" "}
          {dictionary.purchase.details.registrationNumberNote}
        </p>
        {bib.size && (
          <p>
            <span className="font-semibold">
              {dictionary.purchase.details.size}:
            </span>{" "}
            {bib.size}
          </p>
        )}
        {bib.gender && (
          <p>
            <span className="font-semibold">
              {dictionary.purchase.details.gender}:
            </span>{" "}
            {bib.gender}
          </p>
        )}

        <div className="text-2xl font-bold text-[var(--accent-sporty)] my-4 text-center">
          {dictionary.purchase.details.price}: ${bib.price.toFixed(2)}
        </div>
      </div>

      <form action={handleConfirmPurchase} className="mt-6">
        <button className="btn btn-primary w-full text-lg py-3" type="submit">
          {dictionary.purchase.confirmButton}
        </button>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        {dictionary.purchase.agreementText}
      </p>
      <Link
        className="block text-center mt-6 text-[var(--accent-sporty)] hover:underline"
        href={`/events/${bib.eventId}`}
      >
        {dictionary.purchase.cancelLink}
      </Link>
    </div>
  );
}

export async function generateMetadata({
  params,
}: BibPurchasePageProps): Promise<Metadata> {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  const bib = await fetchBibById(params.bibId);
  if (!bib) {
    return { title: dictionary.purchase.metadata.notFoundTitle };
  }
  const eventName =
    (bib as Bib & { expand?: { eventId: Event } }).expand?.eventId?.name ||
    "Event";
  return {
    description: dictionary.purchase.metadata.descriptionTemplate
      .replace("{eventName}", eventName)
      .replace("{price}", bib.price.toFixed(2)),
    title: dictionary.purchase.metadata.titleTemplate.replace(
      "{eventName}",
      eventName,
    ),
  };
}
