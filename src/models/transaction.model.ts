import type { User } from './user.model'
import type { Bib } from './bib.model'

export interface Transaction {
	amount: number
	bibId: Bib['id']
	buyerUserId: User['id']

	id: string
	paymentIntentId?: string
	platformFee: number
	sellerUserId: User['id']
	status: 'claimed' | 'failed' | 'pending' | 'refunded' | 'succeeded'
	transactionDate: Date
}
