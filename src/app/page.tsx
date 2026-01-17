'use client'

import { useCallback, useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation'
import { useEmailActions } from '@/hooks/use-email-actions'
import { mockEmails } from '@/mocks/emails.mock'
import type { Email } from '@/types/email.types'

export default function HomePage() {
  const [initialEmails, setInitialEmails] = useState<Email[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load mock data on mount
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setInitialEmails(mockEmails)
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard navigation
  const { focusedIndex, setFocusedIndex, moveFocus } = useKeyboardNavigation({
    items: initialEmails,
    onSelect: (email) => setSelectedId(email.id),
    enabled: !isLoading,
  })

  // Move focus to next item callback
  const handleFocusNext = useCallback(() => {
    moveFocus('down')
  }, [moveFocus])

  // Email actions with optimistic updates
  const {
    emails,
    sendEmail,
    archiveEmail,
    regenerateEmail,
  } = useEmailActions({
    emails: initialEmails,
    selectedId,
    focusedIndex,
    onFocusNext: handleFocusNext,
  })

  // Handle email selection
  const handleSelectEmail = useCallback(
    (id: string) => {
      setSelectedId(id)
      const index = emails.findIndex((e) => e.id === id)
      if (index !== -1) {
        setFocusedIndex(index)
      }
    },
    [emails, setFocusedIndex]
  )

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="animate-pulse text-zinc-500">Loading Sniper...</div>
      </div>
    )
  }

  return (
    <AppShell
      emails={emails}
      selectedId={selectedId}
      focusedIndex={focusedIndex}
      onSelectEmail={handleSelectEmail}
      onSendEmail={sendEmail}
      onArchiveEmail={archiveEmail}
      onRegenerateEmail={regenerateEmail}
    />
  )
}
