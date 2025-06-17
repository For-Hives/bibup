'use client'

import { Loader2, Send } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import type React from 'react'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Simulate form submission
		setTimeout(() => {
			setIsSubmitting(false)
			setIsSubmitted(true)
		}, 1500)
	}

	if (isSubmitted) {
		return (
			<motion.div
				animate={{ y: 0, opacity: 1 }}
				className="flex h-full flex-col items-center justify-center p-6 text-center"
				initial={{ y: 10, opacity: 0 }}
			>
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
					<svg
						className="h-8 w-8 text-green-600 dark:text-green-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
					</svg>
				</div>
				<h3 className="mb-2 text-xl font-bold">Message Sent!</h3>
				<p className="text-slate-600 dark:text-slate-300">We'll get back to you as soon as possible.</p>
				<Button className="mt-4" onClick={() => setIsSubmitted(false)} variant="outline">
					Send another message
				</Button>
			</motion.div>
		)
	}

	return (
		<form className="h-full space-y-4" onSubmit={handleSubmit}>
			<div>
				<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Your name
				</label>
				<Input
					id="name"
					className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50"
					placeholder="Your name"
					required
				/>
			</div>
			<div>
				<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Your email
				</label>
				<Input
					id="email"
					className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50"
					placeholder="Your email"
					required
					type="email"
				/>
			</div>
			<div className="flex-1">
				<Textarea
					className="h-[120px] resize-none border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50"
					placeholder="Your message"
					required
				/>
			</div>
			<Button
				className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700"
				disabled={isSubmitting}
				type="submit"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Sending...
					</>
				) : (
					<>
						<Send className="mr-2 h-4 w-4" />
						Send Message
					</>
				)}
			</Button>
		</form>
	)
}
