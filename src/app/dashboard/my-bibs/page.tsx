import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { User } from '@/models/user.model';
import { getUserProfileByClerkId } from '@/services/user.services';
import { getBibsForUser } from '@/services/bib.services';
import { Bib } from '@/models/bib.model';
import MyBibsClient from '@/components/dashboard/MyBibsClient'; // Will be created next
import Link from 'next/link';

export default async function MyBibsPage() {
  const { userId: clerkUserId, protect } = auth();
  protect(); // Redirects to sign-in if not authenticated

  if (!clerkUserId) {
    // protect() should handle this, but as a fallback:
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>You must be logged in to view your bibs.</p>
        <Link href="/sign-in" className="text-blue-500 hover:underline">Sign In</Link>
      </div>
    );
  }

  const appUserProfile = await getUserProfileByClerkId(clerkUserId);

  if (!appUserProfile) {
    // This case should ideally be handled by getOrCreateUserProfile on login
    // or by a dedicated profile completion step.
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">My Bibs</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Profile Not Found</p>
          <p>We couldn&apos;t find your application profile. This might be an error or you might need to complete your profile setup.</p>
          {/* Add a link to a profile creation/help page if available */}
        </div>
      </div>
    );
  }

  const userBibs: Bib[] = await getBibsForUser(appUserProfile.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">My Registered Bibs</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your race bibs, list them for sale, or update their status.
        </p>
      </header>
      <MyBibsClient initialBibs={userBibs} userId={appUserProfile.id} />
    </div>
  );
}
