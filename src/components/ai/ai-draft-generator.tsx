'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SignalBadge } from '@/components/signals/signal-badge'
import { PipelineProgress } from './pipeline-progress'
import { useAIDraft } from '@/hooks/use-ai-draft'
import type { Contact } from '@/types/email.types'
import type { Signal } from '@/types/signal.types'

interface AIDraftGeneratorProps {
  contact: Contact
  signals: Signal[]
  onAccept: (subject: string, body: string) => void
}

export function AIDraftGenerator({
  contact,
  signals,
  onAccept,
}: AIDraftGeneratorProps) {
  const [context, setContext] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const {
    draft,
    research,
    analysis,
    progress,
    currentNode,
    isGenerating,
    error,
    generate,
    regenerate,
  } = useAIDraft({
    contact,
    signals,
  })

  return (
    <div className="space-y-4">
      {/* Context Input */}
      <div className="space-y-2">
        <label className="text-sm text-zinc-400">
          Additional context (optional)
        </label>
        <Textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="E.g., mention our recent case study with similar company..."
          className="resize-none border-zinc-700 bg-zinc-800/50"
          rows={2}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={() => generate(context)}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {isGenerating ? 'Generating...' : 'Generate Draft'}
      </Button>

      {/* Pipeline Progress */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 py-2"
        >
          <PipelineProgress progress={progress} currentNode={currentNode} />
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Intermediate Results (Research & Analysis) */}
      {(research || analysis) && isGenerating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between text-xs text-zinc-500 hover:text-zinc-400"
          >
            <span>Pipeline Details</span>
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {/* Research Output */}
                {research && (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
                    <span className="text-xs uppercase tracking-wide text-zinc-500">
                      Research Data
                    </span>
                    <p className="mt-1 line-clamp-3 text-xs text-zinc-400">
                      {research.scrapedContent || 'No content scraped'}
                    </p>
                    {research.companyUrl && (
                      <p className="mt-1 text-xs text-blue-400">
                        {research.companyUrl}
                      </p>
                    )}
                  </div>
                )}

                {/* Analysis Output */}
                {analysis && (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
                    <span className="text-xs uppercase tracking-wide text-zinc-500">
                      Analysis
                    </span>
                    {analysis.extractedSignals && analysis.extractedSignals.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {analysis.extractedSignals.map((s, i) => (
                          <SignalBadge key={i} type={s.type} size="sm" />
                        ))}
                      </div>
                    )}
                    {analysis.keyInsights && analysis.keyInsights.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {analysis.keyInsights.slice(0, 3).map((insight, i) => (
                          <li key={i} className="text-xs text-zinc-400">
                            • {insight}
                          </li>
                        ))}
                      </ul>
                    )}
                    {analysis.recommendedTone && (
                      <p className="mt-2 text-xs text-zinc-500">
                        Tone: <span className="text-zinc-400">{analysis.recommendedTone}</span>
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Draft Output */}
      <AnimatePresence mode="wait">
        {draft && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Intent Signals */}
            {draft.intent?.signals && draft.intent.signals.length > 0 && (
              <div className="space-y-2 rounded-lg bg-zinc-800/30 p-3">
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  Signals Used
                </span>
                <div className="flex flex-wrap gap-2">
                  {draft.intent.signals.map((s, i) => (
                    <SignalBadge
                      key={i}
                      type={s.type}
                      tooltip={s.talkingPoint}
                    />
                  ))}
                </div>
                {draft.intent.objective && (
                  <p className="text-xs text-zinc-400">
                    <span className="font-medium">Objective:</span>{' '}
                    {draft.intent.objective}
                  </p>
                )}
              </div>
            )}

            {/* Generated Email */}
            {draft.email && (
              <div className="glass space-y-3 rounded-lg p-4">
                <div>
                  <span className="text-xs text-zinc-500">Subject</span>
                  <p className="font-medium">{draft.email.subject}</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-500">Body</span>
                  <p className="whitespace-pre-wrap font-mono text-sm text-zinc-300">
                    {draft.email.body}
                  </p>
                </div>
                {draft.email.callToAction && (
                  <div className="border-t border-zinc-700 pt-2">
                    <span className="text-xs text-zinc-500">Call to Action</span>
                    <p className="text-sm text-zinc-400">
                      {draft.email.callToAction}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Alternatives */}
            {draft.alternatives && draft.alternatives.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-zinc-500">
                  Alternative Approaches
                </span>
                <div className="space-y-2">
                  {draft.alternatives.map((alt, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-sm"
                    >
                      <p className="font-medium">{alt.subject}</p>
                      <p className="text-xs text-zinc-400">{alt.openingLine}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => regenerate(context)}
                disabled={isGenerating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button
                onClick={() =>
                  draft.email && onAccept(draft.email.subject, draft.email.body)
                }
                disabled={!draft.email}
              >
                <Check className="mr-2 h-4 w-4" />
                Use Draft
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
