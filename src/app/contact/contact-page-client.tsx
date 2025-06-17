'use client'

import BentoGrid from '@/components/contact/bento-grid'
import { getTranslations } from '@/lib/getDictionary'

import ContactTranslations from './locales.json'

type Translations = ReturnType<typeof getTranslations<(typeof ContactTranslations)['en'], 'en'>>

export default function ContactPageClient({ t }: { t: Translations }) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<div className="mx-auto max-w-6xl p-5 pt-10 font-sans">
				<BentoGrid t={t} />
			</div>
		</div>
	)
}
