'use server'

import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { aiDraftSchema, type AIDraft } from '@/schemas/ai-output.schema'
import type { Contact } from '@/types/email.types'
import type { Signal } from '@/types/signal.types'
import { mockAIDrafts } from '@/mocks/ai-responses.mock'

const USE_MOCK = !process.env.ANTHROPIC_API_KEY

export async function generateEmailDraft(
  contact: Contact,
  signals: Signal[],
  context?: string
): Promise<{ draft: AIDraft; error?: string }> {
  // Use mock data if no API key
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { draft: mockAIDrafts.default }
  }

  try {
    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      schema: aiDraftSchema,
      prompt: buildPrompt(contact, signals, context),
    })

    return { draft: object }
  } catch (error) {
    console.error('AI generation error:', error)
    // Fall back to mock data on error
    return {
      draft: mockAIDrafts.default,
      error: error instanceof Error ? error.message : 'Generation failed',
    }
  }
}

function buildPrompt(
  contact: Contact,
  signals: Signal[],
  context?: string
): string {
  return `You are an expert sales copywriter. Generate a personalized outreach email.

RECIPIENT:
- Name: ${contact.name}
- Title: ${contact.title || 'Unknown'}
- Company: ${contact.company || 'Unknown'}
- Email: ${contact.email}

SIGNALS DETECTED:
${signals.map((s) => `- ${s.type.toUpperCase()}: ${s.title} - ${s.description} (${s.confidence}% confidence)`).join('\n')}

${context ? `ADDITIONAL CONTEXT:\n${context}` : ''}

Generate a compelling, personalized email that:
1. References the signals naturally without being creepy
2. Provides clear value proposition
3. Has a specific, low-commitment call-to-action
4. Maintains a professional but warm tone
5. Is concise (under 150 words for the body)

Respond with structured JSON matching the schema.`
}
