'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Signal } from '@/types/signal.types'
import { SignalBadge } from './signal-badge'

interface SignalPanelProps {
  signals: Signal[]
}

export function SignalPanel({ signals }: SignalPanelProps) {
  if (signals.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-zinc-500">
        No signals detected for this contact
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="px-1 text-sm font-medium text-zinc-400">
        Intent Signals ({signals.length})
      </h3>

      <div className="space-y-2">
        {signals.map((signal, index) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-2 rounded-lg bg-zinc-800/30 p-3 transition-colors hover:bg-zinc-800/50"
          >
            <div className="flex items-start justify-between">
              <SignalBadge type={signal.type} />
              <span className="text-xs text-zinc-500">
                {formatDistanceToNow(signal.detectedAt, { addSuffix: true })}
              </span>
            </div>

            <p className="text-sm font-medium">{signal.title}</p>
            <p className="text-xs text-zinc-400">{signal.description}</p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${signal.confidence}%` }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                  />
                </div>
                <span className="text-xs text-zinc-500">
                  {signal.confidence}%
                </span>
              </div>

              {signal.sourceUrl && (
                <a
                  href={signal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  {signal.source}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
