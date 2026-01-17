import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { aiDraftSchema, type AIDraft } from '@/schemas/ai-output.schema'
import type { AgentState } from '../state'
import type { Signal } from '@/types/signal.types'
import { mockAIDrafts } from '@/mocks/ai-responses.mock'
import { getConfig, simulateDelay } from '../utils/config'

export async function copywriterNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const config = getConfig()

  // Mock mode
  if (config.useMockAI) {
    await simulateDelay(800)
    return {
      draft: mockAIDrafts.default,
      progress: {
        researcher: 'completed',
        analyst: 'completed',
        copywriter: 'completed',
      },
    }
  }

  // Real AI generation
  try {
    // Merge input signals with extracted signals
    const allSignals = [
      ...state.inputSignals,
      ...(state.analysis?.extractedSignals || []),
    ]

    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: aiDraftSchema,
      prompt: buildCopywriterPrompt(state, allSignals),
    })

    return {
      draft: object,
      progress: {
        researcher: 'completed',
        analyst: 'completed',
        copywriter: 'completed',
      },
    }
  } catch (error) {
    // Fallback to mock on error
    return {
      draft: mockAIDrafts.default,
      progress: {
        researcher: 'completed',
        analyst: 'completed',
        copywriter: 'error',
      },
      errors: [error instanceof Error ? error.message : 'Generation failed'],
    }
  }
}

function buildCopywriterPrompt(state: AgentState, allSignals: Signal[]): string {
  return `You are an expert sales copywriter. Generate a personalized outreach email.

RECIPIENT:
- Name: ${state.contact.name}
- Title: ${state.contact.title || 'Unknown'}
- Company: ${state.contact.company || 'Unknown'}
- Email: ${state.contact.email}

COMPANY CONTEXT:
${state.analysis?.companyContext || 'No additional context'}

KEY INSIGHTS:
${state.analysis?.keyInsights?.join('\n- ') || 'None'}

SIGNALS DETECTED:
${allSignals.map((s) => `- ${s.type.toUpperCase()}: ${s.title} - ${s.description} (${s.confidence}% confidence)`).join('\n')}

RECOMMENDED TONE: ${state.analysis?.recommendedTone || 'friendly'}

${state.userContext ? `ADDITIONAL USER CONTEXT:\n${state.userContext}` : ''}

Generate a compelling, personalized email that:
1. References the signals naturally without being creepy
2. Provides clear value proposition
3. Has a specific, low-commitment call-to-action
4. Maintains the recommended tone
5. Is concise (under 150 words for the body)

Return a JSON object matching the schema with:
- intent: Object containing signals array (type, relevance, talkingPoint), tone, and objective
- email: Object with subject, body, and callToAction
- alternatives: Array of 2 alternative approaches with subject and openingLine`
}
