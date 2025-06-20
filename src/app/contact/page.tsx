import type { Metadata } from 'next'

import ContactPageClient from '@/app/contact/contact-page-client'
import globalTranslations from '@/components/global/locales.json'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

export default async function ContactPage() {
	const locale = await getLocale()
	const globalT = getTranslations(locale, globalTranslations)

	const t = globalT.contact

	return <ContactPageClient t={t} />
}

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale()
	const t = getTranslations(locale, globalTranslations)

	return {
		title: t.pages.contact.title,
		description: t.pages.contact.description,
	}
}
