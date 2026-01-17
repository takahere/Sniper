import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  emailDraftGraph,
  type EmailDraftGraphInput,
  encodeStreamEvent,
  createSSEResponse,
} from '@/lib/agent'

// Request validation schema
const draftRequestSchema = z.object({
  contact: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    company: z.string().optional(),
    title: z.string().optional(),
    avatarUrl: z.string().optional(),
  }),
  signals: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(['hiring', 'funding', 'techstack', 'expansion', 'news']),
        title: z.string(),
        description: z.string(),
        confidence: z.number().min(0).max(100),
        detectedAt: z.coerce.date(),
        source: z.string().optional(),
        sourceUrl: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .default([]),
  context: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const parseResult = draftRequestSchema.safeParse(body)
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request body',
          details: parseResult.error.flatten(),
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const { contact, signals, context } = parseResult.data

    const input: EmailDraftGraphInput = {
      contact,
      inputSignals: signals,
      userContext: context || '',
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream graph execution
          // LangGraph's stream method accepts partial input and merges with annotation defaults
          const graphStream = await emailDraftGraph.stream(
            input as Parameters<typeof emailDraftGraph.stream>[0],
            { streamMode: 'updates' }
          )
          for await (const event of graphStream) {
            // Event is { nodeName: stateUpdate }
            const entries = Object.entries(event)
            if (entries.length === 0) continue

            const [nodeName, stateUpdate] = entries[0] as [
              string,
              Record<string, unknown>,
            ]

            // Send progress update
            if (stateUpdate.progress) {
              controller.enqueue(
                encodeStreamEvent({
                  type: 'progress',
                  node: nodeName,
                  data: stateUpdate.progress,
                  timestamp: Date.now(),
                })
              )
            }

            // Send node-specific data
            if (nodeName === 'researcher' && stateUpdate.research) {
              controller.enqueue(
                encodeStreamEvent({
                  type: 'research',
                  node: nodeName,
                  data: stateUpdate.research,
                  timestamp: Date.now(),
                })
              )
            }

            if (nodeName === 'analyst' && stateUpdate.analysis) {
              controller.enqueue(
                encodeStreamEvent({
                  type: 'analysis',
                  node: nodeName,
                  data: stateUpdate.analysis,
                  timestamp: Date.now(),
                })
              )
            }

            if (nodeName === 'copywriter' && stateUpdate.draft) {
              controller.enqueue(
                encodeStreamEvent({
                  type: 'draft',
                  node: nodeName,
                  data: stateUpdate.draft,
                  timestamp: Date.now(),
                })
              )
            }

            // Send errors if any
            if (
              stateUpdate.errors &&
              Array.isArray(stateUpdate.errors) &&
              stateUpdate.errors.length > 0
            ) {
              controller.enqueue(
                encodeStreamEvent({
                  type: 'error',
                  node: nodeName,
                  data: stateUpdate.errors,
                  timestamp: Date.now(),
                })
              )
            }
          }

          // Send completion
          controller.enqueue(
            encodeStreamEvent({
              type: 'complete',
              data: null,
              timestamp: Date.now(),
            })
          )
        } catch (error) {
          controller.enqueue(
            encodeStreamEvent({
              type: 'error',
              data: error instanceof Error ? error.message : 'Unknown error',
              timestamp: Date.now(),
            })
          )
        } finally {
          controller.close()
        }
      },
    })

    return createSSEResponse(stream)
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Request failed',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
