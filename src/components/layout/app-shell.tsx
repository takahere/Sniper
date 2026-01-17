'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Sidebar } from './sidebar'
import { DraftList } from './draft-list'
import { DetailView } from './detail-view'
import type { Email } from '@/types/email.types'

interface AppShellProps {
  emails: Email[]
  selectedId: string | null
  focusedIndex: number
  onSelectEmail: (id: string) => void
  onSendEmail: (id: string) => void
  onArchiveEmail: (id: string) => void
  onRegenerateEmail: (id: string) => void
}

export function AppShell({
  emails,
  selectedId,
  focusedIndex,
  onSelectEmail,
  onSendEmail,
  onArchiveEmail,
  onRegenerateEmail,
}: AppShellProps) {
  const selectedEmail = emails.find((e) => e.id === selectedId) || null

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar */}
        <ResizablePanel
          defaultSize={14}
          minSize={10}
          maxSize={18}
          className="min-w-[140px] bg-zinc-950"
        >
          <Sidebar />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-zinc-800 transition-colors hover:bg-zinc-700" />

        {/* Email List */}
        <ResizablePanel
          defaultSize={28}
          minSize={20}
          maxSize={40}
          className="min-w-[240px] overflow-hidden bg-zinc-900"
        >
          <DraftList
            emails={emails}
            selectedId={selectedId}
            focusedIndex={focusedIndex}
            onSelect={onSelectEmail}
          />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-zinc-800 transition-colors hover:bg-zinc-700" />

        {/* Detail View */}
        <ResizablePanel
          defaultSize={58}
          minSize={30}
          className="overflow-hidden bg-zinc-950"
        >
          <DetailView
            email={selectedEmail}
            onSend={onSendEmail}
            onArchive={onArchiveEmail}
            onRegenerate={onRegenerateEmail}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
