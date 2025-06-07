"use client"; // Required for useState and client-side interactions

// Removed auth import from here as it's server-side
import { createBib, CreateBibData } from '@/services/bib.services.ts'; // createBib is a server action, can be called from client
// Removed fetchPartneredApprovedEvents import from here
import type { Event } from '@/models/event.model';
import { redirect } from 'next/navigation'; // Used by server action
// Removed Metadata import from here
import Link from 'next/link';
import React, { useState, useEffect } from 'react'; // For managing form state

// Metadata can be exported from client components in recent Next.js versions, but often better in server component
// export const metadata: Metadata = {
//   title: 'List a New Bib | Seller Dashboard | BibUp',
// };

// Basic styling (can be refactored)
const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' },
  header: { textAlign: 'center' as const, marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '15px' },
  label: { fontWeight: 'bold' as const, marginBottom: '5px' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' },
  select: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em', backgroundColor: 'white' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95em' },
  checkbox: { width: '16px', height: '16px'},
  button: {
    padding: '12px 20px', backgroundColor: '#0070f3', color: 'white',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1em', marginTop: '10px',
  },
  error: { color: 'red', marginTop: '10px', textAlign: 'center' as const },
  success: { color: 'green', marginTop: '10px', textAlign: 'center' as const },
  link: { color: '#0070f3', textDecoration: 'underline', display: 'block', textAlign: 'center' as const, marginTop: '20px' },
  subtleNote: { fontSize: '0.9em', color: '#555', marginTop: '5px'},
  fieldGroup: { border: '1px dashed #ccc', padding: '15px', borderRadius: '5px', marginTop: '10px'},
};


// Server action defined outside component, or imported if in separate file
// This is the actual server action that will be called by the form.
// It's defined here for clarity but could be in a separate actions.ts file.
async function handleListBibServerAction(formData: FormData, sellerUserIdFromAuth: string | null) {
    "use server"; // This directive ensures this function runs on the server.

    const sellerUserId = sellerUserIdFromAuth;
    if (!sellerUserId) {
      // This should ideally not happen if the page calling this is protected
      // and initialAuthUserId is correctly passed.
      // However, as a safeguard:
      // Option 1: Throw an error
      // throw new Error("User not authenticated.");
      // Option 2: Redirect (less ideal from a pure server action not directly tied to navigation hooks)
      // For now, let's assume this is handled by page/route protection.
      // If we need to redirect, it's better done by the component calling this, based on response.
      // But since form actions can redirect:
      redirect('/dashboard/seller/list-bib?error=User not authenticated');
      return; // Should not be reached if redirect works
    }

    const isNotListedEvent = formData.get('isNotListedEvent') === 'on';
    const priceStr = formData.get('price') as string;
    const originalPriceStr = formData.get('originalPrice') as string;

    // Explicitly type the extended CreateBibData for clarity
    type ExtendedCreateBibData = CreateBibData & {
        unlistedEventName?: string;
        unlistedEventDate?: string;
        unlistedEventLocation?: string;
        isNotListedEvent?: boolean
    };

    let bibData: ExtendedCreateBibData = {
      eventId: formData.get('eventId') as string,
      registrationNumber: formData.get('registrationNumber') as string,
      price: parseFloat(priceStr),
      originalPrice: originalPriceStr ? parseFloat(originalPriceStr) : undefined,
      size: formData.get('size') as string | undefined,
      gender: formData.get('gender') as 'male' | 'female' | 'unisex' | undefined,
      isNotListedEvent: isNotListedEvent,
    };

    if (isNotListedEvent) {
      bibData.unlistedEventName = formData.get('unlistedEventName') as string;
      bibData.unlistedEventDate = formData.get('unlistedEventDate') as string;
      bibData.unlistedEventLocation = formData.get('unlistedEventLocation') as string;
      bibData.eventId = ''; // Ensure eventId is empty for unlisted
      if (!bibData.unlistedEventName || !bibData.unlistedEventDate || !bibData.unlistedEventLocation) {
        redirect(`/dashboard/seller/list-bib?error=${encodeURIComponent("For unlisted events, event name, date, and location are required.")}`);
        return;
      }
    } else {
      if (!bibData.eventId) {
        redirect(`/dashboard/seller/list-bib?error=${encodeURIComponent("Please select a partnered event or check 'My event is not listed'.")}`);
        return;
      }
    }

    if (!bibData.registrationNumber || isNaN(bibData.price) || bibData.price <= 0) {
        redirect(`/dashboard/seller/list-bib?error=${encodeURIComponent("Registration Number and a valid Price are required.")}`);
        return;
    }

    try {
      const newBib = await createBib(bibData, sellerUserId); // createBib needs to handle the new fields

      if (newBib) {
        redirect(`/dashboard/seller?success=true&bibStatus=${newBib.status}`);
      } else {
        redirect(`/dashboard/seller/list-bib?error=${encodeURIComponent("Failed to list bib. Please check details and try again.")}`);
      }
    } catch (error) {
      console.error("Error listing bib:", error);
      let message = "An unexpected error occurred.";
      if (error instanceof Error) message = error.message;
      redirect(`/dashboard/seller/list-bib?error=${encodeURIComponent(message)}`);
    }
}


