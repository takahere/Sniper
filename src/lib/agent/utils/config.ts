export interface AgentConfig {
  useMockScraping: boolean
  useMockAI: boolean
  firecrawlApiKey: string | null
  anthropicApiKey: string | null
}

export function getConfig(): AgentConfig {
  return {
    useMockScraping: !process.env.FIRECRAWL_API_KEY,
    useMockAI: !process.env.ANTHROPIC_API_KEY,
    firecrawlApiKey: process.env.FIRECRAWL_API_KEY || null,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || null,
  }
}

export async function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
