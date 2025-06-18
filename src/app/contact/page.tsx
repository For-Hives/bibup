import type { Metadata } from 'next'

import ContactPageClient from '@/app/contact/contact-page-client'
import globalTranslations from '@/components/global/locales.json'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import contactTranslations from './locales.json'

export default async function ContactPage() {
	const locale = await getLocale()
	const t = getTranslations(locale, contactTranslations)

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
