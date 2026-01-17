export type SignalType = 'hiring' | 'funding' | 'techstack' | 'expansion' | 'news'

export interface Signal {
  id: string
  type: SignalType
  title: string
  description: string
  source?: string
  sourceUrl?: string
  confidence: number // 0-100
  detectedAt: Date
  metadata?: Record<string, unknown>
}

export interface SignalConfig {
  type: SignalType
  label: string
  icon: string
  color: string
  bgColor: string
}

export const SIGNAL_CONFIGS: Record<SignalType, SignalConfig> = {
  hiring: {
    type: 'hiring',
    label: 'Hiring',
    icon: 'Users',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  funding: {
    type: 'funding',
    label: 'Funding',
    icon: 'DollarSign',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  techstack: {
    type: 'techstack',
    label: 'Tech Stack',
    icon: 'Code',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  expansion: {
    type: 'expansion',
    label: 'Expansion',
    icon: 'TrendingUp',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  news: {
    type: 'news',
    label: 'News',
    icon: 'Newspaper',
    color: 'text-zinc-400',
    bgColor: 'bg-zinc-500/10',
  },
}
