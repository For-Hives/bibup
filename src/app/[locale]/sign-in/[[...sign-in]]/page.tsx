import { SignIn } from '@clerk/nextjs'

export default function Page() {
	return (
		// center the sign-in form
		<div className="flex h-full items-center justify-center">
			<SignIn />
		</div>
	)
}
