'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send, RefreshCw, Archive, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SignalPanel } from '@/components/signals/signal-panel'
import type { Email } from '@/types/email.types'
import { panelVariants } from '@/lib/animations'

interface DetailViewProps {
  email: Email | null
  onSend: (id: string) => void
  onArchive: (id: string) => void
  onRegenerate: (id: string) => void
}

export function DetailView({
  email,
  onSend,
  onArchive,
  onRegenerate,
}: DetailViewProps) {
  if (!email) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        <div className="text-center">
          <p>Select an email to view</p>
          <p className="mt-1 text-sm">
            Use <kbd className="rounded bg-zinc-800 px-1">j</kbd>
            <kbd className="ml-0.5 rounded bg-zinc-800 px-1">k</kbd> to navigate
          </p>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={email.id}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex h-full flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-6 py-4">
          {(() => {
            const recipient = email.to[0]
            return (
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-medium">{recipient?.name}</h2>
                <p className="truncate text-sm text-zinc-400">{recipient?.email}</p>
                {recipient?.company && (
                  <p className="truncate text-xs text-zinc-500">{recipient.company}</p>
                )}
              </div>
            )
          })()}
          <div className="flex flex-shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRegenerate(email.id)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onArchive(email.id)}
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 overflow-auto p-6">
          {/* Signals */}
          {email.signals.length > 0 && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <SignalPanel signals={email.signals} />
            </div>
          )}

          {/* Email Content */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Subject</label>
              <input
                type="text"
                defaultValue={email.subject}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm focus:border-zinc-700 focus:outline-none"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-xs text-zinc-500">Body</label>
              <Textarea
                defaultValue={email.body}
                className="min-h-[300px] resize-none border-zinc-800 bg-zinc-900/50 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
          <div className="text-xs text-zinc-500">
            <kbd className="rounded bg-zinc-800 px-1.5 py-0.5">⌘</kbd>
            <kbd className="ml-0.5 rounded bg-zinc-800 px-1.5 py-0.5">↵</kbd>
            {' '}to send
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onArchive(email.id)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
            <Button onClick={() => onSend(email.id)}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
