"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { Bib, BibStatus } from '@/models/bib.model';
import { Race } from '@/models/races.model'; // For fetching race details
import { listBibForSale, updateBibStatus } from '@/services/bib.services';
import { fetchRaceById } from '@/services/races.services'; // To get race names
import { useRouter } from 'next/navigation';

interface MyBibsClientProps {
  initialBibs: Bib[];
  userId: string; // PocketBase user ID
}

interface BibWithRaceName extends Bib {
  raceName?: string;
}

const MyBibsClient: React.FC<MyBibsClientProps> = ({ initialBibs, userId }) => {
  const [bibs, setBibs] = useState<BibWithRaceName[]>(initialBibs);
  const [loadingRaceDetails, setLoadingRaceDetails] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // State for inline price editing
  const [editingPriceBibId, setEditingPriceBibId] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string>("");

  useEffect(() => {
    const fetchRaceNames = async () => {
      setLoadingRaceDetails(true);
      const uniqueRaceIds = Array.from(new Set(initialBibs.map(bib => bib.raceId)));
      const raceDetailsPromises = uniqueRaceIds.map(id => fetchRaceById(id));

      try {
        const raceResults = await Promise.all(raceDetailsPromises);
        const racesMap = new Map<string, string>();
        raceResults.forEach(race => {
          if (race) {
            racesMap.set(race.id, race.name);
          }
        });

        setBibs(initialBibs.map(bib => ({
          ...bib,
          raceName: racesMap.get(bib.raceId) || 'Race details not found',
        })));
      } catch (error) {
        console.error("Failed to fetch race details for bibs:", error);
        // Keep bibs as they are, but without race names or with a default
        setBibs(initialBibs.map(bib => ({ ...bib, raceName: 'N/A' })));
      } finally {
        setLoadingRaceDetails(false);
      }
    };

    if (initialBibs.length > 0) {
      fetchRaceNames();
    }
  }, [initialBibs]);

  const handleListForSale = async (bibId: string, price: number) => {
    startTransition(async () => {
      try {
        await listBibForSale(bibId, price);
        router.refresh(); // Re-fetches server data and re-renders
        setEditingPriceBibId(null); // Close input field
      } catch (error) {
        console.error("Failed to list bib for sale:", error);
        alert(`Error: ${error instanceof Error ? error.message : "Could not list bib."}`);
      }
    });
  };

  const handleDelist = async (bibId: string) => {
    startTransition(async () => {
      try {
        // Delisting means setting status to 'registered' and clearing price.
        // The updateBibStatus function already handles clearing price if status is 'registered'.
        await updateBibStatus(bibId, 'registered');
        router.refresh();
      } catch (error) {
        console.error("Failed to delist bib:", error);
        alert(`Error: ${error instanceof Error ? error.message : "Could not delist bib."}`);
      }
    });
  };

  const handleUpdatePrice = async (bibId: string, newPrice: number) => {
    // This is effectively the same as listing for sale, as `listBibForSale` updates price and status.
    // If bib is already 'listed_for_sale', this service function will still update the price.
    if (newPrice <= 0) {
        alert("Price must be positive.");
        return;
    }
    await handleListForSale(bibId, newPrice);
  };

  if (loadingRaceDetails && bibs.length === 0) {
    return <p className="text-center text-gray-500 py-8">Loading your bibs and race details...</p>;
  }

  if (!bibs.length && !loadingRaceDetails) {
    return (
      <div className="text-center py-10 bg-white shadow-md rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Bibs Found</h3>
        <p className="mt-1 text-sm text-gray-500">You haven&apos;t registered any bibs yet.</p>
        <div className="mt-6">
          <a
            href="/races" // Link to a page where users can find races to register bibs
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Find Races
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bibs.map((bib) => (
        <div key={bib.id} className="bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="grid md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-blue-700 mb-1">
                {bib.raceName || `Race ID: ${bib.raceId}`}
                {loadingRaceDetails && !bib.raceName && <span className="text-sm text-gray-400"> (Loading name...)</span>}
              </h2>
              {bib.bibNumber && <p className="text-md text-gray-600 mb-1">Bib Number: <span className="font-semibold">{bib.bibNumber}</span></p>}
              <p className="text-md text-gray-600">Status: <span className={`font-semibold ${bib.status === 'sold' ? 'text-red-500' : bib.status === 'listed_for_sale' ? 'text-green-600' : 'text-yellow-600'}`}>{bib.status.replace(/_/g, ' ')}</span></p>
              {bib.status === 'listed_for_sale' && bib.price && (
                <p className="text-lg font-semibold text-green-700 mt-1">Price: ${bib.price.toFixed(2)}</p>
              )}
              {bib.status === 'sold' && bib.price && (
                 <p className="text-md text-gray-600">Sold for: <span className="font-semibold">${bib.price.toFixed(2)}</span></p>
              )}
               {bib.status === 'sold' && bib.buyerUserId && (
                 <p className="text-xs text-gray-500">Buyer ID: <span className="font-mono">{bib.buyerUserId.substring(0,5)}...</span></p>
              )}
            </div>

            <div className="md:col-span-1 space-y-3 md:pt-2">
              {bib.status === 'registered' && (
                <>
                  {editingPriceBibId === bib.id ? (
                    <div className="flex flex-col space-y-2">
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={currentPrice}
                        onChange={(e) => setCurrentPrice(e.target.value)}
                        className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        min="0.01"
                        step="0.01"
                      />
                      <button
                        onClick={() => handleListForSale(bib.id, parseFloat(currentPrice))}
                        disabled={isPending || !currentPrice || parseFloat(currentPrice) <= 0}
                        className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {isPending ? 'Listing...' : 'Confirm Listing'}
                      </button>
                      <button
                        onClick={() => setEditingPriceBibId(null)}
                        className="w-full justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingPriceBibId(bib.id); setCurrentPrice(""); }}
                      disabled={isPending}
                      className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      List for Sale
                    </button>
                  )}
                </>
              )}

              {bib.status === 'listed_for_sale' && (
                <>
                  {editingPriceBibId === bib.id ? (
                     <div className="flex flex-col space-y-2">
                        <input
                          type="number"
                          placeholder="Enter new price"
                          value={currentPrice}
                          onChange={(e) => setCurrentPrice(e.target.value)}
                          className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="0.01"
                          step="0.01"
                        />
                        <button
                          onClick={() => handleUpdatePrice(bib.id, parseFloat(currentPrice))}
                          disabled={isPending || !currentPrice || parseFloat(currentPrice) <= 0}
                          className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {isPending ? 'Updating...' : 'Confirm New Price'}
                        </button>
                        <button
                            onClick={() => setEditingPriceBibId(null)}
                            className="w-full justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                     </div>
                  ) : (
                    <button
                      onClick={() => { setEditingPriceBibId(bib.id); setCurrentPrice(bib.price?.toString() || ""); }}
                      disabled={isPending}
                      className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50"
                    >
                      Update Price
                    </button>
                  )}
                  <button
                    onClick={() => handleDelist(bib.id)}
                    disabled={isPending}
                    className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isPending ? 'Delisting...' : 'Delist'}
                  </button>
                </>
              )}
              {bib.status === 'sold' && (
                 <p className="text-center text-gray-700 bg-gray-100 p-3 rounded-md text-sm">This bib has been sold and cannot be modified.</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBibsClient;
