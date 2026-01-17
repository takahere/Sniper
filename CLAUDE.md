# Sniper - Claude Code Rules

## Project Overview

Sniper is a Superhuman-like email client for sales, powered by LangGraph Agents.

**Tech Stack:**
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui (New York, Zinc, dark mode only)
- LangGraph.js + Vercel AI SDK + Anthropic Claude
- Framer Motion for animations
- Resend for email sending

## Development Rules

### After Implementation

**IMPORTANT:** After any code changes, always ensure the app is viewable locally:

```bash
npm run dev
```

The dev server will start at `http://localhost:3000` (or next available port).

### Build Verification

Before completing any task, run:

```bash
npm run build
```

This ensures no TypeScript errors exist.

### Testing Modes

The app supports multiple API configurations:

| Mode | Environment | Behavior |
|------|-------------|----------|
| **Mock Mode** | No API keys | All nodes use mock data |
| **AI Only** | `ANTHROPIC_API_KEY` set | Real Claude, mock scraping |
| **Full Real** | Both keys set | Real Firecrawl + Real Claude |

### Environment Variables

Copy `.env.example` to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...    # Real Claude AI
FIRECRAWL_API_KEY=fc-...        # Real web scraping
RESEND_API_KEY=re_...           # Real email sending
```

## Architecture

### LangGraph Agent Pipeline

```
[START] -> [Researcher] -> [Analyst] -> [Copywriter] -> [END]
              |               |              |
         Firecrawl        Claude          Claude
         (scrape)        (analyze)       (generate)
```

**Key Files:**
- `src/lib/agent/nodes/` - Node implementations
- `src/lib/agent/graph.ts` - Graph construction
- `src/app/api/ai/draft/route.ts` - SSE streaming endpoint
- `src/hooks/use-ai-draft.ts` - Client-side hook

### Graceful Degradation

All nodes automatically fall back to mock data when:
- API key is missing
- API call fails
- Network timeout

The app **never fully breaks** - worst case is mock data.

## Code Style

- Dark mode only (no light mode toggle)
- Zinc color palette
- Use Framer Motion for animations
- Keyboard-first UX (j/k navigation, Cmd+Enter to send)
- No emojis unless user requests

## Common Tasks

### Add a New Agent Node

1. Create node file in `src/lib/agent/nodes/`
2. Add to graph in `src/lib/agent/graph.ts`
3. Update `NodeProgress` type in `src/lib/agent/state.ts`
4. Update `PipelineProgress` UI component

### Update AI Prompts

- Analyst prompt: `src/lib/agent/nodes/analyst.node.ts`
- Copywriter prompt: `src/lib/agent/nodes/copywriter.node.ts`
