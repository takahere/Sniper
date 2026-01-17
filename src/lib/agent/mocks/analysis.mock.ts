import type { SignalType } from '@/types/signal.types'

export interface MockAnalysisSignal {
  type: SignalType
  title: string
  description: string
  confidence: number
}

export interface MockAnalysis {
  signals: MockAnalysisSignal[]
  companyContext: string
  recommendedTone: 'formal' | 'casual' | 'friendly' | 'urgent'
  keyInsights: string[]
}

export const mockAnalysisData: Record<string, MockAnalysis> = {
  default: {
    signals: [
      {
        type: 'hiring',
        title: 'Active Engineering Hiring',
        description: 'Company has multiple open engineering positions',
        confidence: 95,
      },
      {
        type: 'funding',
        title: 'Recent Funding Round',
        description: 'Recent investment indicates growth phase',
        confidence: 90,
      },
      {
        type: 'techstack',
        title: 'Modern Tech Stack',
        description: 'Using React, TypeScript, and cloud-native technologies',
        confidence: 85,
      },
    ],
    companyContext:
      'Fast-growing technology company in scaling phase with strong engineering culture and investment in modern tools.',
    recommendedTone: 'friendly',
    keyInsights: [
      'Recent funding creates budget for new tools and services',
      'Engineering hiring indicates infrastructure investment needs',
      'Modern tech stack suggests openness to new solutions',
    ],
  },
  enterprise: {
    signals: [
      {
        type: 'expansion',
        title: 'Global Expansion',
        description: 'Opening new offices and expanding to new markets',
        confidence: 92,
      },
      {
        type: 'hiring',
        title: 'Massive Hiring Initiative',
        description: '50+ open positions across engineering',
        confidence: 98,
      },
      {
        type: 'news',
        title: 'Strategic Acquisition',
        description: 'Recently acquired AI startup for $100M',
        confidence: 100,
      },
    ],
    companyContext:
      'Large enterprise undergoing digital transformation with significant resources and appetite for innovation.',
    recommendedTone: 'formal',
    keyInsights: [
      'Acquisition signals commitment to AI/ML capabilities',
      'Scale of hiring suggests major initiatives underway',
      'Enterprise context requires formal, ROI-focused messaging',
    ],
  },
}
