'use client'

import { useCallback, useOptimistic, useTransition, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'
import type { Email, EmailStatus, Contact } from '@/types/email.types'

type EmailAction =
  | { type: 'UPDATE_STATUS'; id: string; status: EmailStatus }
  | { type: 'DELETE'; id: string }
  | { type: 'UPDATE_CONTENT'; id: string; subject: string; body: string }

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
  const [isRegenerating, setIsRegenerating] = useState(false)

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
        case 'UPDATE_CONTENT':
          return state.map((email) =>
            email.id === action.id
              ? {
                  ...email,
                  subject: action.subject,
                  body: action.body,
                  updatedAt: new Date(),
                }
              : email
          )
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
      const email = emails.find((e) => e.id === id)
      if (!email) {
        toast.error('Email not found')
        return
      }

      setIsRegenerating(true)
      toast.info('Regenerating draft...')

      try {
        // Build contact from email recipient
        const recipient = email.to[0]
        const contact: Contact = recipient || {
          id: 'unknown',
          email: 'unknown@example.com',
          name: 'Unknown',
        }

        const response = await fetch('/api/ai/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contact,
            signals: email.signals,
            context: `Regenerating draft for subject: ${email.subject}`,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        // Read SSE stream for final draft
        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''
        let newDraft: { subject: string; body: string } | null = null

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const update = JSON.parse(line.slice(6))
                if (update.type === 'draft' && update.data?.email) {
                  newDraft = {
                    subject: update.data.email.subject,
                    body: update.data.email.body,
                  }
                }
              } catch {
                // Ignore parse errors
              }
            }
          }
        }

        if (newDraft) {
          // Update the email in state
          startTransition(() => {
            updateOptimistic({
              type: 'UPDATE_CONTENT',
              id,
              subject: newDraft!.subject,
              body: newDraft!.body,
            })
          })
          toast.success('Draft regenerated')
        } else {
          toast.error('Failed to generate new draft')
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Regeneration failed'
        )
      } finally {
        setIsRegenerating(false)
      }
    },
    [emails, startTransition, updateOptimistic]
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
    isPending: isPending || isRegenerating,
    isRegenerating,
    sendEmail,
    archiveEmail,
    regenerateEmail,
  }
}
