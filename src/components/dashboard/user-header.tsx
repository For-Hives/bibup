'use client'

import { UserButton } from '@clerk/nextjs'

interface SerializedClerkUser {
	emailAddresses: { emailAddress: string; id: string }[]
	firstName: null | string
	id: string
	imageUrl: string
	lastName: null | string
	username: null | string
}

interface UserHeaderProps {
	clerkUser: SerializedClerkUser
}

export default function UserHeader({ clerkUser }: Readonly<UserHeaderProps>) {
	const userName = clerkUser.firstName ?? clerkUser.emailAddresses[0]?.emailAddress ?? 'User'

	return (
		<div className="bg-card/25 border-border/30 absolute top-0 right-0 left-0 z-20 container mx-auto mt-12 mb-6 rounded-2xl border p-4 backdrop-blur-sm">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-muted-foreground text-sm">Welcome back</p>
				</div>

				<div className="flex items-center justify-end gap-4">
					<div className="flex flex-col items-end gap-2">
						<div className="bg-primary/10 text-primary w-fit rounded-full px-3 py-1 text-xs font-medium">MEMBER</div>
						<p className="text-foreground font-medium">
							{userName}
							{clerkUser.emailAddresses[0] !== undefined && (
								<span className="text-muted-foreground ml-2 text-sm">({clerkUser.emailAddresses[0].emailAddress})</span>
							)}
						</p>
					</div>
					<UserButton />
				</div>
			</div>
		</div>
	)
}
