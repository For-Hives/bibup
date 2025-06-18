import type { Metadata } from 'next'

import globalTranslations from '@/components/global/locales.json'
import BesWibCTA from '@/components/landing/cta/CTASection'
import { getTranslations } from '@/lib/getDictionary'
import FAQ from '@/components/landing/faq/FAQ'
import { getLocale } from '@/lib/getLocale'

export default function FAQPage() {
	return (
		<div className="relative">
			<FAQ />
			<BesWibCTA />
		</div>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale()
	const t = getTranslations(locale, globalTranslations)

	return {
		title: t.pages.faq.title,
		description: t.pages.faq.description,
	}
}
