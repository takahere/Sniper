# Sniper

Superhuman-like email client for sales, powered by LangGraph Agents.

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui (New York, Zinc, dark mode only)
- LangGraph.js + Vercel AI SDK + Anthropic Claude
- Framer Motion for animations
- Resend for email sending

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

Copy `.env.example` to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...    # Real Claude AI
FIRECRAWL_API_KEY=fc-...        # Real web scraping
RESEND_API_KEY=re_...           # Real email sending
```

## Architecture

```
[START] -> [Researcher] -> [Analyst] -> [Copywriter] -> [END]
              |               |              |
         Firecrawl        Claude          Claude
         (scrape)        (analyze)       (generate)
```

All nodes automatically fall back to mock data when API keys are missing or calls fail.
