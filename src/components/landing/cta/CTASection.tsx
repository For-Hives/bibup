import { CTASection } from '@/components/landing/cta/CTAWithRectangle'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import translations from './locales.json'

export default async function BesWibCTA() {
	const locale = await getLocale()
	const t = getTranslations(locale, translations)

	return (
		<CTASection
			actions={[
				{
					variant: 'outline',
					text: t.cta.organizerButton,
					href: '/dashboard/organizer',
				},
				{
					variant: 'default',
					text: t.cta.webAppButton,
					href: '/marketplace',
				},
			]}
			translations={t}
			withGlow={true}
		/>
	)
}
