
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fetchBibById } from '@/services/bib.services';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,
    {
        apiVersion: '2024-06-20',
    }
);

export async function POST(request: Request) {
    const { bibId } = await request.json();

    if (!bibId) {
        return NextResponse.json({ error: 'Missing bibId' }, { status: 400 });
    }

    const bib = await fetchBibById(bibId);

    if (!bib) {
        return NextResponse.json({ error: 'Bib not found' }, { status: 404 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: bib.price * 100, // amount in cents
        currency: 'eur',
        metadata: { bibId: bib.id },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
