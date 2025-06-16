import type { Metadata } from 'next'

import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import contactTranslations from './locales.json'

export const metadata: Metadata = {
	title: 'Contact | Beswib',
	description: 'Get in touch with the Beswib team.',
}

export default async function ContactPage() {
	const locale = await getLocale()
	const t = getTranslations(locale, contactTranslations)

	return (
		<div className="mx-auto max-w-4xl p-5 font-sans">
			<header className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{t.title}</h1>
				<p className="text-lg text-gray-600">{t.description}</p>
			</header>

			<main className="space-y-8">
				<section className="text-center">
					<h2 className="mb-4 text-2xl font-semibold">{t.getInTouch}</h2>
					<p className="mb-4">{t.contactDescription}</p>

					<div className="space-y-4">
						<div>
							<h3 className="font-semibold">{t.email}</h3>
							<a className="text-blue-600 hover:underline" href="mailto:contact@beswib.com">
								contact@beswib.com
							</a>
						</div>

						<div>
							<h3 className="font-semibold">{t.support}</h3>
							<a className="text-blue-600 hover:underline" href="mailto:support@beswib.com">
								support@beswib.com
							</a>
						</div>

						<div>
							<h3 className="font-semibold">{t.partnerships}</h3>
							<a className="text-blue-600 hover:underline" href="mailto:partners@beswib.com">
								partners@beswib.com
							</a>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
