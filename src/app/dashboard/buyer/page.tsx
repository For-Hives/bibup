import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchBibsByBuyer } from '@/services/bib.services.ts';
import { fetchUserWaitlists } from '@/services/waitlist.services.ts'; // Import waitlist service
import type { Bib } from '@/models/bib.model';
import type { Waitlist } from '@/models/waitlist.model';
import type { Event } from '@/models/event.model';

export const metadata: Metadata = {
  title: 'Buyer Dashboard | BibUp',
};

// Basic styling (can be refactored)
const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' },
  header: { textAlign: 'center' as const, marginBottom: '30px' },
  welcomeMessage: { fontSize: '1.5em', marginBottom: '20px' },
  section: { marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' },
  sectionTitle: { fontSize: '1.4em', marginBottom: '15px', color: '#333' },
  list: { listStyle: 'none' as const, padding: 0 }, // Generic list style
  listItem: {
    backgroundColor: '#fff', border: '1px solid #ddd', padding: '15px',
    marginBottom: '10px', borderRadius: '5px',
  },
  itemName: { fontSize: '1.1em', fontWeight: 'bold' as const, color: '#0056b3' }, // Generic item name style
  itemDetail: { fontSize: '0.9em', color: '#555', margin: '4px 0' }, // Generic item detail style
  successMessage: {
    padding: '15px', marginBottom: '20px', backgroundColor: '#d4edda',
    color: '#155724', borderRadius: '5px', border: '1px solid #c3e6cb',
    fontSize: '1.1em',
  },
  link: { color: '#0070f3', textDecoration: 'underline'},
};

export default async function BuyerDashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { userId: clerkUserId } = auth();
  const clerkUser = await currentUser();

  if (!clerkUserId || !clerkUser) {
    return <p style={styles.container}>Please sign in to view your buyer dashboard.</p>;
  }

  const buyerName = clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'Buyer';

  let purchasedBibs: (Bib & { expand?: { eventId: Event } })[] = [];
  let userWaitlists: (Waitlist & { expand?: { eventId: Event } })[] = [];

  if (clerkUserId) {
    purchasedBibs = await fetchBibsByBuyer(clerkUserId);
    userWaitlists = await fetchUserWaitlists(clerkUserId);
  }

  const purchaseSuccess = searchParams?.purchase_success === 'true';
  const eventNameForSuccessMsg = searchParams?.event_name ? decodeURIComponent(searchParams.event_name as string) : '';

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Buyer Dashboard</h1>
      </header>

      <p style={styles.welcomeMessage}>Welcome, {buyerName}!</p>

      {purchaseSuccess && eventNameForSuccessMsg && (
        <div style={styles.successMessage}>
          Congratulations! You have successfully purchased the bib for <strong>{eventNameForSuccessMsg}</strong>.
          Your new bib details are listed below.
        </div>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Purchased Bibs</h2>
        {purchasedBibs.length > 0 ? (
          <ul style={styles.list}>
            {purchasedBibs.map((bib) => (
              <li key={bib.id} style={styles.listItem}>
                <div style={styles.itemName}>
                  Bib for: {bib.expand?.eventId?.name || `Event ID: ${bib.eventId}`}
                </div>
                <p style={styles.itemDetail}>Date of Event: {bib.expand?.eventId ? new Date(bib.expand.eventId.date).toLocaleDateString() : 'N/A'}</p>
                <p style={styles.itemDetail}>Price Paid: ${bib.price.toFixed(2)}</p>
                <p style={styles.itemDetail}>Registration Number: {bib.registrationNumber} (Keep this for your records)</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't purchased any bibs yet. <Link href="/events" style={styles.link}>Browse events</Link> to find bibs for sale!</p>
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Waitlist Entries</h2>
        {userWaitlists.length > 0 ? (
          <ul style={styles.list}>
            {userWaitlists.map((waitlistEntry) => (
              <li key={waitlistEntry.id} style={styles.listItem}>
                <div style={styles.itemName}>
                  Event: <Link href={`/events/${waitlistEntry.eventId}`} style={styles.link}>{waitlistEntry.expand?.eventId?.name || `Event ID: ${waitlistEntry.eventId}`}</Link>
                </div>
                <p style={styles.itemDetail}>Date Added to Waitlist: {new Date(waitlistEntry.addedAt).toLocaleDateString()}</p>
                <p style={styles.itemDetail}>Status: {waitlistEntry.notifiedAt ? `Notified on ${new Date(waitlistEntry.notifiedAt).toLocaleDateString()}` : 'Waiting for notification'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You are not currently on any waitlists. <Link href="/events" style={styles.link}>Browse events</Link> to join a waitlist if no bibs are available.</p>
        )}
      </section>
    </div>
  );
}
