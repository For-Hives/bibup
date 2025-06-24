'use client'

import { LayoutDashboard, Settings, ShoppingBag, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useUser } from '@clerk/nextjs'

import { DropdownMenuAnimated } from '@/components/ui/dropdown-menu-animated'

import { checkIsCurrentUserAdmin } from './adminActions'

interface DashboardDropdownProps {
	translations: {
		navbar: {
			buyBibLink: string
			dashboardLink: string
			sellBibLink: string
		}
	}
}

export default function DashboardDropdown({ translations: t }: DashboardDropdownProps) {
	const { user: clerkUser, isLoaded } = useUser()
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		if (!isLoaded || !clerkUser) {
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
			}
		}

		void checkAdminStatus()
	}, [clerkUser, isLoaded])

	const baseOptions = [
		{
			onClick: () => (window.location.href = '/dashboard'),
			label: t.navbar.dashboardLink,
			Icon: <LayoutDashboard className="h-4 w-4" />,
		},
		{
			onClick: () => (window.location.href = '/marketplace'),
			label: t.navbar.buyBibLink,
			Icon: <ShoppingBag className="h-4 w-4" />,
		},
		{
			onClick: () => (window.location.href = '/dashboard/seller/sell-bib'),
			label: t.navbar.sellBibLink,
			Icon: <Tag className="h-4 w-4" />,
		},
	]

	// Add admin option if user is admin
	const options = isAdmin
		? [
				...baseOptions,
				{
					onClick: () => (window.location.href = '/admin'),
					label: 'Admin',
					Icon: <Settings className="h-4 w-4" />,
				},
			]
		: baseOptions

	return <DropdownMenuAnimated options={options}>Dashboard</DropdownMenuAnimated>
}
