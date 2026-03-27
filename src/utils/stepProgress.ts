import type { SessionPhase } from '@/types/session'

export const STEPS: { phase: SessionPhase; label: string }[] = [
  { phase: 'challenge',    label: 'The Setup'    },
  { phase: 'agenda',       label: 'Agenda'       },
  { phase: 'draw',         label: 'The Draw'     },
  { phase: 'deliberation', label: 'Deliberation' },
  { phase: 'synthesis',    label: 'Synthesis'    },
]

export const TOTAL_STEPS = STEPS.length

export function getStepNumber(phase: SessionPhase): number {
  return STEPS.findIndex((s) => s.phase === phase) + 1
}

export function getProgressPercent(phase: SessionPhase): number {
  const step = getStepNumber(phase)
  return ((step - 1) / (TOTAL_STEPS - 1)) * 80 + 10
}
