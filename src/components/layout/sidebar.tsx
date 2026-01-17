'use client'

import { motion } from 'framer-motion'
import {
  Inbox,
  Send,
  Clock,
  Archive,
  Settings,
  Sparkles,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  count?: number
  shortcut?: string
}

const navItems: NavItem[] = [
  { icon: Inbox, label: 'Inbox', href: '/', count: 8, shortcut: 'G I' },
  { icon: Send, label: 'Sent', href: '/sent', shortcut: 'G S' },
  { icon: Clock, label: 'Scheduled', href: '/scheduled', count: 3, shortcut: 'G C' },
  { icon: Archive, label: 'Archive', href: '/archive', shortcut: 'G A' },
]

export function Sidebar() {
  return (
    <div className="flex h-full flex-col overflow-hidden p-3">
      {/* Logo */}
      <div className="mb-6 flex min-w-0 items-center gap-2 px-1">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
        </div>
        <span className="truncate text-base font-semibold">Sniper</span>
      </div>

      {/* Compose Button */}
      <Button
        className="mb-4 w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
        size="sm"
      >
        <Plus className="h-4 w-4 flex-shrink-0" />
        <span className="ml-2 truncate">Compose</span>
        <kbd className="ml-auto hidden flex-shrink-0 rounded bg-zinc-300 px-1 py-0.5 text-[10px] xl:inline-block">C</kbd>
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={item.href === '/'}
          />
        ))}
      </nav>

      {/* Settings */}
      <Button variant="ghost" className="mt-2 w-full justify-start text-zinc-400" size="sm">
        <Settings className="h-4 w-4 flex-shrink-0" />
        <span className="ml-2 truncate">Settings</span>
        <kbd className="ml-auto hidden flex-shrink-0 text-[10px] text-zinc-600 xl:inline-block">,</kbd>
      </Button>
    </div>
  )
}

function SidebarNavItem({
  item,
  isActive,
}: {
  item: NavItem
  isActive: boolean
}) {
  const Icon = item.icon

  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
        isActive
          ? 'bg-zinc-800 text-zinc-100'
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1 truncate text-left text-sm">{item.label}</span>
      {item.count && (
        <span className="flex-shrink-0 text-xs text-zinc-500">{item.count}</span>
      )}
    </motion.button>
  )
}
