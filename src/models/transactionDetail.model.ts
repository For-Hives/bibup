import { Transaction } from './transaction.model'

export interface TransactionDetail {
	address: string
	beneficiaryFirstName: string
	beneficiaryLastName: string
	club?: string
	dateOfBirth: Date
	emergencyContact: {
		name: string
		phone: string
	}
	ffaNumber?: string
	id: string
	medicalCertificateUrl?: string
	// replicate event options if needed
	optionValues: Record<string, string>
	transactionId: Transaction['id']
}
