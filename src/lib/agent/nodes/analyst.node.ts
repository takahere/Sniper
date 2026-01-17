import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import type { AgentState } from '../state'
import type { Signal, SignalType } from '@/types/signal.types'
import { mockAnalysisData } from '../mocks/analysis.mock'
import { getConfig, simulateDelay } from '../utils/config'

// Valid signal types for runtime validation
const VALID_SIGNAL_TYPES: SignalType[] = [
  'hiring',
  'funding',
  'techstack',
  'expansion',
  'news',
]

function isValidSignalType(type: string): type is SignalType {
  return VALID_SIGNAL_TYPES.includes(type as SignalType)
}

// Schema for analyst output
const analysisOutputSchema = z.object({
  signals: z.array(
    z.object({
      type: z.enum(['hiring', 'funding', 'techstack', 'expansion', 'news']),
      title: z.string(),
      description: z.string(),
      confidence: z.number().min(0).max(100),
    })
  ),
  companyContext: z.string(),
  recommendedTone: z.enum(['formal', 'casual', 'friendly', 'urgent']),
  keyInsights: z.array(z.string()),
})

export async function analystNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const config = getConfig()

  // Mock mode
  if (config.useMockAI) {
    await simulateDelay(700)

    const mockData = mockAnalysisData.default
    const extractedSignals: Signal[] = mockData.signals
      .filter((s) => isValidSignalType(s.type))
      .map((s, i) => ({
        id: `extracted-${i}`,
        type: s.type as SignalType,
        title: s.title,
        description: s.description,
        confidence: s.confidence,
        detectedAt: new Date(),
      }))

    return {
      analysis: {
        extractedSignals,
        companyContext: mockData.companyContext,
        recommendedTone: mockData.recommendedTone,
        keyInsights: mockData.keyInsights,
      },
      progress: {
        researcher: 'completed',
        analyst: 'completed',
        copywriter: 'pending',
      },
    }
  }

  // Real AI analysis
  try {
    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: analysisOutputSchema,
      prompt: buildAnalystPrompt(state),
    })

    const extractedSignals: Signal[] = object.signals.map((s, i) => ({
      id: `extracted-${i}`,
      type: s.type,
      title: s.title,
      description: s.description,
      confidence: s.confidence,
      detectedAt: new Date(),
    }))

    return {
      analysis: {
        extractedSignals,
        companyContext: object.companyContext,
        recommendedTone: object.recommendedTone,
        keyInsights: object.keyInsights,
      },
      progress: {
        researcher: 'completed',
        analyst: 'completed',
        copywriter: 'pending',
      },
    }
  } catch (error) {
    // Fallback to mock on error
    const mockData = mockAnalysisData.default
    const extractedSignals: Signal[] = mockData.signals
      .filter((s) => isValidSignalType(s.type))
      .map((s, i) => ({
        id: `extracted-${i}`,
        type: s.type as SignalType,
        title: s.title,
        description: s.description,
        confidence: s.confidence,
        detectedAt: new Date(),
      }))

    return {
      analysis: {
        extractedSignals,
        companyContext: mockData.companyContext,
        recommendedTone: mockData.recommendedTone,
        keyInsights: mockData.keyInsights,
      },
      progress: {
        researcher: 'completed',
        analyst: 'error',
        copywriter: 'pending',
      },
      errors: [error instanceof Error ? error.message : 'Analysis failed'],
    }
  }
}

function buildAnalystPrompt(state: AgentState): string {
  return `Analyze this company and contact for sales outreach signals.

CONTACT:
- Name: ${state.contact.name}
- Title: ${state.contact.title || 'Unknown'}
- Company: ${state.contact.company || 'Unknown'}

EXISTING SIGNALS:
${state.inputSignals.map((s) => `- ${s.type}: ${s.title}`).join('\n') || 'None'}

SCRAPED CONTENT:
${state.research?.scrapedContent || 'No content available'}

USER CONTEXT:
${state.userContext || 'None provided'}

Extract intent signals (hiring, funding, techstack, expansion, news), determine the best tone for outreach, and identify key insights for personalization.

Return a JSON object with:
- signals: Array of detected signals with type, title, description, and confidence (0-100)
- companyContext: Brief summary of company context relevant to outreach
- recommendedTone: One of "formal", "casual", "friendly", or "urgent"
- keyInsights: Array of 2-4 key insights that can be used for personalization`
}
