'use client'

import { PhoneCall } from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FAQClientProps {
	translations: {
		faq: {
			badge: string
			contactButton: string
			description: string
			items: FaqItem[]
			support: {
				buttonUrl: string
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
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="grid gap-10 lg:grid-cols-2">
					{/* Left Column - Intro */}
					<div className="flex flex-col gap-10">
						<div className="flex flex-col gap-4">
							<div>
								<Badge variant="outline">{faq.badge}</Badge>
							</div>
							<div className="flex flex-col gap-2">
								<h4 className="font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl">{faq.title}</h4>
								<p className="text-muted-foreground max-w-xl text-left leading-relaxed tracking-tight lg:max-w-lg lg:text-lg">
									{faq.description}
								</p>
							</div>
							<div className="">
								<Button asChild className="gap-4" variant="outline">
									<a href={faq.support.buttonUrl}>
										{faq.contactButton} <PhoneCall className="h-4 w-4" />
									</a>
								</Button>
							</div>
						</div>
					</div>

					{/* Right Column - Accordion */}
					<Accordion className="w-full" collapsible type="single">
						{faq.items.map(item => (
							<AccordionItem key={item.id} value={item.id}>
								<AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
								<AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</div>
	)
}
