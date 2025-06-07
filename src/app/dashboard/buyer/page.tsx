import type { Waitlist } from "@/models/waitlist.model";
import type { Event } from "@/models/event.model";
import type { Bib } from "@/models/bib.model";
import type { Metadata } from "next";

import { auth, currentUser } from "@clerk/nextjs/server";
import { getDictionary } from "@/lib/getDictionary";
import { getLocale } from "@/lib/getLocale";
import Link from "next/link";

import { fetchUserWaitlists } from "@/services/waitlist.services"; // Import waitlist service
import { fetchBibsByBuyer } from "@/services/bib.services";

export const metadata: Metadata = {
  title: "Buyer Dashboard | BibUp",
};

// Basic styling (can be refactored)
const styles = {
  successMessage: {
    border: "1px solid #c3e6cb",
    backgroundColor: "#d4edda",
    marginBottom: "20px",
    borderRadius: "5px",
    fontSize: "1.1em",
    color: "#155724",
    padding: "15px",
  },
  section: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #eee",
    marginBottom: "30px",
    borderRadius: "8px",
    padding: "20px",
  },
  listItem: {
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    marginBottom: "10px",
    borderRadius: "5px",
    padding: "15px",
  },
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
  },
  itemName: {
    fontWeight: "bold" as const,
    fontSize: "1.1em",
    color: "#0056b3",
  }, // Generic item name style
  sectionTitle: { marginBottom: "15px", fontSize: "1.4em", color: "#333" },
  itemDetail: { fontSize: "0.9em", margin: "4px 0", color: "#555" }, // Generic item detail style
  header: { textAlign: "center" as const, marginBottom: "30px" },
  welcomeMessage: { marginBottom: "20px", fontSize: "1.5em" },
  link: { textDecoration: "underline", color: "#0070f3" },
  list: { listStyle: "none" as const, padding: 0 }, // Generic list style
};

export default async function BuyerDashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  const { userId: clerkUserId } = await auth();
  const clerkUser = await currentUser();

  if (!clerkUserId ?? !clerkUser) {
    return (
      <p style={styles.container}>{dictionary.dashboard.buyer.pleaseSignIn}</p>
    );
  }

  const buyerName =
    clerkUser.firstName ?? clerkUser.emailAddresses[0]?.emailAddress ?? "Buyer";

  let purchasedBibs: (Bib & { expand?: { eventId: Event } })[] = [];
  let userWaitlists: (Waitlist & { expand?: { eventId: Event } })[] = [];

  if (clerkUserId) {
    purchasedBibs = await fetchBibsByBuyer(clerkUserId);
    userWaitlists = await fetchUserWaitlists(clerkUserId);
  }

  const purchaseSuccess = searchParams?.purchase_success === "true";
  const eventNameForSuccessMsg = searchParams?.event_name
    ? decodeURIComponent(searchParams.event_name as string)
    : "";

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>{dictionary.dashboard.buyer.title}</h1>
      </header>

      <p style={styles.welcomeMessage}>
        {dictionary.dashboard.buyer.welcome}, {buyerName}!
      </p>

      {purchaseSuccess && eventNameForSuccessMsg && (
        <div style={styles.successMessage}>
          {dictionary.dashboard.buyer.purchaseSuccess}{" "}
          <strong>{eventNameForSuccessMsg}</strong>.{" "}
          {dictionary.dashboard.buyer.purchaseSuccessDetails}
        </div>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          {dictionary.dashboard.buyer.myPurchases}
        </h2>
        {purchasedBibs.length > 0 ? (
          <ul style={styles.list}>
            {purchasedBibs.map((bib) => (
              <li key={bib.id} style={styles.listItem}>
                <div style={styles.itemName}>
                  {dictionary.dashboard.buyer.bibForLabel}{" "}
                  {bib.expand?.eventId?.name ?? `Event ID: ${bib.eventId}`}
                </div>
                <p style={styles.itemDetail}>
                  {dictionary.dashboard.buyer.dateOfEvent}{" "}
                  {bib.expand?.eventId
                    ? new Date(bib.expand.eventId.date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p style={styles.itemDetail}>
                  {dictionary.dashboard.buyer.pricePaid} ${bib.price.toFixed(2)}
                </p>
                <p style={styles.itemDetail}>
                  {dictionary.dashboard.buyer.registrationNumber}{" "}
                  {bib.registrationNumber}{" "}
                  {dictionary.dashboard.buyer.keepRecords}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            {dictionary.dashboard.buyer.noPurchases}{" "}
            <Link href="/events" style={styles.link}>
              {dictionary.dashboard.buyer.browseEvents}
            </Link>{" "}
            to find bibs for sale!
          </p>
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          {dictionary.dashboard.buyer.waitlistEntries}
        </h2>
        {userWaitlists.length > 0 ? (
          <ul style={styles.list}>
            {userWaitlists.map((waitlistEntry) => (
              <li key={waitlistEntry.id} style={styles.listItem}>
                <div style={styles.itemName}>
                  {dictionary.dashboard.buyer.eventLabel}{" "}
                  <Link
                    href={`/events/${waitlistEntry.eventId}`}
                    style={styles.link}
                  >
                    {waitlistEntry.expand?.eventId?.name ??
                      `Event ID: ${waitlistEntry.eventId}`}
                  </Link>
                </div>
                <p style={styles.itemDetail}>
                  {dictionary.dashboard.buyer.dateAddedToWaitlist}{" "}
                  {new Date(waitlistEntry.addedAt).toLocaleDateString()}
                </p>
                <p style={styles.itemDetail}>
                  {dictionary.dashboard.buyer.status}{" "}
                  {waitlistEntry.notifiedAt
                    ? `${dictionary.dashboard.buyer.notifiedOn} ${new Date(waitlistEntry.notifiedAt).toLocaleDateString()}`
                    : dictionary.dashboard.buyer.waitingForNotification}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            {dictionary.dashboard.buyer.noWaitlistEntries}{" "}
            <Link href="/events" style={styles.link}>
              {dictionary.dashboard.buyer.browseEventsWaitlist}
            </Link>{" "}
            {dictionary.dashboard.buyer.waitlistJoinText}
          </p>
        )}
      </section>
    </div>
  );
}
