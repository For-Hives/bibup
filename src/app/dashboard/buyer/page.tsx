import type { Metadata } from 'next'

import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

import type { Waitlist } from '@/models/waitlist.model'
import type { Event } from '@/models/event.model'
import type { Bib } from '@/models/bib.model'

import { fetchUserWaitlists } from '@/services/waitlist.services' // Import waitlist service
import { fetchBibsByBuyer } from '@/services/bib.services'
import { getTranslations } from '@/lib/getDictionary'
import { getLocale } from '@/lib/getLocale'

import buyerTranslations from './locales.json'

export const metadata: Metadata = {
	title: 'Buyer Dashboard | Beswib',
}

// Basic styling (can be refactored)
const styles = {
	welcomeMessage: { marginBottom: '20px', fontSize: '1.5em' },
	successMessage: {
		padding: '15px',
		marginBottom: '20px',
		fontSize: '1.1em',
		color: '#155724',
		borderRadius: '5px',
		border: '1px solid #c3e6cb',
		backgroundColor: '#d4edda',
	},
	sectionTitle: { marginBottom: '15px', fontSize: '1.4em', color: '#333' },
	section: {
		padding: '20px',
		marginBottom: '30px',
		borderRadius: '8px',
		border: '1px solid #eee',
		backgroundColor: '#f9f9f9',
	},
	listItem: {
		padding: '15px',
		marginBottom: '10px',
		borderRadius: '5px',
		border: '1px solid #ddd',
		backgroundColor: '#fff',
	},
	list: { padding: 0, listStyle: 'none' as const }, // Generic list style
	link: { textDecoration: 'underline', color: '#0070f3' },
	itemName: {
		fontWeight: 'bold' as const,
		fontSize: '1.1em',
		color: '#0056b3',
	}, // Generic item name style
	itemDetail: { margin: '4px 0', fontSize: '0.9em', color: '#555' }, // Generic item detail style
	header: { textAlign: 'center' as const, marginBottom: '30px' },
	container: {
		padding: '20px',
		maxWidth: '900px',
		margin: '0 auto',
		fontFamily: 'Arial, sans-serif',
	},
}

export default async function BuyerDashboardPage({
	searchParams: searchParamsPromise,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const locale = await getLocale()
	const t = getTranslations(locale, buyerTranslations)

	const { userId: clerkUserId } = await auth()
	const clerkUser = await currentUser()
	const searchParams = await searchParamsPromise

	if (clerkUserId == null || !clerkUser) {
		return <p style={styles.container}>{t.pleaseSignIn}</p>
	}

	const buyerName = clerkUser.firstName ?? clerkUser.emailAddresses[0]?.emailAddress ?? 'Buyer'

	let purchasedBibs: (Bib & { expand?: { eventId: Event } })[] = []
	let userWaitlists: (Waitlist & { expand?: { eventId: Event } })[] = []

	if (clerkUserId) {
		purchasedBibs = await fetchBibsByBuyer(clerkUserId)
		userWaitlists = await fetchUserWaitlists(clerkUserId)
	}

	const purchaseSuccess = searchParams?.purchase_success === 'true'
	const eventNameForSuccessMsg =
		typeof searchParams?.event_name === 'string' ? decodeURIComponent(searchParams.event_name) : ''

	const showSuccessMessage = purchaseSuccess && Boolean(eventNameForSuccessMsg)
	const successDisplay = showSuccessMessage ? (
		<div style={styles.successMessage}>
			{t.purchaseSuccess} <strong>{eventNameForSuccessMsg}</strong>. {t.purchaseSuccessDetails}
		</div>
	) : null

	return (
		<div style={styles.container}>
			<header style={styles.header}>
				<h1>{t.title}</h1>
			</header>
			<p style={styles.welcomeMessage}>
				{t.welcome}, {buyerName}!
			</p>

			{successDisplay}

			<section style={styles.section}>
				<h2 style={styles.sectionTitle}>{t.myPurchases}</h2>
				{purchasedBibs.length > 0 ? (
					<ul style={styles.list}>
						{purchasedBibs.map(bib => (
							<li key={bib.id} style={styles.listItem}>
								<div style={styles.itemName}>
									{t.bibForLabel} {bib.expand?.eventId?.name ?? `Event ID: ${bib.eventId}`}
								</div>
								<p style={styles.itemDetail}>
									{t.dateOfEvent} {bib.expand?.eventId ? new Date(bib.expand.eventId.date).toLocaleDateString() : 'N/A'}
								</p>
								<p style={styles.itemDetail}>
									{t.pricePaid} ${bib.price.toFixed(2)}
								</p>
								<p style={styles.itemDetail}>
									{t.registrationNumber} {bib.registrationNumber} {t.keepRecords}
								</p>
							</li>
						))}
					</ul>
				) : (
					<p>
						{t.noPurchases}{' '}
						<Link href="/events" style={styles.link}>
							{t.browseEvents}
						</Link>{' '}
						to find bibs for sale!
					</p>
				)}
			</section>

			<section style={styles.section}>
				<h2 style={styles.sectionTitle}>{t.waitlistEntries}</h2>
				{userWaitlists.length > 0 ? (
					<ul style={styles.list}>
						{userWaitlists.map(waitlistEntry => (
							<li key={waitlistEntry.id} style={styles.listItem}>
								<div style={styles.itemName}>
									{t.eventLabel}{' '}
									<Link href={`/events/${waitlistEntry.eventId}`} style={styles.link}>
										{waitlistEntry.expand?.eventId?.name ?? `Event ID: ${waitlistEntry.eventId}`}
									</Link>
								</div>
								<p style={styles.itemDetail}>
									{t.dateAddedToWaitlist} {new Date(waitlistEntry.addedAt).toLocaleDateString()}
								</p>
								<p style={styles.itemDetail}>
									{t.status}{' '}
									{waitlistEntry.notifiedAt
										? t.notifiedOn + ' ' + new Date(waitlistEntry.notifiedAt).toLocaleDateString()
										: t.waitingForNotification}
								</p>
							</li>
						))}
					</ul>
				) : (
					<p>
						{t.noWaitlistEntries}{' '}
						<Link href="/events" style={styles.link}>
							{t.browseEventsWaitlist}
						</Link>{' '}
						{t.waitlistJoinText}
					</p>
				)}
			</section>
		</div>
	)
}
