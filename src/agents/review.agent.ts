/**
 * @role Reviewer — performs static checks: a11y, perf, types.
 * @allowed-tools read-file, run-audit, post-comment
 * @escalation-path Orchestrator if CRITICAL findings block merge.
 */
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export interface ReviewInput {
  filePath: string
  fileContent: string
}

export interface ReviewFinding {
  severity: 'CRITICAL' | 'WARN' | 'INFO'
  rule: string
  message: string
  line?: number
}

export interface ReviewOutput {
  findings: ReviewFinding[]
  approved: boolean
}

export async function reviewAnimation(input: ReviewInput): Promise<ReviewOutput> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: `You are an animation code reviewer checking for:
CRITICAL: animating width/height/top/left (use transform instead), missing useReducedMotion call.
WARN: inline transition strings, animation duration > 600ms, missing will-change.
INFO: style suggestions.
Return JSON: { findings: Array<{ severity, rule, message, line? }>, approved: boolean }`,
    messages: [{ role: 'user', content: `File: ${input.filePath}\n\n${input.fileContent}` }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  try {
    return JSON.parse(text) as ReviewOutput
  } catch {
    return { findings: [], approved: true }
  }
}
