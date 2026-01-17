import { Annotation } from '@langchain/langgraph'
import type { Contact } from '@/types/email.types'
import type { Signal } from '@/types/signal.types'
import type { AIDraft } from '@/schemas/ai-output.schema'

// Node execution status for UI transparency
export type NodeStatus = 'pending' | 'running' | 'completed' | 'error'

export interface NodeProgress {
  researcher: NodeStatus
  analyst: NodeStatus
  copywriter: NodeStatus
}

// Research output from Researcher node
export interface ResearchData {
  companyUrl: string
  scrapedContent: string | null
  scrapedAt: Date | null
  error: string | null
}

// Analysis output from Analyst node
export interface AnalysisData {
  extractedSignals: Signal[]
  companyContext: string
  recommendedTone: 'formal' | 'casual' | 'friendly' | 'urgent'
  keyInsights: string[]
}

// Agent State using LangGraph Annotation API
export const AgentStateAnnotation = Annotation.Root({
  // Input fields (set once at start)
  contact: Annotation<Contact>,
  inputSignals: Annotation<Signal[]>,
  userContext: Annotation<string>,

  // Research phase output
  research: Annotation<ResearchData | null>,

  // Analysis phase output
  analysis: Annotation<AnalysisData | null>,

  // Final draft output (compatible with existing AIDraft)
  draft: Annotation<AIDraft | null>,

  // Progress tracking for UI (with merge reducer)
  progress: Annotation<NodeProgress>({
    value: (current: NodeProgress, update: NodeProgress) => ({ ...current, ...update }),
    default: () => ({
      researcher: 'pending' as NodeStatus,
      analyst: 'pending' as NodeStatus,
      copywriter: 'pending' as NodeStatus,
    }),
  }),

  // Error handling (with append reducer)
  errors: Annotation<string[]>({
    value: (current: string[], newErrors: string[]) =>
      Array.isArray(newErrors) ? [...current, ...newErrors] : [...current, String(newErrors)],
    default: () => [],
  }),
})

export type AgentState = typeof AgentStateAnnotation.State
