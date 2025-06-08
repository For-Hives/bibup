'use client' // Required for useState and client-side interactions

// Removed fetchPartneredApprovedEvents import from here
import type { Event } from '@/models/event.model'

import React, { useEffect, useState } from 'react' // For managing form state

// Removed Metadata import from here
import Link from 'next/link'

import { type BibFormData, BibFormSchema } from './schemas'
// Import the server action from the separate file
import { handleListBibServerAction } from './actions'

// Metadata can be exported from client components in recent Next.js versions, but often better in server component
// export const metadata: Metadata = {
//   title: 'List a New Bib | Seller Dashboard | BibUp',
// };

// Basic styling (can be refactored)
const styles = {
	button: {
		backgroundColor: '#0070f3',
		padding: '12px 20px',
		borderRadius: '4px',
		cursor: 'pointer',
		fontSize: '1.1em',
		marginTop: '10px',
		color: 'white',
		border: 'none',
	},
	link: {
		textAlign: 'center' as const,
		textDecoration: 'underline',
		marginTop: '20px',
		color: '#0070f3',
		display: 'block',
	},
	select: {
		border: '1px solid #ccc',
		backgroundColor: 'white',
		borderRadius: '4px',
		padding: '10px',
		fontSize: '1em',
	},
	container: {
		fontFamily: 'Arial, sans-serif',
		maxWidth: '700px',
		margin: '0 auto',
		padding: '20px',
	},
	fieldGroup: {
		border: '1px dashed #ccc',
		borderRadius: '5px',
		marginTop: '10px',
		padding: '15px',
	},
	input: {
		border: '1px solid #ccc',
		borderRadius: '4px',
		padding: '10px',
		fontSize: '1em',
	},
	checkboxLabel: {
		alignItems: 'center',
		fontSize: '0.95em',
		display: 'flex',
		gap: '8px',
	},
	success: { textAlign: 'center' as const, marginTop: '10px', color: 'green' },
	form: { flexDirection: 'column' as const, display: 'flex', gap: '15px' },
	error: { textAlign: 'center' as const, marginTop: '10px', color: 'red' },
	fieldError: { fontSize: '0.85em', marginTop: '5px', color: 'red' },
	subtleNote: { fontSize: '0.9em', marginTop: '5px', color: '#555' },
	header: { textAlign: 'center' as const, marginBottom: '25px' },
	label: { fontWeight: 'bold' as const, marginBottom: '5px' },
	checkbox: { height: '16px', width: '16px' },
}

import { Dictionary } from '@/lib/getDictionary'

