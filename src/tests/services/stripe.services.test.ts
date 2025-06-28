import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockBib } from '@/tests/mocks/data'
import Stripe from 'stripe'

import { createPaymentIntent } from '@/services/stripe.services'
import { fetchBibById } from '@/services/bib.services'

// Mock the Stripe library
vi.mock('stripe', async () => {
	const actual = await vi.importActual('stripe')
	const stripeMock = {
		paymentIntents: {
			create: vi.fn(),
		},
	} as unknown as Stripe
	return {
		...actual,
		stripeMock, // Export the mock for testing purposes
		default: vi.fn(() => stripeMock),
	}
})

// Mock the fetchBibById function
vi.mock('@/services/bib.services', () => ({
	fetchBibById: vi.fn(),
}))

describe('stripe.services', () => {
	// Import the mocked stripeMock from the mocked module
	let stripeMock: Stripe & { paymentIntents: { create: ReturnType<typeof vi.fn> } }

	beforeEach(async () => {
		vi.clearAllMocks()
		// Reset environment variable for each test
		process.env.STRIPE_SECRET_KEY = 'sk_test_123'

		// Dynamically import the mocked stripe module to get the stripeMock instance
		const stripeModule = await import('stripe')
		stripeMock = (stripeModule as any).stripeMock // Access the exported mock
	})

	it('should create a payment intent successfully', async () => {
		;(fetchBibById as vi.Mock).mockResolvedValue(mockBib)
		stripeMock.paymentIntents.create.mockResolvedValue({
			client_secret: 'client_secret_123',
		})

		const clientSecret = await createPaymentIntent(mockBib.id)

		expect(fetchBibById).toHaveBeenCalledWith(mockBib.id)
		expect(stripeMock.paymentIntents.create).toHaveBeenCalledWith({
			metadata: { bibId: mockBib.id },
			currency: 'eur',
			amount: mockBib.price * 100,
		})
		expect(clientSecret).toBe('client_secret_123')
	})

	it('should throw an error if bibId is missing', async () => {
		await expect(createPaymentIntent('')).rejects.toThrow('Missing bibId')
		expect(fetchBibById).not.toHaveBeenCalled()
	})

	it('should throw an error if bib is not found', async () => {
		;(fetchBibById as vi.Mock).mockResolvedValue(null)
		await expect(createPaymentIntent(mockBib.id)).rejects.toThrow('Bib not found')
		expect(fetchBibById).toHaveBeenCalledWith(mockBib.id)
		expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
	})

	it('should throw an error if client_secret is null', async () => {
		;(fetchBibById as vi.Mock).mockResolvedValue(mockBib)
		stripeMock.paymentIntents.create.mockResolvedValue({
			client_secret: null,
		})

		await expect(createPaymentIntent(mockBib.id)).rejects.toThrow('Failed to create payment intent')
	})
})
