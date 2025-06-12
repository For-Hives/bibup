// src/app/faq/page.tsx
import type { Metadata } from 'next'

import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import faqTranslations from './locales.json'

export const metadata: Metadata = {
	description: 'Frequently Asked Questions about buying, selling, and organizing events on Beswib.',
	title: 'FAQ | Beswib',
}

export default async function FAQPage() {
	const locale = await getLocale()
	const t = getTranslations(locale, faqTranslations)

	return (
		<div className="mx-auto max-w-3xl p-5 font-sans">
			<header className="mb-8 text-center">
				<h1>{t.title}</h1>
			</header>

			{/* General Section */}
			<section>
				<h2 className="mt-8 mb-4 border-b-2 border-gray-200 pb-2.5 text-3xl">{t.sections.general.title}</h2>
				{t.sections.general.questions.map((item, index) => (
					<div key={index}>
						<h3 className="mb-2 text-lg font-bold text-gray-800">{item.question}</h3>
						<p className="mb-5 text-base leading-relaxed text-gray-700">{item.answer}</p>
					</div>
				))}
			</section>

			{/* Sellers Section */}
			<section>
				<h2 className="mt-8 mb-4 border-b-2 border-gray-200 pb-2.5 text-3xl">{t.sections.sellers.title}</h2>
				{t.sections.sellers.questions.map((item, index) => (
					<div key={index}>
						<h3 className="mb-2 text-lg font-bold text-gray-800">{item.question}</h3>
						<p className="mb-5 text-base leading-relaxed text-gray-700">{item.answer}</p>
					</div>
				))}
			</section>

			{/* Buyers Section */}
			<section>
				<h2 className="mt-8 mb-4 border-b-2 border-gray-200 pb-2.5 text-3xl">{t.sections.buyers.title}</h2>
				{t.sections.buyers.questions.map((item, index) => (
					<div key={index}>
						<h3 className="mb-2 text-lg font-bold text-gray-800">{item.question}</h3>
						<p className="mb-5 text-base leading-relaxed text-gray-700">{item.answer}</p>
					</div>
				))}
			</section>
		</div>
	)
}
