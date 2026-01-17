// LangGraph Agent for Email Draft Generation
export { emailDraftGraph, type EmailDraftGraphInput } from './graph'
export {
  AgentStateAnnotation,
  type AgentState,
  type NodeStatus,
  type NodeProgress,
  type ResearchData,
  type AnalysisData,
} from './state'
export { researcherNode, analystNode, copywriterNode } from './nodes'
export { getConfig } from './utils/config'
export {
  encodeStreamEvent,
  createSSEResponse,
  type StreamUpdate,
} from './utils/streaming'
