import { CTASection } from '@/components/landing/cta/CTAWithRectangle'
import { LocaleParams } from '@/lib/generateStaticParams'

export default async function BesWibCTA({ localeParams }: { localeParams: Promise<LocaleParams> }) {
	const { locale } = await localeParams

	return <CTASection locale={locale} withGlow={true} />
}
