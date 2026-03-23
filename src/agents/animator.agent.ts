/**
 * @role Animator — generates Framer Motion variant code via Anthropic API.
 * @allowed-tools read-file, write-file, read-motion-config
 * @escalation-path Orchestrator if variant conflicts with existing presets.
 */
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export interface AnimatorInput {
  componentName: string
  description: string
  preset?: string
}

export interface AnimatorOutput {
  variants: string
  hookCode: string
}

export async function generateAnimation(input: AnimatorInput): Promise<AnimatorOutput> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: `You generate Framer Motion variant objects for React components.
Use only named spring/ease presets from motion.config.tsx (springs.default, springs.bouncy, springs.stiff, springs.gentle).
Return JSON: { variants: string (TypeScript code), hookCode: string (TypeScript code) }`,
    messages: [{ role: 'user', content: JSON.stringify(input) }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  try {
    return JSON.parse(text) as AnimatorOutput
  } catch {
    return { variants: '', hookCode: '' }
  }
}
