'use server'

import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const USE_MOCK = !resend

interface SendEmailInput {
  to: string[]
  subject: string
  body: string
  htmlBody?: string
}

interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  // Mock mode for development
  if (USE_MOCK) {
    console.log('[MOCK] Sending email:', input)
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    }
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: input.to,
      subject: input.subject,
      text: input.body,
      html: input.htmlBody,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (err) {
    console.error('Send email error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

export async function scheduleEmail(
  input: SendEmailInput,
  scheduledAt: Date
): Promise<SendEmailResult> {
  if (USE_MOCK) {
    console.log('[MOCK] Scheduling email for:', scheduledAt, input)
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      messageId: `mock-scheduled-${Date.now()}`,
    }
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: input.to,
      subject: input.subject,
      text: input.body,
      html: input.htmlBody,
      scheduledAt: scheduledAt.toISOString(),
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
