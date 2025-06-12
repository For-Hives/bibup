// src/app/faq/page.tsx
import type { Metadata } from 'next'

import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import faqTranslations from './locales.json'

export const metadata: Metadata = {
	title: 'FAQ | Beswib',
	description: 'Frequently Asked Questions about buying, selling, and organizing events on Beswib.',
}

const faqStyles = {
	sectionTitle: {
		paddingBottom: '10px',
		marginTop: '30px',
		marginBottom: '15px',
		fontSize: '2em',
		borderBottom: '2px solid #eee',
	},
	question: {
		marginBottom: '8px',
		fontWeight: 'bold' as const,
		fontSize: '1.2em',
		color: '#333',
	},
	header: { textAlign: 'center' as const, marginBottom: '30px' },
	container: {
		padding: '20px',
		maxWidth: '800px',
		margin: '0 auto',
		fontFamily: 'Arial, sans-serif',
	},
	answer: {
		marginBottom: '20px',
		lineHeight: '1.6',
		fontSize: '1em',
		color: '#555',
	},
}

export default async function FAQPage() {
	const locale = await getLocale()
	const t = getTranslations(locale, faqTranslations)

	return (
		<div style={faqStyles.container}>
			<header style={faqStyles.header}>
				<h1>{t.title}</h1>
			</header>

			{/* General Section */}
			<section>
				<h2 style={faqStyles.sectionTitle}>{t.sections.general.title}</h2>
				{t.sections.general.questions.map((item, index) => (
					<div key={index}>
						<h3 style={faqStyles.question}>{item.question}</h3>
						<p style={faqStyles.answer}>{item.answer}</p>
					</div>
				))}
			</section>

			{/* Sellers Section */}
			<section>
				<h2 style={faqStyles.sectionTitle}>{t.sections.sellers.title}</h2>
				{t.sections.sellers.questions.map((item, index) => (
					<div key={index}>
						<h3 style={faqStyles.question}>{item.question}</h3>
						<p style={faqStyles.answer}>{item.answer}</p>
					</div>
				))}
			</section>

			{/* Buyers Section */}
			<section>
				<h2 style={faqStyles.sectionTitle}>{t.sections.buyers.title}</h2>
				{t.sections.buyers.questions.map((item, index) => (
					<div key={index}>
						<h3 style={faqStyles.question}>{item.question}</h3>
						<p style={faqStyles.answer}>{item.answer}</p>
					</div>
				))}
			</section>
		</div>
	)
}