export default function ListNewBibClientPage({
    searchParams,
    initialAuthUserId,
    partneredEvents
} : {
    searchParams?: { [key: string]: string | string[] | undefined };
    initialAuthUserId: string | null;
    partneredEvents: Event[];
}) {
  const [isNotListedEvent, setIsNotListedEvent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Success message is primarily handled by redirect to dashboard.
  // This local success state isn't currently used but can be for client-side feedback.
  // const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams?.error) {
      setErrorMessage(decodeURIComponent(searchParams.error as string));
    }
    // If a success message needs to be displayed on *this* page after a redirect back to it:
    // if (searchParams?.successClient) {
    //   setSuccessMessage(decodeURIComponent(searchParams.successClient as string));
    // }
  }, [searchParams]);

  // Wrapper for the server action to be used in form's action prop.
  // This is how client components can call server actions.
  const formActionWrapper = (formData: FormData) => {
      setErrorMessage(null); // Clear previous errors on new submission
      // initialAuthUserId is passed from the server component wrapper.
      handleListBibServerAction(formData, initialAuthUserId);
  };

  if (!initialAuthUserId) {
    // This case should be handled by the server wrapper or middleware redirecting to sign-in
    // Displaying something here is a fallback.
    return <p style={styles.container}>User not authenticated. Please sign in.</p>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>List a New Bib for Sale</h1>
      </header>

      {errorMessage && <p style={styles.error}>Error: {errorMessage}</p>}
      {/* {successMessage && <p style={styles.success}>{successMessage}</p>} */}

      <form action={formActionWrapper} style={styles.form}>
        <div>
          <label htmlFor="isNotListedEvent" style={styles.checkboxLabel}>
            <input
              type="checkbox"
              id="isNotListedEvent"
              name="isNotListedEvent"
              checked={isNotListedEvent}
              onChange={(e) => setIsNotListedEvent(e.target.checked)}
              style={styles.checkbox}
            />
            My event is not listed here or is not a BibUp partner.
          </label>
        </div>

        {!isNotListedEvent ? (
          <div>
            <label htmlFor="eventId" style={styles.label}>Event:</label>
            <select id="eventId" name="eventId" required={!isNotListedEvent} style={styles.select} disabled={isNotListedEvent}>
              <option value="">Select a Partnered Event</option>
              {partneredEvents.map(event => (
                <option key={event.id} value={event.id}>{event.name} ({new Date(event.date).toLocaleDateString()})</option>
              ))}
            </select>
            {partneredEvents.length === 0 && <p style={styles.subtleNote}>No partnered events available. You can list your bib by checking the box above.</p>}
          </div>
        ) : (
          <div style={styles.fieldGroup}>
            <p style={styles.subtleNote}>Please provide details for your unlisted event. This will undergo verification.</p>
            <div>
              <label htmlFor="unlistedEventName" style={styles.label}>Event Name (as you know it):</label>
              <input type="text" id="unlistedEventName" name="unlistedEventName" required={isNotListedEvent} style={styles.input} />
            </div>
            <div>
              <label htmlFor="unlistedEventDate" style={styles.label}>Event Date:</label>
              <input type="date" id="unlistedEventDate" name="unlistedEventDate" required={isNotListedEvent} style={styles.input} />
            </div>
            <div>
              <label htmlFor="unlistedEventLocation" style={styles.label}>Event Location (City, State/Country):</label>
              <input type="text" id="unlistedEventLocation" name="unlistedEventLocation" required={isNotListedEvent} style={styles.input} />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="registrationNumber" style={styles.label}>Registration Number / Confirmation ID:</label>
          <input type="text" id="registrationNumber" name="registrationNumber" required style={styles.input} />
        </div>

        <div>
          <label htmlFor="price" style={styles.label}>Selling Price ($):</label>
          <input type="number" id="price" name="price" required min="0.01" step="0.01" style={styles.input} />
        </div>

        <div>
          <label htmlFor="originalPrice" style={styles.label}>Original Price ($) (Optional):</label>
          <input type="number" id="originalPrice" name="originalPrice" min="0.00" step="0.01" style={styles.input} />
        </div>

        <div>
          <label htmlFor="size" style={styles.label}>Size (e.g., S, M, L) (Optional):</label>
          <input type="text" id="size" name="size" style={styles.input} />
        </div>

        <div>
          <label htmlFor="gender" style={styles.label}>Gender (Optional):</label>
          <select id="gender" name="gender" style={styles.select}>
            <option value="">Select Gender (if applicable)</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <p style={styles.subtleNote}>
          By listing this bib, you confirm that you are authorized to sell it and that it adheres to the event organizer's transfer policies. For unlisted events, ensure accuracy as this will be verified.
        </p>

        <button type="submit" style={styles.button}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}>
          List Bib
        </button>
      </form>
      <Link href="/dashboard/seller" style={styles.link}>Back to Seller Dashboard</Link>
    </div>
  );
}
