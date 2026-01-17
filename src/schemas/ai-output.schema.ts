import { z } from 'zod'

// Schema for AI-generated email draft
export const aiDraftSchema = z.object({
  intent: z.object({
    signals: z.array(z.object({
      type: z.enum(['hiring', 'funding', 'techstack', 'expansion', 'news']),
      relevance: z.string().describe('Why this signal is relevant to the outreach'),
      talkingPoint: z.string().describe('Suggested talking point based on this signal'),
    })),
    tone: z.enum(['formal', 'casual', 'friendly', 'urgent']),
    objective: z.string().describe('Primary objective of this email'),
  }),
  email: z.object({
    subject: z.string().max(100),
    body: z.string(),
    callToAction: z.string().describe('The primary CTA in the email'),
  }),
  alternatives: z.array(z.object({
    subject: z.string(),
    openingLine: z.string(),
  })).max(2).describe('Alternative subject lines and openings'),
})

export type AIDraft = z.infer<typeof aiDraftSchema>

// Schema for email analysis
export const emailAnalysisSchema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  urgency: z.enum(['high', 'medium', 'low']),
  keyTopics: z.array(z.string()),
  suggestedActions: z.array(z.string()),
  replyUrgency: z.number().min(0).max(100),
})

export type EmailAnalysis = z.infer<typeof emailAnalysisSchema>
