import type { Metadata } from 'next'

import ContactPageClient from '@/app/contact/contact-page-client'
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

	return <ContactPageClient t={t} />
}
