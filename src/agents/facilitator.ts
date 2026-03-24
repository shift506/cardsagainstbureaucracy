/**
 * @role Facilitator — orchestrates the Cards Against Bureaucracy session
 * @allowed_tools Vercel proxy → Anthropic API (server-side)
 * @escalation_path User is shown error if API call fails; session state preserved
 */
import type { ChallengeInput, SelectedAgenda, DrawnCard, CardCategory, PersonaId, PersonaResponse } from '@/types/session'
import { PERSONAS, getPersona } from './personas'

const DELIBERATION_ORDER: PersonaId[] = ['critic', 'optimist', 'academic', 'practitioner', 'philosopher']

function buildChallengeContext(input: ChallengeInput): string {
  return `CHALLENGE: ${input.name}
CONTEXT: ${input.context}
STAKEHOLDERS: ${input.stakeholders}
STAKES: ${input.stakes}
TRANSFORMATION: We are transforming from "${input.transformFrom}" to "${input.transformTo}" so that "${input.transformSoThat}"`
}

function buildCardContext(personaId: PersonaId, drawnCards: Partial<Record<CardCategory, DrawnCard>>): string {
  const persona = getPersona(personaId)
  const card = drawnCards[persona.suit]
  if (!card) return ''
  return `Your drawn card: "${card.title}" — ${card.description}`
}

function buildDeliberationContext(responses: PersonaResponse[]): string {
  if (!responses.length) return ''
  return '\n\nPREVIOUS DELIBERATION:\n' + responses
    .filter((r) => !r.isStreaming)
    .map((r) => {
      const p = getPersona(r.personaId)
      return `${p.name}:\n${r.content}`
    })
    .join('\n\n---\n\n')
}

function buildAgendaContext(agenda: SelectedAgenda | null): string {
  if (!agenda) return ''
  return `\nCHANGE AGENDA: ${agenda.title}
AGENDA TYPE: ${agenda.transformationType}
AGENDA STATEMENT: ${agenda.statement}
DESIGN PROVOCATION: ${agenda.designProvocation}`
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

export async function runDeliberation(
  challenge: ChallengeInput,
  agenda: SelectedAgenda | null,
  drawnCards: Partial<Record<CardCategory, DrawnCard>>,
  existingResponses: PersonaResponse[],
  callbacks: StreamCallbacks
): Promise<void> {
  const pendingPersonas = DELIBERATION_ORDER.filter(
    (id) => !existingResponses.some((r) => r.personaId === id && !r.isStreaming)
  )

  for (const personaId of pendingPersonas) {
    const persona = getPersona(personaId)
    const challengeCtx = buildChallengeContext(challenge)
    const agendaCtx = buildAgendaContext(agenda)
    const cardCtx = buildCardContext(personaId, drawnCards)
    const deliberationCtx = buildDeliberationContext(existingResponses)

    const userMessage = `${challengeCtx}${agendaCtx}\n\n${cardCtx}${deliberationCtx}\n\nPlease give your perspective in 150 words or fewer. Be direct and specific.`

    try {
      let accumulatedText = ''
      for await (const text of streamFromProxy(
        persona.systemPrompt,
        [{ role: 'user', content: userMessage }],
        250,
        'claude-sonnet-4-20250514'
      )) {
        accumulatedText += text
        callbacks.onChunk(personaId, text)
      }

      callbacks.onComplete(personaId)
      existingResponses = [...existingResponses, { personaId, content: accumulatedText, isStreaming: false }]
    } catch (err) {
      callbacks.onError(personaId, err instanceof Error ? err : new Error(String(err)))
    }
  }
}

export async function runSynthesis(
  challenge: ChallengeInput,
  agenda: SelectedAgenda | null,
  _drawnCards: Partial<Record<CardCategory, DrawnCard>>,
  responses: PersonaResponse[],
  callbacks: Pick<StreamCallbacks, 'onChunk' | 'onComplete' | 'onError'>
): Promise<void> {
  const lead = PERSONAS.find((p) => p.id === 'lead')!
  const challengeCtx = buildChallengeContext(challenge)
  const agendaCtx = buildAgendaContext(agenda)
  const deliberationCtx = buildDeliberationContext(responses)

  const userMessage = `${challengeCtx}${agendaCtx}${deliberationCtx}\n\nPlease synthesize the deliberation into the structured output format.`

  try {
    for await (const text of streamFromProxy(
      lead.systemPrompt,
      [{ role: 'user', content: userMessage }],
      900,
      'claude-sonnet-4-20250514'
    )) {
      callbacks.onChunk('lead', text)
    }

    callbacks.onComplete('lead')
  } catch (err) {
    callbacks.onError('lead', err instanceof Error ? err : new Error(String(err)))
  }
}
