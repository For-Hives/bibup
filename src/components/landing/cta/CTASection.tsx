import { CTASection } from '@/components/landing/cta/CTAWithRectangle'
import { LocaleParams } from '@/lib/generateStaticParams'
import { getTranslations } from '@/lib/getDictionary'

import translations from './locales.json'

export default async function BesWibCTA({ localeParams }: { localeParams: Promise<LocaleParams> }) {
	const { locale } = await localeParams
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
