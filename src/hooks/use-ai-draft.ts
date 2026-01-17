'use client'

import { useState, useCallback, useRef } from 'react'
import type { AIDraft } from '@/schemas/ai-output.schema'
import type { Contact } from '@/types/email.types'
import type { Signal } from '@/types/signal.types'
import type {
  NodeProgress,
  ResearchData,
  AnalysisData,
  StreamUpdate,
} from '@/lib/agent'

interface UseAIDraftOptions {
  contact: Contact
  signals: Signal[]
}

interface UseAIDraftReturn {
  // Final output
  draft: AIDraft | null
  // Intermediate outputs for UI transparency
  research: ResearchData | null
  analysis: AnalysisData | null
  // Progress tracking
  progress: NodeProgress
  currentNode: string | null
  // Status
  isGenerating: boolean
  error: string | null
  // Actions
  generate: (context?: string) => Promise<void>
  regenerate: (context?: string) => void
  reset: () => void
}

const initialProgress: NodeProgress = {
  researcher: 'pending',
  analyst: 'pending',
  copywriter: 'pending',
}

export function useAIDraft({
  contact,
  signals,
}: UseAIDraftOptions): UseAIDraftReturn {
  const [draft, setDraft] = useState<AIDraft | null>(null)
  const [research, setResearch] = useState<ResearchData | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [progress, setProgress] = useState<NodeProgress>(initialProgress)
  const [currentNode, setCurrentNode] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleStreamUpdate = useCallback((update: StreamUpdate) => {
    switch (update.type) {
      case 'progress': {
        const progressData = update.data as NodeProgress
        setProgress(progressData)
        // Determine current node based on which is running
        if (progressData.researcher === 'running') setCurrentNode('researcher')
        else if (progressData.analyst === 'running') setCurrentNode('analyst')
        else if (progressData.copywriter === 'running')
          setCurrentNode('copywriter')
        else if (progressData.copywriter === 'completed') setCurrentNode(null)
        break
      }
      case 'research':
        setResearch(update.data as ResearchData)
        setCurrentNode('analyst')
        break
      case 'analysis':
        setAnalysis(update.data as AnalysisData)
        setCurrentNode('copywriter')
        break
      case 'draft':
        setDraft(update.data as AIDraft)
        setCurrentNode(null)
        break
      case 'error':
        if (typeof update.data === 'string') {
          setError(update.data)
        } else if (Array.isArray(update.data)) {
          setError(update.data.join(', '))
        }
        break
      case 'complete':
        // Final state is set
        break
    }
  }, [])

  const generate = useCallback(
    async (context?: string) => {
      // Abort any existing request
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      // Reset state
      setIsGenerating(true)
      setError(null)
      setDraft(null)
      setResearch(null)
      setAnalysis(null)
      setProgress({
        researcher: 'running',
        analyst: 'pending',
        copywriter: 'pending',
      })
      setCurrentNode('researcher')

      try {
        const response = await fetch('/api/ai/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contact, signals, context }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const update: StreamUpdate = JSON.parse(line.slice(6))
                handleStreamUpdate(update)
              } catch {
                // Ignore parse errors for incomplete JSON
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return // Cancelled, don't set error
        }
        setError(err instanceof Error ? err.message : 'Generation failed')
        setProgress({
          researcher: 'error',
          analyst: 'error',
          copywriter: 'error',
        })
      } finally {
        setIsGenerating(false)
      }
    },
    [contact, signals, handleStreamUpdate]
  )

  const regenerate = useCallback(
    (context?: string) => {
      generate(context)
    },
    [generate]
  )

  const reset = useCallback(() => {
    abortControllerRef.current?.abort()
    setDraft(null)
    setResearch(null)
    setAnalysis(null)
    setProgress(initialProgress)
    setCurrentNode(null)
    setError(null)
    setIsGenerating(false)
  }, [])

  return {
    draft,
    research,
    analysis,
    progress,
    currentNode,
    isGenerating,
    error,
    generate,
    regenerate,
    reset,
  }
}
