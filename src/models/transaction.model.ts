import type { User } from './user.model'

export interface Transaction {
	amount: number
	bibId: string
	buyerUserId: User['id']
	createdAt: Date
	id: string
	paymentIntentId?: string
	platformFee: number
	sellerUserId: User['id']
	status: 'claimed' | 'failed' | 'pending' | 'refunded' | 'succeeded'
	transactionDate: Date
}
