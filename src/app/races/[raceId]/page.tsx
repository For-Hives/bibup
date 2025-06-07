import React from 'react';
import Link from 'next/link';
import { fetchRaceById } from '@/services/races.services'; // Corrected path
import { getBibsForRace } from '@/services/bib.services';
import { Race } from '@/models/races.model';
import { Bib } from '@/models/bib.model';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import BibList from '@/components/bibs/BibList';


interface RaceDetailsPageProps {
  params: {
    raceId: string;
  };
}

export default async function RaceDetailsPage({ params }: RaceDetailsPageProps) {
  const { raceId } = params;
  const { userId: currentUserId } = auth(); // Fetch currentUserId
  const race = await fetchRaceById(raceId);
  const allBibs = await getBibsForRace(raceId);

  if (!race) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center">Race Not Found</h1>
        <p className="text-center mt-4">
          Sorry, we couldn&apos;t find the race you were looking for.
        </p>
        <div className="text-center mt-6">
          <Link href="/races" className="text-blue-500 hover:underline">
            View All Races
          </Link>
        </div>
      </div>
    );
  }

  // Filter bibs that are for sale
  const bibsForSale = allBibs.filter(bib => bib.status === 'listed_for_sale' && bib.price !== undefined && bib.price > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{race.name}</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-6">
          <p className="text-lg mb-2">
            <strong>Date:</strong> {new Date(race.date).toLocaleDateString()}
          </p>
          <p className="text-lg mb-2">
            <strong>Location:</strong> {race.location}
          </p>
          {race.description && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-2">Race Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{race.description}</p>
            </div>
          )}
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Actions</h2>
          <SignedIn>
            <Link
              href={`/bibs/register?raceId=${race.id}`}
              className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded mb-4 transition duration-150"
            >
              Register Your Bib
            </Link>
            {/* Add other logged-in actions here if any */}
          </SignedIn>
          <SignedOut>
            <p className="text-sm text-gray-600 mb-2">
              To register a bib or purchase one, please sign in.
            </p>
            <Link
              href={`/sign-in?redirect_url=/races/${race.id}`}
              className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded mb-4 transition duration-150"
            >
              Sign In
            </Link>
            <Link
              href={`/sign-up?redirect_url=/races/${race.id}`}
              className="block w-full text-center bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 px-4 rounded transition duration-150"
            >
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </div>

      {/* Section for Available Bibs */}
      <div className="mt-8">
        <BibList bibs={bibsForSale} currentUserId={currentUserId} />
      </div>

      <div className="mt-8 text-center">
        <Link href="/races" className="text-blue-500 hover:underline">
          &larr; Back to All Races
        </Link>
      </div>
    </div>
  );
}
