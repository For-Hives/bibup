'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface FAQClientProps {
	translations: {
		faq: {
			description: string
			items: FaqItem[]
			support: {
				buttonText: string
				buttonUrl: string
				description: string
				heading: string
			}
			title: string
		}
	}
}

interface FaqItem {
	answer: string
	id: string
	question: string
}

export default function FAQClient({ translations }: FAQClientProps) {
	const { faq } = translations

	return (
		<section className="py-16 md:py-24">
			<div className="container mx-auto max-w-4xl space-y-16 px-4">
				{/* Header */}
				<div className="mx-auto flex max-w-3xl flex-col text-center">
					<h2 className="text-foreground mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl">{faq.title}</h2>
					<p className="text-muted-foreground lg:text-lg">{faq.description}</p>
				</div>

				{/* FAQ Accordion */}
				<Accordion className="mx-auto w-full lg:max-w-3xl" collapsible type="single">
					{faq.items.map(item => (
						<AccordionItem className="border-border/30" key={item.id} value={item.id}>
							<AccordionTrigger className="text-left font-medium transition-opacity duration-200 hover:no-underline hover:opacity-60 sm:py-1 lg:py-2 lg:text-lg">
								<div className="font-medium">{item.question}</div>
							</AccordionTrigger>
							<AccordionContent className="sm:mb-1 lg:mb-2">
								<div className="text-muted-foreground lg:text-lg">{item.answer}</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				{/* Support Section */}
				<div className="bg-accent/50 mx-auto flex max-w-4xl flex-col items-center rounded-lg p-4 text-center md:rounded-xl md:p-6 lg:p-8">
					<div className="relative mb-6">
						<Avatar className="absolute mb-4 size-16 origin-bottom -translate-x-[60%] scale-[80%] border md:mb-5">
							<AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face" />
							<AvatarFallback>SU</AvatarFallback>
						</Avatar>
						<Avatar className="absolute mb-4 size-16 origin-bottom translate-x-[60%] scale-[80%] border md:mb-5">
							<AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" />
							<AvatarFallback>SU</AvatarFallback>
						</Avatar>
						<Avatar className="mb-4 size-16 border md:mb-5">
							<AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
							<AvatarFallback>SU</AvatarFallback>
						</Avatar>
					</div>

					<h3 className="mb-2 max-w-3xl font-semibold lg:text-lg">{faq.support.heading}</h3>
					<p className="text-muted-foreground mb-8 max-w-3xl lg:text-lg">{faq.support.description}</p>

					<div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
						<Button asChild className="w-full sm:w-auto">
							<a href={faq.support.buttonUrl}>{faq.support.buttonText}</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
	)
}
