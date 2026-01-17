import { StateGraph, START, END } from '@langchain/langgraph'
import { AgentStateAnnotation, type AgentState } from './state'
import { researcherNode, analystNode, copywriterNode } from './nodes'

// Build the graph
const builder = new StateGraph(AgentStateAnnotation)
  // Add nodes
  .addNode('researcher', researcherNode)
  .addNode('analyst', analystNode)
  .addNode('copywriter', copywriterNode)
  // Define edges (sequential flow)
  .addEdge(START, 'researcher')
  .addEdge('researcher', 'analyst')
  .addEdge('analyst', 'copywriter')
  .addEdge('copywriter', END)

// Compile the graph
export const emailDraftGraph = builder.compile()
emailDraftGraph.name = 'EmailDraftAgent'

// Export types for API
export type EmailDraftGraphInput = Pick<
  AgentState,
  'contact' | 'inputSignals' | 'userContext'
>
