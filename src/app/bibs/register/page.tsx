import React, { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { getUserProfileByClerkId } from '@/services/user.services';
import RegisterBibForm from '@/components/bibs/RegisterBibForm';
import Link from 'next/link';

interface RegisterBibPageProps {
  searchParams?: {
    raceId?: string;
  };
}

// Wrapper component to handle Suspense for useSearchParams in RegisterBibForm
const RegisterBibFormWrapper = (props: { raceId?: string; sellerAppUserId: string; clerkUserId: string }) => {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading form...</div>}>
      <RegisterBibForm raceIdParam={props.raceId} sellerAppUserId={props.sellerAppUserId} clerkUserId={props.clerkUserId} />
    </Suspense>
  );
};


export default async function RegisterBibPage({ searchParams }: RegisterBibPageProps) {
  const { userId: clerkUserId, protect } = auth();
  protect();

  if (!clerkUserId) {
    // protect() should handle this, but as a fallback
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p>You must be logged in to register a bib.</p>
            <Link href="/sign-in" className="text-blue-500 hover:underline">Sign In</Link>
        </div>
    );
  }

  const appUserProfile = await getUserProfileByClerkId(clerkUserId);

  if (!appUserProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Register Bib</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Application Profile Not Found</p>
          <p>
            We couldn&apos;t find your application profile, which is needed to register a bib.
            Please ensure your profile is complete or contact support.
          </p>
          <Link href="/dashboard" className="text-red-600 hover:text-red-800 underline mt-2 inline-block">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const raceId = searchParams?.raceId;

  if (!raceId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Register Bib</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Race ID Missing</p>
          <p>
            No Race ID was provided in the URL. Please navigate from a race details page.
          </p>
          <Link href="/races" className="text-yellow-600 hover:text-yellow-800 underline mt-2 inline-block">Find a Race</Link>
        </div>
      </div>
    );
  }

  // Potentially fetch race details here to display race name, but for now, just pass the ID.

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Register Your Bib</h1>
        <p className="mt-2 text-lg text-gray-600">
          Add your bib details for the race. Race ID: <span className="font-semibold text-blue-600">{raceId}</span>
        </p>
      </header>
      <div className="max-w-lg mx-auto bg-white p-8 shadow-xl rounded-lg">
        <RegisterBibFormWrapper
            raceId={raceId}
            sellerAppUserId={appUserProfile.id}
            clerkUserId={clerkUserId}
        />
      </div>
    </div>
  );
}
