'use client'

import { Loader2, Send } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import type React from 'react'

import globalTranslations from '@/components/global/locales.json'
import { getTranslations } from '@/lib/getDictionary'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ContactFormProps {
	t: ReturnType<typeof getTranslations<(typeof globalTranslations)['en']['contact'], 'en'>>
}

export default function ContactForm({ t }: ContactFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Simulate form submission
		setTimeout(() => {
			setIsSubmitting(false) // TODO: implement actual form submission logic here
			setIsSubmitted(true)
		}, 1500)
	}

	if (isSubmitted) {
		return (
			<motion.div
				animate={{ y: 0, opacity: 1 }}
				className="flex h-full flex-col items-center justify-center text-center"
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
				<h3 className="mb-2 text-xl font-bold">{t.form.messageSent}</h3>
				<p className="text-slate-600 dark:text-slate-300">{t.form.messageResponse}</p>
				<Button className="mt-4" onClick={() => setIsSubmitted(false)} variant="outline">
					{t.form.sendAnotherMessage}
				</Button>
			</motion.div>
		)
	}

	return (
		<form className="mt-4 h-full space-y-4" onSubmit={handleSubmit}>
			<div>
				<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
					{t.form.yourName}
				</label>
				<Input
					className="border-foreground/60 ring-foreground/40 bg-white/50 ring-2 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-800/50"
					id="name"
					placeholder={t.form.yourNamePlaceholder}
					required
				/>
			</div>
			<div>
				<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
					{t.form.yourEmail}
				</label>
				<Input
					className="border-foreground/60 ring-foreground/40 bg-white/50 ring-2 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-800/50 dark:focus:ring-slate-700"
					id="email"
					placeholder={t.form.yourEmailPlaceholder}
					required
					type="email"
				/>
			</div>
			<div className="flex-1">
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="message">
					{t.form.yourMessage}
				</label>
				<Textarea
					className="border-foreground/60 ring-foreground/40 h-[120px] resize-none bg-white/50 ring-2 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-800/50"
					id="message"
					placeholder={t.form.yourMessagePlaceholder}
					required
				/>
			</div>
			<Button
				className="from-primary to-primary/80 hover:from-primary/80 hover:to-primary w-full cursor-pointer bg-gradient-to-r text-white"
				disabled={isSubmitting}
				type="submit"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						{t.form.sending}
					</>
				) : (
					<>
						<Send className="mr-2 h-4 w-4" />
						{t.form.sendMessage}
					</>
				)}
			</Button>
		</form>
	)
}
