import { Plus, Trash2 } from 'lucide-react'

import { EventOption } from '@/models/eventOption.model'

import { Input } from '../../ui/inputAlt'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Translations } from './types'

interface EventOptionCardProps {
	onAddValue: (optionIndex: number) => void
	onRemove: (index: number) => void
	onRemoveValue: (optionIndex: number, valueIndex: number) => void
	onUpdate: (index: number, field: keyof EventOption, value: boolean | string | string[]) => void
	onUpdateValue: (optionIndex: number, valueIndex: number, value: string) => void
	option: EventOption
	optionIndex: number
	translations: Translations
}

export default function EventOptionCard({
	translations,
	optionIndex,
	option,
	onUpdateValue,
	onUpdate,
	onRemoveValue,
	onRemove,
	onAddValue,
}: EventOptionCardProps) {
	return (
		<div className="border-border/50 bg-card/50 rounded-2xl border p-6 shadow-md backdrop-blur-sm">
			<div className="mb-6 flex items-center justify-between">
				<h3 className="text-foreground text-lg font-medium">Option {optionIndex + 1}</h3>
				<Button onClick={() => onRemove(optionIndex)} size="sm" type="button" variant="outline">
					<Trash2 className="size-4" />
				</Button>
			</div>

			<div className="mb-6 grid grid-cols-2 gap-6">
				<div>
					<Label className="text-foreground mb-2 block text-base font-medium" htmlFor={`option-key-${optionIndex}`}>
						{translations.event.eventOptions.optionKey}
					</Label>
					<Input
						id={`option-key-${optionIndex}`}
						onChange={e => onUpdate(optionIndex, 'key', e.target.value)}
						placeholder="size"
						type="text"
						value={option.key}
					/>
				</div>
				<div>
					<Label className="text-foreground mb-2 block text-base font-medium" htmlFor={`option-label-${optionIndex}`}>
						{translations.event.eventOptions.optionName}
					</Label>
					<Input
						id={`option-label-${optionIndex}`}
						onChange={e => onUpdate(optionIndex, 'label', e.target.value)}
						placeholder="Taille"
						type="text"
						value={option.label}
					/>
				</div>
			</div>

			<div className="mb-6">
				<div className="flex items-center gap-3">
					<input
						checked={option.required}
						className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
						id={`option-required-${optionIndex}`}
						onChange={e => onUpdate(optionIndex, 'required', e.target.checked)}
						type="checkbox"
					/>
					<Label className="text-foreground text-base font-medium" htmlFor={`option-required-${optionIndex}`}>
						{translations.event.eventOptions.optionRequired}
					</Label>
				</div>
			</div>

			<div>
				<div className="mb-4 flex items-center justify-between">
					<Label className="text-foreground text-base font-medium">
						{translations.event.eventOptions.values.label}
					</Label>
					<Button onClick={() => onAddValue(optionIndex)} size="sm" type="button" variant="outline">
						<Plus className="size-4" />
					</Button>
				</div>
				{option.values.map((value, valueIndex) => (
					<div className="mb-3 flex items-center gap-3" key={valueIndex}>
						<Input
							onChange={e => onUpdateValue(optionIndex, valueIndex, e.target.value)}
							placeholder={translations.event.eventOptions.values.placeholder}
							type="text"
							value={value}
						/>
						{option.values.length > 1 && (
							<Button onClick={() => onRemoveValue(optionIndex, valueIndex)} size="sm" type="button" variant="outline">
								<Trash2 className="size-4" />
							</Button>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
