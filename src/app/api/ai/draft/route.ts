import { NextRequest } from 'next/server'
import {
  emailDraftGraph,
  type EmailDraftGraphInput,
  encodeStreamEvent,
  createSSEResponse,
} from '@/lib/agent'
import type { Contact } from '@/types/email.types'
import type { Signal } from '@/types/signal.types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contact, signals, context } = body as {
      contact: Contact
      signals: Signal[]
      context?: string
    }

    const input = {
      contact,
      inputSignals: signals || [],
      userContext: context || '',
    } satisfies EmailDraftGraphInput

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream graph execution
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const graphStream = await emailDraftGraph.stream(input as any, {
            streamMode: 'updates',
          })
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
