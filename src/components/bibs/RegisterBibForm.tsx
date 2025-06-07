"use client";

import React, { useState, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { registerBib } from '@/services/bib.services';

interface RegisterBibFormProps {
  raceIdParam?: string; // Race ID from server component if not using useSearchParams directly
  sellerAppUserId: string; // PocketBase user ID
  clerkUserId: string; // Clerk User ID (for potential future use or consistency)
}

const RegisterBibFormInner: React.FC<RegisterBibFormProps> = ({ raceIdParam, sellerAppUserId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Prefer raceId from prop, fallback to searchParams if prop isn't provided.
  const raceId = raceIdParam || searchParams.get('raceId');

  const [bibNumber, setBibNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (!raceId) {
      setError("Race ID is missing. Cannot register bib.");
      setIsLoading(false);
      return;
    }

    if (!sellerAppUserId) {
        setError("User profile ID is missing. Cannot register bib.");
        setIsLoading(false);
        return;
    }

    try {
      const newBib = await registerBib({
        raceId: raceId,
        sellerUserId: sellerAppUserId,
        bibNumber: bibNumber || undefined, // Pass undefined if empty string
      });
      setSuccessMessage(`Bib registered successfully! Bib ID: ${newBib.id}`);
      setBibNumber(''); // Reset form

      // Redirect after a short delay
      startTransition(() => {
        setTimeout(() => {
          // Option 1: Redirect to My Bibs page
          router.push('/dashboard/my-bibs');
          // Option 2: Redirect to Race Details page
          // router.push(`/races/${raceId}`);
        }, 2000); // 2-second delay
      });

    } catch (err: any) {
      console.error("Failed to register bib:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!raceId && !raceIdParam) { // Double check if raceId is truly missing
    return <p className="text-red-500 text-center p-4">Race ID is missing. Please ensure you have navigated from a race page.</p>;
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="raceId" className="block text-sm font-medium text-gray-700">
          Race ID
        </label>
        <input
          type="text"
          name="raceId"
          id="raceId"
          value={raceId || ''}
          readOnly
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="bibNumber" className="block text-sm font-medium text-gray-700">
          Bib Number (Optional)
        </label>
        <input
          type="text"
          name="bibNumber"
          id="bibNumber"
          value={bibNumber}
          onChange={(e) => setBibNumber(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., 12345"
        />
        <p className="mt-1 text-xs text-gray-500">If the race assigns specific numbers and you know yours, enter it here.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              {/* Heroicon name: solid/x-circle */}
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 7a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
         <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
               {/* Heroicon name: solid/check-circle */}
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11.414L9.414 8 7.707 6.293a1 1 0 00-1.414 1.414L8 9.414l-1.293 1.293a1 1 0 101.414 1.414L10 10.828l2.293 2.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 7.586z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
              <p className="text-sm text-green-600">Redirecting you shortly...</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading || isPending || !!successMessage}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
        >
          {isLoading || isPending ? 'Registering...' : 'Register Bib'}
        </button>
      </div>
    </form>
  );
};

// Suspense boundary for useSearchParams
const RegisterBibForm: React.FC<RegisterBibFormProps> = (props) => (
  <Suspense fallback={<div className="text-center p-4">Loading form details...</div>}>
    <RegisterBibFormInner {...props} />
  </Suspense>
);


export default RegisterBibForm;
