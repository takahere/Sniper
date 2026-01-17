export interface StreamUpdate {
  type: 'progress' | 'research' | 'analysis' | 'draft' | 'error' | 'complete'
  node?: string
  data: unknown
  timestamp: number
}

export function createStreamEncoder(): TextEncoder {
  return new TextEncoder()
}

export function encodeStreamEvent(update: StreamUpdate): Uint8Array {
  const encoder = createStreamEncoder()
  return encoder.encode(`data: ${JSON.stringify(update)}\n\n`)
}

export function createSSEResponse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
