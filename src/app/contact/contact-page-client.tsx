'use client'

import BentoGrid from '@/components/contact/bento-grid'
import { getTranslations } from '@/lib/getDictionary'

import ContactTranslations from './locales.json'

type Translations = ReturnType<typeof getTranslations<(typeof ContactTranslations)['en'], 'en'>>

export default function ContactPageClient({ t }: { t: Translations }) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<div className="mx-auto max-w-6xl p-5 pt-10 font-sans">
				<header className="mb-12 text-center">
					<div className="mb-3 inline-block">
						<div className="relative inline-block">
							<h1 className="relative rounded-lg bg-white px-6 py-2 text-4xl font-bold md:text-5xl dark:bg-slate-900">
								{t.title}
							</h1>
						</div>
					</div>
					<p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-300">{t.description}</p>
				</header>

				<BentoGrid t={t} />
			</div>
		</div>
	)
}
