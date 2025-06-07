import { auth } from '@clerk/nextjs/server';
import { fetchBibByIdForSeller, updateBibBySeller, UpdateBibData } from '@/services/bib.services.ts';
import type { Bib } from '@/models/bib.model';
import type { Event } from '@/models/event.model';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

type EditBibPageProps = {
  params: { bibId: string };
  searchParams?: { [key: string]: string | string[] | undefined }; // For reading query params
};

// Helper to get status class string from globals.css
const getBibStatusClass = (status: Bib['status']): string => {
  switch (status) {
    case 'pending_validation': return 'status-pending';
    case 'pending_event_verification': return 'status-pending';
    case 'listed_public': return 'status-approved';
    case 'listed_private': return 'status-approved';
    case 'sold': return 'status-sold';
    case 'validation_failed': return 'status-rejected';
    case 'expired': return 'status-expired';
    case 'withdrawn': return 'status-withdrawn';
    default: return 'bg-gray-200 text-gray-800';
  }
};


export async function generateMetadata({ params }: EditBibPageProps): Promise<Metadata> {
  return {
    title: `Edit Bib ${params.bibId} | Seller Dashboard | BibUp`,
  };
}

export default async function EditBibPage({ params, searchParams }: EditBibPageProps) {
  const { userId: sellerUserId } = auth();
  const { bibId } = params;

  if (!sellerUserId) {
    redirect(`/sign-in?redirect_url=/dashboard/seller/edit-bib/${bibId}`);
  }

  const bibWithEvent = await fetchBibByIdForSeller(bibId, sellerUserId);

  if (!bibWithEvent) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto text-center text-[var(--text-dark)]">
        <p className="p-4 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-lg border border-red-300">
            Bib not found or you do not have permission to edit it.
        </p>
        <Link href="/dashboard/seller" className="text-[var(--accent-sporty)] hover:underline">
          Back to Seller Dashboard
        </Link>
      </div>
    );
  }

  const eventName = bibWithEvent.expand?.eventId?.name || bibWithEvent.unlistedEventName || `Event ID: ${bibWithEvent.eventId || 'N/A'}`;
  const successMessage = searchParams?.success ? decodeURIComponent(searchParams.success as string) : null;
  const errorMessage = searchParams?.error ? decodeURIComponent(searchParams.error as string) : null;

  async function handleUpdateBibDetails(formData: FormData) {
    "use server";
    const dataToUpdate: UpdateBibData = {
      price: parseFloat(formData.get('price') as string),
      originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined,
      size: formData.get('size') as string | undefined,
      gender: formData.get('gender') as Bib['gender'] | undefined,
    };

    if (isNaN(dataToUpdate.price!) || dataToUpdate.price! <= 0) {
        redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent("Valid price is required.")}`);
        return;
    }

    const updatedBib = await updateBibBySeller(bibId, dataToUpdate, sellerUserId!);
    if (updatedBib) {
      redirect(`/dashboard/seller/edit-bib/${bibId}?success=${encodeURIComponent("Bib details updated successfully!")}`);
    } else {
      redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent("Failed to update bib details.")}`);
    }
  }

  async function handleWithdrawBib() {
    "use server";
    const updatedBib = await updateBibBySeller(bibId, { status: 'withdrawn' }, sellerUserId!);
    if (updatedBib) {
      redirect(`/dashboard/seller?success=${encodeURIComponent("Bib listing withdrawn.")}&bibStatus=withdrawn`);
    } else {
      redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent("Failed to withdraw bib.")}`);
    }
  }

  async function handleToggleListingStatus(newStatus: 'listed_public' | 'listed_private') {
    "use server";
    if (bibWithEvent?.status === 'pending_validation' && newStatus === 'listed_public') {
      // Allow this. Future: check if admin approved.
    } else if (bibWithEvent?.status === 'pending_event_verification' && newStatus === 'listed_public') {
        redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent(`Cannot make public until event details are verified by admin.`)}`);
        return;
    }
     else if (bibWithEvent?.status !== 'listed_public' && bibWithEvent?.status !== 'listed_private' && bibWithEvent?.status !== 'withdrawn' && bibWithEvent?.status !== 'pending_validation') {
        redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent(`Cannot change listing status from ${bibWithEvent?.status}.`)}`);
        return;
    }

    const updatedBib = await updateBibBySeller(bibId, { status: newStatus }, sellerUserId!);
    if (updatedBib) {
      redirect(`/dashboard/seller/edit-bib/${bibId}?success=${encodeURIComponent(`Bib status changed to ${newStatus.replace('_', ' ')}.`)}`);
    } else {
      redirect(`/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent("Failed to change bib status.")}`);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto text-[var(--text-dark)]">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Edit Bib Listing</h1>
        <p className="text-md mt-1"><strong>Event:</strong> {eventName}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Reg #:</strong> {bibWithEvent.registrationNumber}</p>
      </header>

      {successMessage && (
        <div className="p-3 mb-4 bg-[var(--success-bg)] text-[var(--success-text)] rounded-md border border-green-300 text-center text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 mb-4 bg-[var(--error-bg)] text-[var(--error-text)] rounded-md border border-red-300 text-center text-sm">
          Error: {errorMessage}
        </div>
      )}

      <div className="bento-box mb-8"> {/* Using bento-box for the form container */}
        <form action={handleUpdateBibDetails} className="space-y-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">Selling Price ($):</label>
            <input type="number" id="price" name="price" defaultValue={bibWithEvent.price} required min="0.01" step="0.01"
                   className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600" />
          </div>
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium mb-1">Original Price ($) (Optional):</label>
            <input type="number" id="originalPrice" name="originalPrice" defaultValue={bibWithEvent.originalPrice || ''} min="0.00" step="0.01"
                   className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600" />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium mb-1">Size (Optional):</label>
            <input type="text" id="size" name="size" defaultValue={bibWithEvent.size || ''}
                   className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600" />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender (Optional):</label>
            <select id="gender" name="gender" defaultValue={bibWithEvent.gender || ''}
                    className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full">Save Changes</button>
        </form>
      </div>

      <div className="bento-box">
        <h2 className="text-lg font-semibold mb-3">Manage Listing Status</h2>
        <p className="text-sm mb-3">Current Status:
          <span className={`status-badge ${getBibStatusClass(bibWithEvent.status)} ml-2`}>
            {bibWithEvent.status.replace(/_/g, ' ').toUpperCase()}
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          <form action={handleWithdrawBib}>
            <button type="submit" className="btn btn-withdraw"
              disabled={bibWithEvent.status === 'sold' || bibWithEvent.status === 'withdrawn' || bibWithEvent.status === 'expired'}>
              Withdraw Listing
            </button>
          </form>

          {(bibWithEvent.status === 'listed_private' || bibWithEvent.status === 'pending_validation' || bibWithEvent.status === 'withdrawn') && bibWithEvent.status !== 'pending_event_verification' && (
              <form action={() => handleToggleListingStatus('listed_public')}>
                  <button type="submit" className="btn btn-secondary bg-green-500 hover:bg-green-600 text-white">Make Public</button>
              </form>
          )}

          {bibWithEvent.status === 'listed_public' && (
              <form action={() => handleToggleListingStatus('listed_private')}>
                  <button type="submit" className="btn btn-secondary bg-purple-500 hover:bg-purple-600 text-white">Make Private</button>
              </form>
          )}
        </div>
         {bibWithEvent.status === 'pending_event_verification' && (
            <p className="text-xs text-orange-600 mt-2">This bib cannot be made public until event details are verified by an admin.</p>
        )}
      </div>

      <Link href="/dashboard/seller" className="block text-center mt-8 text-[var(--accent-sporty)] hover:underline">
        Back to Seller Dashboard
      </Link>
    </div>
  );
}
