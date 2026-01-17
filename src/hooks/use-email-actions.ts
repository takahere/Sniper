'use client'

import { useCallback, useOptimistic, useTransition } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'
import type { Email, EmailStatus } from '@/types/email.types'

type EmailAction =
  | { type: 'UPDATE_STATUS'; id: string; status: EmailStatus }
  | { type: 'DELETE'; id: string }

interface UseEmailActionsOptions {
  emails: Email[]
  selectedId: string | null
  focusedIndex: number
  onFocusNext: () => void
}

export function useEmailActions({
  emails,
  selectedId,
  focusedIndex,
  onFocusNext,
}: UseEmailActionsOptions) {
  const [isPending, startTransition] = useTransition()

  const [optimisticEmails, updateOptimistic] = useOptimistic<Email[], EmailAction>(
    emails,
    (state, action) => {
      switch (action.type) {
        case 'UPDATE_STATUS':
          return state.map((email) =>
            email.id === action.id
              ? { ...email, status: action.status, updatedAt: new Date() }
              : email
          )
        case 'DELETE':
          return state.filter((email) => email.id !== action.id)
        default:
          return state
      }
    }
  )

  const sendEmail = useCallback(
    async (id: string) => {
      const email = emails.find((e) => e.id === id)
      if (!email) return

      startTransition(async () => {
        // Optimistically update
        updateOptimistic({ type: 'UPDATE_STATUS', id, status: 'sent' })

        // Show toast
        toast.success(`Sent to ${email.to[0]?.name || email.to[0]?.email}`)

        // Move focus to next item
        onFocusNext()

        // Simulate server action
        await new Promise((r) => setTimeout(r, 500))
      })
    },
    [emails, updateOptimistic, onFocusNext]
  )

  const archiveEmail = useCallback(
    async (id: string) => {
      const email = emails.find((e) => e.id === id)
      if (!email) return

      startTransition(async () => {
        updateOptimistic({ type: 'UPDATE_STATUS', id, status: 'archived' })
        toast.success('Email archived')
        onFocusNext()
        await new Promise((r) => setTimeout(r, 500))
      })
    },
    [emails, updateOptimistic, onFocusNext]
  )

  const regenerateEmail = useCallback(
    async (id: string) => {
      toast.info('Regenerating draft...')
      // This would trigger the AI to regenerate
      await new Promise((r) => setTimeout(r, 1000))
      toast.success('Draft regenerated')
    },
    []
  )

  // Get current email for shortcuts
  const currentEmailId = selectedId || emails[focusedIndex]?.id

  // Cmd+Enter to send
  useHotkeys(
    'meta+enter',
    () => {
      if (currentEmailId) {
        sendEmail(currentEmailId)
      }
    },
    { preventDefault: true, enabled: !!currentEmailId },
    [currentEmailId, sendEmail]
  )

  // Cmd+Backspace to archive
  useHotkeys(
    'meta+backspace',
    () => {
      if (currentEmailId) {
        archiveEmail(currentEmailId)
      }
    },
    { preventDefault: true, enabled: !!currentEmailId },
    [currentEmailId, archiveEmail]
  )

  // 'e' to archive (Gmail style)
  useHotkeys(
    'e',
    () => {
      if (currentEmailId) {
        archiveEmail(currentEmailId)
      }
    },
    { preventDefault: true, enabled: !!currentEmailId },
    [currentEmailId, archiveEmail]
  )

  // 'r' to regenerate
  useHotkeys(
    'r',
    () => {
      if (currentEmailId) {
        regenerateEmail(currentEmailId)
      }
    },
    { preventDefault: true, enabled: !!currentEmailId },
    [currentEmailId, regenerateEmail]
  )

  // Filter out sent/archived emails for display
  const visibleEmails = optimisticEmails.filter(
    (e) => e.status === 'draft' || e.status === 'scheduled'
  )

  return {
    emails: visibleEmails,
    isPending,
    sendEmail,
    archiveEmail,
    regenerateEmail,
  }
}
