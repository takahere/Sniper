'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

interface UseKeyboardNavigationOptions<T> {
  items: T[]
  onSelect: (item: T, index: number) => void
  enabled?: boolean
}

export function useKeyboardNavigation<T>({
  items,
  onSelect,
  enabled = true,
}: UseKeyboardNavigationOptions<T>) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const itemsRef = useRef(items)

  // Keep items ref updated
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // Reset focus when items are removed and current index is out of bounds
  // This is a valid use case: adjusting index when list shrinks
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Necessary to keep index in bounds when items are removed
    setFocusedIndex((prev) => {
      if (prev >= items.length && items.length > 0) {
        return Math.max(0, items.length - 1)
      }
      return prev
    })
  }, [items.length])

  // Navigate down with 'j'
  useHotkeys(
    'j',
    () => {
      setFocusedIndex((prev) => Math.min(prev + 1, itemsRef.current.length - 1))
    },
    { enabled, preventDefault: true },
    [items.length, enabled]
  )

  // Navigate up with 'k'
  useHotkeys(
    'k',
    () => {
      setFocusedIndex((prev) => Math.max(prev - 1, 0))
    },
    { enabled, preventDefault: true },
    [enabled]
  )

  // Select with Enter
  useHotkeys(
    'enter',
    () => {
      const item = itemsRef.current[focusedIndex]
      if (item) {
        onSelect(item, focusedIndex)
      }
    },
    { enabled, preventDefault: true },
    [focusedIndex, onSelect]
  )

  const moveFocus = useCallback((direction: 'up' | 'down') => {
    setFocusedIndex((prev) => {
      if (direction === 'down') {
        return Math.min(prev + 1, itemsRef.current.length - 1)
      }
      return Math.max(prev - 1, 0)
    })
  }, [])

  const setFocus = useCallback((index: number) => {
    setFocusedIndex(Math.max(0, Math.min(index, items.length - 1)))
  }, [items.length])

  return {
    focusedIndex,
    setFocusedIndex: setFocus,
    moveFocus,
  }
}
