'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmailListItem } from '@/components/email/email-list-item'
import type { Email } from '@/types/email.types'
import { staggerContainerVariants, listItemVariants } from '@/lib/animations'

interface DraftListProps {
  emails: Email[]
  selectedId: string | null
  focusedIndex: number
  onSelect: (id: string) => void
}

export function DraftList({
  emails,
  selectedId,
  focusedIndex,
  onSelect,
}: DraftListProps) {
  const listRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h2 className="font-medium">Drafts</h2>
        <span className="text-sm text-zinc-500">{emails.length} items</span>
      </div>

      {/* Email List */}
      <ScrollArea className="flex-1">
        <motion.div
          ref={listRef}
          className="py-2"
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {emails.map((email, index) => (
              <motion.div
                key={email.id}
                variants={listItemVariants}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <EmailListItem
                  email={email}
                  isSelected={email.id === selectedId}
                  isFocused={index === focusedIndex}
                  onSelect={() => onSelect(email.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>

      {/* Keyboard hints */}
      <div className="flex items-center justify-center gap-4 border-t border-zinc-800 py-2 text-xs text-zinc-500">
        <span>
          <kbd className="rounded bg-zinc-800 px-1">j</kbd>
          <kbd className="ml-0.5 rounded bg-zinc-800 px-1">k</kbd> navigate
        </span>
        <span>
          <kbd className="rounded bg-zinc-800 px-1">Enter</kbd> select
        </span>
      </div>
    </div>
  )
}
