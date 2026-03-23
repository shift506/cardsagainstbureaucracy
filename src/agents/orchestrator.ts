/**
 * @role Orchestrator — routes user intent to appropriate sub-agents.
 * @allowed-tools read-context, dispatch-agent, queue-management
 * @escalation-path Human reviewer for ambiguous intent or conflicting agent outputs.
 */
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export interface AgentTask {
  intent: 'animate' | 'review' | 'qa' | 'release'
  payload: Record<string, unknown>
}

export async function orchestrate(task: AgentTask): Promise<string> {
  const systemPrompt = `You are an orchestrator agent. Route the following task to the correct sub-agent.
Available agents: animator, reviewer, qa, release.
Return a JSON object: { agent: string, instructions: string }`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: 'user', content: JSON.stringify(task) }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return text
}
