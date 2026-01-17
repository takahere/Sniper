import type { Signal } from './signal.types'

export type EmailStatus = 'draft' | 'scheduled' | 'sent' | 'archived'
export type EmailPriority = 'high' | 'medium' | 'low'

export interface Contact {
  id: string
  email: string
  name: string
  company?: string
  title?: string
  avatarUrl?: string
}

export interface Email {
  id: string
  threadId?: string
  from: Contact
  to: Contact[]
  cc?: Contact[]
  subject: string
  body: string
  htmlBody?: string
  status: EmailStatus
  priority: EmailPriority
  signals: Signal[]
  createdAt: Date
  updatedAt: Date
  scheduledAt?: Date
  sentAt?: Date
}

export interface EmailThread {
  id: string
  emails: Email[]
  participants: Contact[]
  subject: string
  lastActivity: Date
}