export default function ListNewBibClientPage({
	initialAuthUserId,
	partneredEvents,
	searchParams,
	dictionary,
}: {
	dictionary: Dictionary
	initialAuthUserId: null | string
	partneredEvents: Event[]
	searchParams?: { [key: string]: string | string[] | undefined }
}) {
	const [isNotListedEvent, setIsNotListedEvent] = useState(false)
	const [errorMessage, setErrorMessage] = useState<null | string>(null)
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
	const [formData, setFormData] = useState<Partial<BibFormData>>({
		isNotListedEvent: false,
		price: 0,
	})
	// Success message is primarily handled by redirect to dashboard.
	// This local success state isn't currently used but can be for client-side feedback.
	// const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		if (searchParams?.error) {
			setErrorMessage(decodeURIComponent(searchParams.error as string))
		}
		// If a success message needs to be displayed on *this* page after a redirect back to it:
		// if (searchParams?.successClient) {
		//   setSuccessMessage(decodeURIComponent(searchParams.successClient as string));
		// }
	}, [searchParams])

	// Fonction de validation en temps réel
	const validateField = (name: string, value: any) => {
		const testData = { ...formData, [name]: value }
		const result = BibFormSchema.safeParse(testData)

		if (!result.success) {
			const fieldError = result.error.errors.find(error => error.path.includes(name))
			if (fieldError) {
				setFieldErrors(prev => ({ ...prev, [name]: fieldError.message }))
			} else {
				setFieldErrors(prev => {
					const { ...rest } = prev
					return rest
				})
			}
		} else {
			setFieldErrors(prev => {
				const { ...rest } = prev
				return rest
			})
		}
	}

	// Gestionnaire de changement pour les champs du formulaire
	const handleFieldChange = (name: string, value: any) => {
		setFormData(prev => ({ ...prev, [name]: value }))
		validateField(name, value)

		// Gestion spéciale pour isNotListedEvent
		if (name === 'isNotListedEvent') {
			setIsNotListedEvent(value)
		}
	}

	// Wrapper for the server action to be used in form's action prop.
	// This is how client components can call server actions.
	const formActionWrapper = (formData: FormData) => {
		setErrorMessage(null) // Clear previous errors on new submission
		setFieldErrors({}) // Clear field errors
		// initialAuthUserId is passed from the server component wrapper.
		handleListBibServerAction(formData, initialAuthUserId).catch(error => {
			console.error('Error in form action:', error)
		})
	}

	if (!initialAuthUserId) {
		// This case should be handled by the server wrapper or middleware redirecting to sign-in
		// Displaying something here is a fallback.
		return <p style={styles.container}>{dictionary.dashboard.seller.listBib.errors.loginRequired}</p>
	}

	if (!dictionary) {
		// If dictionary is not available, we can't render the page properly.
		// This should ideally not happen if the server component is set up correctly.
		return <p style={styles.container}>"Dictionary data not found."</p>
	}

	return (
		<div style={styles.container}>
			<header style={styles.header}>
				<h1>{dictionary.dashboard.seller.listBib.title}</h1>
			</header>

			{errorMessage && (
				<p style={styles.error}>
					{dictionary.dashboard.seller?.noBibsListed} {errorMessage}
				</p>
			)}
			{/* {successMessage && <p style={styles.success}>{successMessage}</p>} */}

			<form action={formActionWrapper} style={styles.form}>
				<div>
					<label htmlFor="isNotListedEvent" style={styles.checkboxLabel}>
						<input
							checked={isNotListedEvent}
							id="isNotListedEvent"
							name="isNotListedEvent"
							onChange={e => handleFieldChange('isNotListedEvent', e.target.checked)}
							style={styles.checkbox}
							type="checkbox"
						/>
						{dictionary.dashboard.seller?.listBib.form.notListedEvent}
					</label>
				</div>

				{!isNotListedEvent ? (
					<div>
						<label htmlFor="eventId" style={styles.label}>
							{dictionary.dashboard.seller?.listBib?.form?.eventSelect}:
						</label>
						<select
							disabled={isNotListedEvent}
							id="eventId"
							name="eventId"
							onChange={e => handleFieldChange('eventId', e.target.value)}
							required={!isNotListedEvent}
							style={styles.select}
						>
							<option value="">{dictionary.dashboard.seller?.listBib?.form?.eventSelectPlaceholder}</option>
							{partneredEvents.map(event => (
								<option key={event.id} value={event.id}>
									{event.name} ({new Date(event.date).toLocaleDateString()})
								</option>
							))}
						</select>
						{fieldErrors.eventId && <p style={styles.fieldError}>{fieldErrors.eventId}</p>}
						{partneredEvents.length === 0 && (
							<p style={styles.subtleNote}>
								No partnered events available. You can list your bib by checking the box above.
							</p>
						)}
					</div>
				) : (
					<div style={styles.fieldGroup}>
						<p style={styles.subtleNote}>
							Please provide details for your unlisted event. This will undergo verification.
						</p>
						<div>
							<label htmlFor="unlistedEventName" style={styles.label}>
								{dictionary.dashboard.seller?.listBib?.form?.unlistedEventName}:
							</label>
							<input
								id="unlistedEventName"
								name="unlistedEventName"
								onChange={e => handleFieldChange('unlistedEventName', e.target.value)}
								placeholder={dictionary.dashboard.seller?.listBib?.form?.unlistedEventNamePlaceholder}
								required={isNotListedEvent}
								style={styles.input}
								type="text"
							/>
							{fieldErrors.unlistedEventName && <p style={styles.fieldError}>{fieldErrors.unlistedEventName}</p>}
						</div>
						<div>
							<label htmlFor="unlistedEventDate" style={styles.label}>
								Event Date:
							</label>
							<input
								id="unlistedEventDate"
								name="unlistedEventDate"
								onChange={e => handleFieldChange('unlistedEventDate', e.target.value)}
								required={isNotListedEvent}
								style={styles.input}
								type="date"
							/>
							{fieldErrors.unlistedEventDate && <p style={styles.fieldError}>{fieldErrors.unlistedEventDate}</p>}
						</div>
						<div>
							<label htmlFor="unlistedEventLocation" style={styles.label}>
								Event Location (City, State/Country):
							</label>
							<input
								id="unlistedEventLocation"
								name="unlistedEventLocation"
								onChange={e => handleFieldChange('unlistedEventLocation', e.target.value)}
								required={isNotListedEvent}
								style={styles.input}
								type="text"
							/>
							{fieldErrors.unlistedEventLocation && (
								<p style={styles.fieldError}>{fieldErrors.unlistedEventLocation}</p>
							)}
						</div>
					</div>
				)}

				<div>
					<label htmlFor="registrationNumber" style={styles.label}>
						{dictionary.dashboard.seller?.listBib?.form?.registrationNumber}:
					</label>
					<input
						id="registrationNumber"
						name="registrationNumber"
						onChange={e => handleFieldChange('registrationNumber', e.target.value)}
						placeholder={dictionary.dashboard.seller?.listBib?.form?.registrationNumberPlaceholder}
						required
						style={styles.input}
						type="text"
					/>
					{fieldErrors.registrationNumber && <p style={styles.fieldError}>{fieldErrors.registrationNumber}</p>}
				</div>

				<div>
					<label htmlFor="price" style={styles.label}>
						{dictionary.dashboard.seller?.listBib?.form?.price}:
					</label>
					<input
						id="price"
						min="0.01"
						name="price"
						onChange={e => handleFieldChange('price', parseFloat(e.target.value) || 0)}
						placeholder={dictionary.dashboard.seller?.listBib?.form?.pricePlaceholder}
						required
						step="0.01"
						style={styles.input}
						type="number"
					/>
					{fieldErrors.price && <p style={styles.fieldError}>{fieldErrors.price}</p>}
				</div>

				<div>
					<label htmlFor="originalPrice" style={styles.label}>
						Original Price ($) (Optional):
					</label>
					<input
						id="originalPrice"
						min="0.00"
						name="originalPrice"
						onChange={e => handleFieldChange('originalPrice', parseFloat(e.target.value) || undefined)}
						step="0.01"
						style={styles.input}
						type="number"
					/>
					{fieldErrors.originalPrice && <p style={styles.fieldError}>{fieldErrors.originalPrice}</p>}
				</div>

				<div>
					<label htmlFor="size" style={styles.label}>
						{dictionary.dashboard.seller?.listBib?.form?.size}:
					</label>
					<input
						id="size"
						name="size"
						onChange={e => handleFieldChange('size', e.target.value)}
						placeholder={dictionary.dashboard.seller?.listBib?.form?.sizePlaceholder}
						style={styles.input}
						type="text"
					/>
					{fieldErrors.size && <p style={styles.fieldError}>{fieldErrors.size}</p>}
				</div>

				<div>
					<label htmlFor="gender" style={styles.label}>
						{dictionary.dashboard.seller?.listBib?.form?.gender}:
					</label>
					<select
						id="gender"
						name="gender"
						onChange={e => handleFieldChange('gender', e.target.value as 'female' | 'male' | 'unisex' | undefined)}
						style={styles.select}
					>
						<option value="">{dictionary.dashboard.seller?.listBib?.form?.genderPlaceholder}</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="unisex">Unisex</option>
					</select>
					{fieldErrors.gender && <p style={styles.fieldError}>{fieldErrors.gender}</p>}
				</div>

				<div>
					<label htmlFor="notes" style={styles.label}>
						{dictionary.dashboard.seller?.listBib?.form?.notes}:
					</label>
					<textarea
						id="notes"
						name="notes"
						placeholder={dictionary.dashboard.seller?.listBib?.form?.notesPlaceholder}
						rows={3}
						style={styles.input}
					/>
				</div>

				<p style={styles.subtleNote}>
					By listing this bib, you confirm that you are authorized to sell it and that it adheres to the event
					organizer's transfer policies. For unlisted events, ensure accuracy as this will be verified.
				</p>

				<button
					onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0070f3')}
					onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
					style={styles.button}
					type="submit"
				>
					{dictionary.dashboard.seller?.listBib?.form?.submit}
				</button>
			</form>
			<Link href="/dashboard/seller" style={styles.link}>
				{dictionary.dashboard.seller?.listBib?.backToDashboard}
			</Link>
		</div>
	)
}
