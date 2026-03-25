export type CardCategory = 'barrier' | 'enabler' | 'theory' | 'tool' | 'provocation' | 'agenda'

export interface DrawnCard {
  id: string
  title: string
  category: CardCategory
  color: string
  description: string
  imageIndex: number
  // suit-specific fields passed through
  [key: string]: unknown
}

export interface ChallengeInput {
  name: string
  context: string
  stakeholders: string
  stakes: string
  transformFrom: string
  transformTo: string
  transformSoThat: string
}

export type PersonaId = 'critic' | 'optimist' | 'academic' | 'practitioner' | 'philosopher' | 'lead'

export interface PersonaResponse {
  personaId: PersonaId
  content: string
  isStreaming: boolean
}

export type SessionPhase = 'challenge' | 'agenda' | 'draw' | 'deliberation' | 'dialogue' | 'synthesis'

export interface SelectedAgenda {
  id: string
  title: string
  transformationType: string
  statement: string
  designProvocation: string
}

export interface SessionState {
  phase: SessionPhase
  email: string
  challengeInput: ChallengeInput | null
  selectedAgenda: SelectedAgenda | null
  drawnCards: Partial<Record<CardCategory, DrawnCard>>
  personaResponses: PersonaResponse[]
  dialogueMessages: Array<{ personaId: PersonaId; content: string }>
  synthesis: string | null
  isFacilitatorStreaming: boolean
}
