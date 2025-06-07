"use client";

import React, { useState, useTransition } from 'react';
import { Bib } from '@/models/bib.model';
import { useUser } from '@clerk/nextjs';
import { purchaseBib } from '@/services/bib.services';
import { useRouter } from 'next/navigation'; // For router.refresh()

interface BibCardProps {
  bib: Bib;
  currentUserId: string | null | undefined; // Passed from server component
}

const BibCard: React.FC<BibCardProps> = ({ bib, currentUserId: serverSideUserId }) => {
  const { user: clerkUser, isSignedIn } = useUser();
  const router = useRouter();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPendingTransition, startTransition] = useTransition();

  // Prefer client-side Clerk user ID if available and different from server-side one, though typically they should match for the logged-in user.
  // This primarily ensures we use the most immediate client-side check for UI interactivity.
  const currentActualUserId = isSignedIn ? clerkUser?.id : serverSideUserId;

  const handlePurchase = async () => {
    if (!currentActualUserId) {
      setError("You must be logged in to purchase a bib.");
      // router.push('/sign-in'); // Optionally redirect to sign-in
      return;
    }

    if (bib.sellerUserId === currentActualUserId) {
      setError("You cannot purchase your own bib.");
      return;
    }

    setIsPurchasing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await purchaseBib(bib.id, currentActualUserId);
      setSuccessMessage("Bib purchased successfully! The page will now refresh.");
      // Disable button and refresh page to reflect the change
      startTransition(() => {
        router.refresh();
      });
      // No need to setIsPurchasing(false) here if the component might unmount or button gets disabled permanently after success for this instance
    } catch (err: any) {
      console.error("Purchase failed:", err);
      setError(err.message || "Failed to purchase bib. Please try again.");
      setIsPurchasing(false); // Allow retry on error
    }
  };

  const canPurchase = bib.status === 'listed_for_sale' &&
                      bib.sellerUserId !== currentActualUserId &&
                      isSignedIn && // Ensure user is signed in based on client-side check
                      !successMessage; // Disable if already successfully purchased in this session

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="p-6">
        {bib.bibNumber && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase mb-2">
            Bib #{bib.bibNumber}
          </span>
        )}
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Price: ${bib.price ? bib.price.toFixed(2) : 'N/A'}
        </h3>

        <div className="mb-4 space-y-1 text-sm text-gray-600">
          <p>Status: <span className={`font-semibold ${bib.status === 'listed_for_sale' ? 'text-green-600' : 'text-gray-500'}`}>{bib.status.replace('_', ' ')}</span></p>
          <p>Seller: <span className="font-mono text-xs">{bib.sellerUserId ? `${bib.sellerUserId.substring(0,5)}...${bib.sellerUserId.substring(bib.sellerUserId.length - 5)}` : 'Unknown'}</span></p>
          {/* For MVP, seller ID is shown. In future, fetch seller username. */}
        </div>

        {canPurchase && (
          <button
            onClick={handlePurchase}
            disabled={isPurchasing || isPendingTransition}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPurchasing || isPendingTransition ? 'Processing...' : 'Buy Bib'}
          </button>
        )}

        {!isSignedIn && bib.status === 'listed_for_sale' && (
           <p className="text-sm text-center text-amber-700 bg-amber-50 p-3 rounded-md">Please <a href="/sign-in" className="font-semibold underline hover:text-amber-800">sign in</a> to purchase.</p>
        )}

        {isSignedIn && bib.sellerUserId === currentActualUserId && bib.status === 'listed_for_sale' && (
          <p className="text-sm text-center text-blue-700 bg-blue-50 p-3 rounded-md">This is your bib listing.</p>
        )}

        {bib.status === 'sold' && (
          <p className="text-sm text-center text-rose-700 bg-rose-50 p-3 rounded-md">This bib has been sold.</p>
        )}

        {successMessage && <p className="mt-3 text-sm text-center text-green-700 bg-green-50 p-3 rounded-md">{successMessage}</p>}
        {error && <p className="mt-3 text-sm text-center text-red-700 bg-red-50 p-3 rounded-md">{error}</p>}
      </div>
    </div>
  );
};

export default BibCard;
