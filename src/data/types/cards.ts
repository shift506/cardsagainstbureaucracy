export type CardCategory = 'barrier' | 'enabler' | 'theory' | 'tool' | 'provocation' | 'agenda'

interface BaseCard {
  id: string
  title: string
  category: CardCategory
  color: string
}

export interface BarrierCard extends BaseCard {
  category: 'barrier'
  description: string
  whyItMatters: string
  howItShowsUp: string[]
  howToCounteract: string[]
  reflectionPrompt: string
  examples: string[]
}

export interface EnablerCard extends BaseCard {
  category: 'enabler'
  description: string
  whyItMatters: string
  howToUseIt: string[]
  reflectionPrompt: string
  examples: string[]
}

export interface TheoryCard extends BaseCard {
  category: 'theory'
  description: string
  whyItMatters: string
  howItShowsUp?: string[]
  howToUseIt: string[]
  reflectionPrompts: string[]
  examples: string[]
}

export interface ToolCard extends BaseCard {
  category: 'tool'
  description: string
  whyItMatters: string
  howItShowsUp: string[]
  howToUseIt: string[]
  reflectionPrompts: string[]
}

export interface AgendaCard extends BaseCard {
  category: 'agenda'
  transformationType: string
  statement: string
  examples: Array<{ label: string; exemplar: string }>
  designProvocation: string
}

export interface ProvocationCard extends BaseCard {
  category: 'provocation'
  description?: string
  [key: string]: unknown
}

export type TransformationCard =
  | BarrierCard
  | EnablerCard
  | TheoryCard
  | ToolCard
  | AgendaCard
  | ProvocationCard

// Type guards
export const isBarrier = (c: TransformationCard): c is BarrierCard => c.category === 'barrier'
export const isEnabler = (c: TransformationCard): c is EnablerCard => c.category === 'enabler'
export const isTheory = (c: TransformationCard): c is TheoryCard => c.category === 'theory'
export const isTool = (c: TransformationCard): c is ToolCard => c.category === 'tool'
export const isAgenda = (c: TransformationCard): c is AgendaCard => c.category === 'agenda'
export const isProvocation = (c: TransformationCard): c is ProvocationCard => c.category === 'provocation'

export const CATEGORY_META: Record<CardCategory, { label: string; color: string }> = {
  barrier:    { label: 'Barriers',    color: '#E8A98C' },
  enabler:    { label: 'Enablers',    color: '#BAE0C6' },
  theory:     { label: 'Theories',    color: '#3B8EA5' },
  tool:       { label: 'Tools',       color: '#D6DE23' },
  provocation:{ label: 'Provocations',color: '#B8C4C8' },
  agenda:     { label: 'Agenda',      color: '#B8C4C8' },
}
