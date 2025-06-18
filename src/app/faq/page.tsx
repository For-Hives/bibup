import type { Metadata } from 'next'

import FAQ from '@/components/landing/faq/FAQ'

export const metadata: Metadata = {
	title: 'FAQ | Beswib',
	description: "Questions fréquemment posées sur l'achat, la vente et l'organisation d'événements sur Beswib.",
}

export default function FAQPage() {
	return <FAQ />
}
