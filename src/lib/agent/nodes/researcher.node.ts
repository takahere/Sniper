import FirecrawlApp from '@mendable/firecrawl-js'
import type { AgentState } from '../state'
import { mockScrapedContent } from '../mocks/research.mock'
import { getConfig, simulateDelay } from '../utils/config'

/**
 * Derive a website URL from company name
 * E.g., "Acme Corp" -> "https://acmecorp.com"
 */
function deriveCompanyUrl(companyName: string): string {
  const sanitized = companyName
    .toLowerCase()
    .replace(/\s+(inc|corp|llc|ltd|co)\.?$/i, '')
    .replace(/[^a-z0-9]/g, '')
  return `https://${sanitized}.com`
}

export async function researcherNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const config = getConfig()

  // If no company in contact, skip research
  if (!state.contact.company) {
    return {
      research: {
        companyUrl: '',
        scrapedContent: null,
        scrapedAt: null,
        error: 'No company information available',
      },
      progress: {
        researcher: 'completed',
        analyst: 'pending',
        copywriter: 'pending',
      },
    }
  }

  const companyName = state.contact.company
  const companyUrl = deriveCompanyUrl(companyName)

  // Real mode: Use Firecrawl when API key is available
  if (!config.useMockScraping && config.firecrawlApiKey) {
    try {
      const firecrawl = new FirecrawlApp({ apiKey: config.firecrawlApiKey })
      const result = await firecrawl.scrape(companyUrl, {
        formats: ['markdown'],
      })

      if (result.markdown) {
        return {
          research: {
            companyUrl,
            scrapedContent: result.markdown,
            scrapedAt: new Date(),
            error: null,
          },
          progress: {
            researcher: 'completed',
            analyst: 'pending',
            copywriter: 'pending',
          },
        }
      }

      // Firecrawl returned no content, fall through to mock
      console.warn('Firecrawl returned no content, falling back to mock')
    } catch (error) {
      // Log error and fall through to mock mode
      console.error('Firecrawl error:', error)
    }
  }

  // Mock mode fallback (also used when Firecrawl fails)
  await simulateDelay(600) // Simulate network delay

  const mockData =
    mockScrapedContent[companyName] ?? mockScrapedContent.default

  return {
    research: {
      companyUrl: mockData.url,
      scrapedContent: mockData.content,
      scrapedAt: new Date(),
      error: null,
    },
    progress: {
      researcher: 'completed',
      analyst: 'pending',
      copywriter: 'pending',
    },
  }
}
