
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Purchase Failed',
    description: 'Your purchase failed.',
};

export default function PurchaseFailurePage() {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Purchase Failed</h1>
            <p className="text-lg">Unfortunately, your purchase could not be completed.</p>
            <p className="text-md mt-2">Please try again or contact support if the issue persists.</p>
        </div>
    );
}
