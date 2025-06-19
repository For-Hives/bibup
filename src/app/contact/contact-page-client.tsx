'use client'

import BentoGrid from '@/components/contact/bento-grid'
import { getTranslations } from '@/lib/getDictionary'

import ContactTranslations from './locales.json'

type Translations = ReturnType<typeof getTranslations<(typeof ContactTranslations)['en'], 'en'>>

export default function ContactPageClient({ t }: { t: Translations }) {
	return (
		<div className="bg-background min-h-screen">
			<div className="mx-auto max-w-7xl p-4 pt-10 font-sans xl:px-0 xl:pt-20">
				<BentoGrid t={t} />
			</div>
		</div>
	)
}
