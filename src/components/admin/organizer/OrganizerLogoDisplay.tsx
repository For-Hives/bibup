import { getOrganizerLogoUrl } from '@/services/organizer.services'
import { Organizer } from '@/models/organizer.model'

interface OrganizerLogoDisplayProps {
	className?: string
	organizer: Organizer
	size?: 'lg' | 'md' | 'sm'
}

/**
 * Component to display organizer logo with proper PocketBase file URL handling
 * Follows PocketBase file handling documentation for thumbnail generation
 */
export default function OrganizerLogoDisplay({ size = 'md', organizer, className = '' }: OrganizerLogoDisplayProps) {
	// Define thumbnail sizes according to PocketBase documentation
	const thumbnailSizes = {
		sm: '64x64', // Small thumbnail
		md: '128x128', // Medium thumbnail
		lg: '256x256', // Large thumbnail
	}

	const logoUrl = getOrganizerLogoUrl(organizer, thumbnailSizes[size])

	if (!logoUrl) {
		// Fallback when no logo is available
		return (
			<div className={`flex items-center justify-center rounded-lg bg-gray-100 ${getSizeClasses(size)} ${className}`}>
				<span className="text-xs font-medium text-gray-400">{organizer.name.slice(0, 2).toUpperCase()}</span>
			</div>
		)
	}

	return (
		<img
			alt={`Logo de ${organizer.name}`}
			className={`rounded-lg object-cover ${getSizeClasses(size)} ${className}`}
			onError={e => {
				// Fallback to original file if thumbnail fails
				const originalUrl = getOrganizerLogoUrl(organizer)
				if (originalUrl && e.currentTarget.src !== originalUrl) {
					e.currentTarget.src = originalUrl
				} else {
					// Hide image if original also fails
					e.currentTarget.style.display = 'none'
				}
			}}
			src={logoUrl}
		/>
	)
}

function getSizeClasses(size: 'lg' | 'md' | 'sm'): string {
	switch (size) {
		case 'lg':
			return 'w-64 h-64'
		case 'md':
			return 'w-32 h-32'
		case 'sm':
			return 'w-16 h-16'
		default:
			return 'w-32 h-32'
	}
}
