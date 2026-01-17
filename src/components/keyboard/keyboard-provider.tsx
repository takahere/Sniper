'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { HotkeysProvider } from 'react-hotkeys-hook'

interface KeyboardContextValue {
  showShortcuts: boolean
  setShowShortcuts: (show: boolean) => void
  activeScope: string
  setActiveScope: (scope: string) => void
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null)

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [activeScope, setActiveScope] = useState('global')

  return (
    <KeyboardContext.Provider
      value={{ showShortcuts, setShowShortcuts, activeScope, setActiveScope }}
    >
      <HotkeysProvider initiallyActiveScopes={['global']}>
        {children}
      </HotkeysProvider>
    </KeyboardContext.Provider>
  )
}

export function useKeyboardContext() {
  const context = useContext(KeyboardContext)
  if (!context) {
    throw new Error('useKeyboardContext must be used within KeyboardProvider')
  }
  return context
}
