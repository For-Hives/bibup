'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

import { fetchUserByClerkId } from '@/services/user.services'
import { User } from '@/models/user.model'

interface UseAdminAccessReturn {
	isAdmin: boolean
	isLoading: boolean
	user: null | User
}

/**
 * Client-side hook to check admin access
 * Redirects to unauthorized page if user is not admin
 */
export function useAdminAccess(redirectOnFail = true): UseAdminAccessReturn {
	const { user: clerkUser, isLoaded } = useUser()
	const router = useRouter()
	const [beswibUser, setBeswibUser] = useState<null | User>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const checkAccess = async () => {
			if (!isLoaded) return

			// If not signed in and should redirect
			if (!clerkUser) {
				if (redirectOnFail) {
					router.push('/sign-in?redirectUrl=' + encodeURIComponent(window.location.pathname))
				}
				setIsLoading(false)
				return
			}

			try {
				// Fetch user data from PocketBase
				const user = await fetchUserByClerkId(clerkUser.id)

				if (!user) {
					if (redirectOnFail) {
						router.push('/unauthorized')
					}
					setIsLoading(false)
					return
				}

				setBeswibUser(user)

				// Check if user has admin role - using roles array
				if (!user.roles.includes('admin')) {
					if (redirectOnFail) {
						router.push('/unauthorized')
					}
				}

				setIsLoading(false)
			} catch (error) {
				console.error('Error checking admin access:', error)
				if (redirectOnFail) {
					router.push('/unauthorized')
				}
				setIsLoading(false)
			}
		}

		void checkAccess()
	}, [clerkUser, isLoaded, router, redirectOnFail])

	return {
		user: beswibUser,
		isLoading,
		isAdmin: beswibUser?.roles.includes('admin') ?? false,
	}
}

/**
 * Client-side hook to get current user without redirects
 */
export function useCurrentUser(): { isLoading: boolean; user: null | User } {
	const { user: clerkUser, isLoaded } = useUser()
	const [beswibUser, setBeswibUser] = useState<null | User>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchUser = async () => {
			if (!isLoaded) return

			if (!clerkUser) {
				setIsLoading(false)
				return
			}

			try {
				const user = await fetchUserByClerkId(clerkUser.id)
				setBeswibUser(user)
				setIsLoading(false)
			} catch (error) {
				console.error('Error fetching current user:', error)
				setIsLoading(false)
			}
		}

		void fetchUser()
	}, [clerkUser, isLoaded])

	return {
		user: beswibUser,
		isLoading,
	}
}
