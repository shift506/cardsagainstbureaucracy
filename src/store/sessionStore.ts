import { create } from 'zustand'
import type {
  SessionPhase,
  ChallengeInput,
  SelectedAgenda,
  DrawnCard,
  CardCategory,
  PersonaResponse,
  PersonaId,
  SessionState,
} from '@/types/session'

interface SessionActions {
  setPhase: (phase: SessionPhase) => void
  setChallengeInput: (input: ChallengeInput) => void
  setSelectedAgenda: (agenda: SelectedAgenda) => void
  drawCard: (category: CardCategory, card: DrawnCard) => void
  clearDrawnCards: () => void
  addPersonaResponse: (response: PersonaResponse) => void
  updatePersonaResponse: (personaId: PersonaId, chunk: string) => void
  finalizePersonaResponse: (personaId: PersonaId) => void
  addDialogueMessage: (personaId: PersonaId, content: string) => void
  setSynthesis: (content: string) => void
  setFacilitatorStreaming: (value: boolean) => void
  reset: () => void
}

const initialState: SessionState = {
  phase: 'challenge',
  challengeInput: null,
  selectedAgenda: null,
  drawnCards: {},
  personaResponses: [],
  dialogueMessages: [],
  synthesis: null,
  isFacilitatorStreaming: false,
}

export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  setChallengeInput: (input) => set({ challengeInput: input }),

  setSelectedAgenda: (agenda) => set({ selectedAgenda: agenda }),

  drawCard: (category, card) =>
    set((state) => ({
      drawnCards: { ...state.drawnCards, [category]: card },
    })),

  clearDrawnCards: () => set({ drawnCards: {} }),

  addPersonaResponse: (response) =>
    set((state) => ({
      personaResponses: [...state.personaResponses, response],
    })),

  updatePersonaResponse: (personaId, chunk) =>
    set((state) => ({
      personaResponses: state.personaResponses.map((r) =>
        r.personaId === personaId ? { ...r, content: r.content + chunk } : r
      ),
    })),

  finalizePersonaResponse: (personaId) =>
    set((state) => ({
      personaResponses: state.personaResponses.map((r) =>
        r.personaId === personaId ? { ...r, isStreaming: false } : r
      ),
    })),

  addDialogueMessage: (personaId, content) =>
    set((state) => ({
      dialogueMessages: [...state.dialogueMessages, { personaId, content }],
    })),

  setSynthesis: (content) => set({ synthesis: content }),

  setFacilitatorStreaming: (value) => set({ isFacilitatorStreaming: value }),

  reset: () => set(initialState),
}))
