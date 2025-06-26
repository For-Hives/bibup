
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Purchase Success',
    description: 'Your purchase was successful.',
};

export default function PurchaseSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Purchase Successful!</h1>
            <p className="text-lg">Thank you for your purchase. Your transaction has been completed.</p>
            <p className="text-md mt-2">You will receive a confirmation email shortly.</p>
        </div>
    );
}
