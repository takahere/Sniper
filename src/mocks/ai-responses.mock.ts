import type { AIDraft } from '@/schemas/ai-output.schema'

export const mockAIDrafts: Record<string, AIDraft> = {
  default: {
    intent: {
      signals: [
        {
          type: 'hiring',
          relevance: 'Company is actively expanding their engineering team',
          talkingPoint: 'Congratulations on the team growth! Building a strong engineering foundation is crucial.',
        },
        {
          type: 'funding',
          relevance: 'Recent funding indicates resources for new initiatives',
          talkingPoint: 'The recent Series B positions you well for scaling operations.',
        },
      ],
      tone: 'friendly',
      objective: 'Schedule an introductory call to discuss potential collaboration',
    },
    email: {
      subject: 'Congrats on the Series B - Quick thought on scaling',
      body: `Hi Sarah,

Saw the news about Acme's Series B - congratulations! Building out the engineering team at this stage is exactly the right move.

I noticed you're hiring across the stack. We've helped similar companies reduce their infrastructure overhead by 40% during rapid scaling phases.

Would you have 15 minutes this week for a quick call? I'd love to share a few specific ideas based on what I've seen work for teams at your stage.

Best,
Alex`,
      callToAction: 'Schedule a 15-minute introductory call',
    },
    alternatives: [
      {
        subject: "Quick idea for Acme's engineering scale-up",
        openingLine: "Hi Sarah, I've been following Acme's growth story...",
      },
      {
        subject: 'Scaling engineering post-Series B',
        openingLine: "Congrats on the funding! Wanted to share something that might help...",
      },
    ],
  },
  techstack: {
    intent: {
      signals: [
        {
          type: 'techstack',
          relevance: 'Company is migrating to Next.js 15',
          talkingPoint: 'The RSC patterns in Next.js 15 can be tricky but worth it.',
        },
      ],
      tone: 'casual',
      objective: 'Offer migration expertise and build rapport',
    },
    email: {
      subject: 'Next.js 15 Migration - A few tips from the trenches',
      body: `Hey,

I saw your team is working on the Next.js 15 migration. We went through the same transition last quarter and learned a few things the hard way.

A few quick wins we discovered:
- Server Actions simplify a lot of API routes
- The new caching defaults require some adjustment
- Parallel routes are game-changers for complex layouts

Happy to share our migration playbook if it would be helpful.

Cheers,
Alex`,
      callToAction: 'Share migration playbook and best practices',
    },
    alternatives: [
      {
        subject: 'RSC patterns that saved us during Next.js migration',
        openingLine: 'Going through a framework migration? We have some notes...',
      },
      {
        subject: 'Next.js 15 gotchas - learned these the hard way',
        openingLine: 'Just wrapped up our Next.js migration and thought you might find this useful...',
      },
    ],
  },
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Simulated streaming response
export async function* streamMockAIDraft(
  _contactId: string,
  draftKey: string = 'default'
): AsyncGenerator<Partial<AIDraft>> {
  const draft = mockAIDrafts[draftKey] || mockAIDrafts.default

  // Simulate streaming by yielding parts progressively
  await delay(200)
  yield {
    intent: {
      signals: [draft.intent.signals[0]],
      tone: draft.intent.tone,
      objective: ''
    }
  }

  await delay(300)
  yield { intent: draft.intent }

  await delay(400)
  yield {
    intent: draft.intent,
    email: {
      subject: draft.email.subject,
      body: '',
      callToAction: ''
    }
  }

  // Stream body character by character (in chunks for performance)
  const bodyChunks = draft.email.body.match(/.{1,50}/g) || []
  let streamedBody = ''

  for (const chunk of bodyChunks) {
    await delay(50)
    streamedBody += chunk
    yield {
      intent: draft.intent,
      email: {
        subject: draft.email.subject,
        body: streamedBody,
        callToAction: '',
      },
    }
  }

  await delay(200)
  yield {
    intent: draft.intent,
    email: draft.email,
    alternatives: []
  }

  await delay(100)
  yield draft
}
