'use client'

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import type { Email } from '@/types/email.types'
import { SignalBadge } from '@/components/signals/signal-badge'
import { cn } from '@/lib/utils'

interface EmailListItemProps {
  email: Email
  isSelected: boolean
  isFocused: boolean
  onSelect: () => void
}

export function EmailListItem({
  email,
  isSelected,
  isFocused,
  onSelect,
}: EmailListItemProps) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ backgroundColor: 'rgba(63, 63, 70, 0.3)' }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'relative cursor-pointer border-l-2 px-4 py-3 transition-colors',
        isSelected
          ? 'border-l-zinc-100 bg-zinc-800/50'
          : 'border-l-transparent',
        isFocused && !isSelected && 'bg-zinc-800/20'
      )}
    >
      {/* Focus indicator */}
      {isFocused && (
        <motion.div
          layoutId="focus-indicator"
          className="absolute bottom-0 left-0 top-0 w-0.5 bg-blue-500"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* Content */}
      <div className="space-y-1">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="max-w-[70%] truncate text-sm font-medium">
            {email.to[0]?.name || email.to[0]?.email}
          </span>
          <span className="text-xs text-zinc-500">
            {formatDistanceToNow(email.updatedAt, { addSuffix: true })}
          </span>
        </div>

        {/* Company */}
        {email.to[0]?.company && (
          <p className="text-xs text-zinc-500">{email.to[0].company}</p>
        )}

        {/* Subject */}
        <p className="truncate text-sm text-zinc-300">{email.subject}</p>

        {/* Preview */}
        <p className="truncate text-xs text-zinc-500">
          {email.body.split('\n')[0]}
        </p>

        {/* Signals */}
        {email.signals.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1 pt-1"
          >
            {email.signals.slice(0, 3).map((signal) => (
              <SignalBadge
                key={signal.id}
                type={signal.type}
                size="sm"
                animated={false}
              />
            ))}
            {email.signals.length > 3 && (
              <span className="text-xs text-zinc-500">
                +{email.signals.length - 3}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
