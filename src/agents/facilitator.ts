/**
 * @role Facilitator — orchestrates the Cards Against Bureaucracy session
 * @allowed_tools Vercel proxy → Anthropic API (server-side)
 * @escalation_path User is shown error if API call fails; session state preserved
 */
import type { ChallengeInput, SelectedAgenda, DrawnCard, CardCategory } from '@/types/session'
import type { PersonaId } from '@/types/session'
import { PERSONAS, getPersona } from './personas'
import { getCardById } from '@/data/cards/index'
import {
  isBarrier, isEnabler, isTheory, isTool, isProvocation,
} from '@/data/types/cards'

function buildChallengeContext(input: ChallengeInput): string {
  return `CHALLENGE: ${input.name}
CONTEXT: ${input.context}
STAKEHOLDERS: ${input.stakeholders}
STAKES: ${input.stakes}
TRANSFORMATION: From "${input.transformFrom}" to "${input.transformTo}" so that "${input.transformSoThat}"`
}

function buildAgendaContext(agenda: SelectedAgenda | null): string {
  if (!agenda) return ''
  return `\nCHANGE AGENDA: ${agenda.title}
AGENDA TYPE: ${agenda.transformationType}
AGENDA STATEMENT: ${agenda.statement}
DESIGN PROVOCATION: ${agenda.designProvocation}`
}

function buildRichCardContext(drawnCards: Partial<Record<CardCategory, DrawnCard>>): string {
  const PERSONA_ORDER: PersonaId[] = ['critic', 'optimist', 'academic', 'practitioner', 'philosopher']
  const sections: string[] = []

  for (const personaId of PERSONA_ORDER) {
    const persona = getPersona(personaId)
    const drawn = drawnCards[persona.suit]
    if (!drawn) continue

    const card = getCardById(drawn.id)
    if (!card) continue

    let content = `[${persona.name.toUpperCase()} — ${card.title}]\n`

    if (isProvocation(card)) {
      content += `Quote: "${card.quote}" — ${card.attribution}\n`
      content += `Core Question: ${card.coreQuestion}\n`
      if (card.howToUseIt?.length) content += `How to use: ${card.howToUseIt.join(' | ')}\n`
      if (card.reflectionPrompts?.length) content += `Reflections: ${card.reflectionPrompts.join(' | ')}`
    } else if (isBarrier(card)) {
      content += `Description: ${card.description}\n`
      content += `Why it matters: ${card.whyItMatters}\n`
      if (card.howItShowsUp?.length) content += `How it shows up: ${card.howItShowsUp.join(' | ')}\n`
      if (card.howToCounteract?.length) content += `How to counteract: ${card.howToCounteract.join(' | ')}\n`
      content += `Reflection: ${card.reflectionPrompt}`
    } else if (isEnabler(card)) {
      content += `Description: ${card.description}\n`
      content += `Why it matters: ${card.whyItMatters}\n`
      if (card.howToUseIt?.length) content += `How to use: ${card.howToUseIt.join(' | ')}\n`
      content += `Reflection: ${card.reflectionPrompt}`
    } else if (isTheory(card) || isTool(card)) {
      content += `Description: ${card.description}\n`
      content += `Why it matters: ${card.whyItMatters}\n`
      if (card.howToUseIt?.length) content += `How to use: ${card.howToUseIt.join(' | ')}\n`
      if (card.reflectionPrompts?.length) content += `Reflections: ${card.reflectionPrompts.join(' | ')}`
    }

    sections.push(content)
  }

  return '\n\nTHE SPREAD:\n' + sections.join('\n\n')
}

export interface StreamCallbacks {
  onChunk: (personaId: PersonaId, chunk: string) => void
  onComplete: (personaId: PersonaId) => void
  onError: (personaId: PersonaId, error: Error) => void
}

async function* streamFromProxy(
  system: string,
  messages: Array<{ role: string; content: string }>,
  max_tokens: number,
  model: string
): AsyncGenerator<string> {
  const response = await fetch('/api/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, system, messages, max_tokens }),
  })

  if (!response.ok) throw new Error(`Proxy error: ${response.status}`)
  if (!response.body) throw new Error('No response body')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6)
      if (data === '[DONE]') return
      const parsed = JSON.parse(data)
      if (parsed.error) throw new Error(parsed.error)
      if (parsed.text) yield parsed.text
    }
  }
}

export async function runSynthesis(
  challenge: ChallengeInput,
  agenda: SelectedAgenda | null,
  drawnCards: Partial<Record<CardCategory, DrawnCard>>,
  callbacks: Pick<StreamCallbacks, 'onChunk' | 'onComplete' | 'onError'>
): Promise<void> {
  const lead = PERSONAS.find((p) => p.id === 'lead')!
  const challengeCtx = buildChallengeContext(challenge)
  const agendaCtx = buildAgendaContext(agenda)
  const cardCtx = buildRichCardContext(drawnCards)

  const userMessage = `${challengeCtx}${agendaCtx}${cardCtx}\n\nPlease synthesize the full spread into the structured output format.`

  try {
    for await (const text of streamFromProxy(
      lead.systemPrompt,
      [{ role: 'user', content: userMessage }],
      1200,
      'claude-sonnet-4-20250514'
    )) {
      callbacks.onChunk('lead', text)
    }

    callbacks.onComplete('lead')
  } catch (err) {
    callbacks.onError('lead', err instanceof Error ? err : new Error(String(err)))
  }
}
