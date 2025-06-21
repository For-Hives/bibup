'use client'

import { useEffect, useState } from 'react'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

import { checkIsCurrentUserAdmin } from './adminActions'

export default function AdminLinkWrapper() {
	const { user: clerkUser, isLoaded } = useUser()
	const [isAdmin, setIsAdmin] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (!isLoaded || !clerkUser) {
			setIsLoading(false)
			setIsAdmin(false)
			return
		}

		async function checkAdminStatus() {
			try {
				const adminStatus = await checkIsCurrentUserAdmin()
				setIsAdmin(adminStatus)
			} catch (error) {
				console.error('Error checking admin status:', error)
				setIsAdmin(false)
			} finally {
				setIsLoading(false)
			}
		}

		void checkAdminStatus()
	}, [clerkUser, isLoaded])

	if (isLoading || !isAdmin) {
		return null
	}

	return (
		<Link
			className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
			href="/admin"
		>
			Admin
		</Link>
	)
}
