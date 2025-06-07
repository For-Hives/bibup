import React from 'react';
import { Bib } from '@/models/bib.model';
import BibCard from './BibCard'; // This component will be created next

interface BibListProps {
  bibs: Bib[];
  currentUserId: string | null | undefined;
}

const BibList: React.FC<BibListProps> = ({ bibs, currentUserId }) => {
  if (!bibs || bibs.length === 0) {
    return (
      <div className="text-center py-10">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Bibs Available</h3>
        <p className="mt-1 text-sm text-gray-500">There are currently no bibs listed for sale for this race.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
        Available Bibs for Sale
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bibs.map((bib) => (
          <BibCard key={bib.id} bib={bib} currentUserId={currentUserId} />
        ))}
      </div>
    </div>
  );
};

export default BibList;
