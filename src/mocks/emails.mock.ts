import type { Email, Contact } from '@/types/email.types'
import type { Signal } from '@/types/signal.types'

export const mockContacts: Contact[] = [
  {
    id: '1',
    email: 'sarah.chen@acme.com',
    name: 'Sarah Chen',
    company: 'Acme Corp',
    title: 'VP of Engineering',
  },
  {
    id: '2',
    email: 'mike.johnson@startup.io',
    name: 'Mike Johnson',
    company: 'Startup.io',
    title: 'CTO',
  },
  {
    id: '3',
    email: 'lisa.park@enterprise.com',
    name: 'Lisa Park',
    company: 'Enterprise Inc',
    title: 'Director of Operations',
  },
  {
    id: '4',
    email: 'david.kim@techco.dev',
    name: 'David Kim',
    company: 'TechCo',
    title: 'Head of Product',
  },
  {
    id: '5',
    email: 'emma.wilson@scaleup.io',
    name: 'Emma Wilson',
    company: 'ScaleUp',
    title: 'CEO',
  },
  {
    id: '6',
    email: 'james.taylor@fintech.com',
    name: 'James Taylor',
    company: 'FinTech Solutions',
    title: 'VP of Sales',
  },
  {
    id: '7',
    email: 'olivia.brown@cloudops.io',
    name: 'Olivia Brown',
    company: 'CloudOps',
    title: 'Engineering Manager',
  },
  {
    id: '8',
    email: 'noah.davis@dataflow.ai',
    name: 'Noah Davis',
    company: 'DataFlow AI',
    title: 'Founder',
  },
]

export const mockSignals: Signal[] = [
  {
    id: 's1',
    type: 'hiring',
    title: 'Hiring 5+ Engineers',
    description: 'Posted 5 new engineering positions on LinkedIn in the past week',
    source: 'LinkedIn',
    sourceUrl: 'https://linkedin.com/company/acme',
    confidence: 92,
    detectedAt: new Date('2025-01-08'),
  },
  {
    id: 's2',
    type: 'funding',
    title: 'Series B - $50M',
    description: 'Announced Series B funding round led by Sequoia Capital',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com/2025/01/05/acme-series-b',
    confidence: 100,
    detectedAt: new Date('2025-01-05'),
  },
  {
    id: 's3',
    type: 'techstack',
    title: 'Migrating to Next.js',
    description: 'Job posting mentions Next.js 15 migration project',
    source: 'Job Board',
    confidence: 78,
    detectedAt: new Date('2025-01-07'),
  },
  {
    id: 's4',
    type: 'expansion',
    title: 'Opening NYC Office',
    description: 'Company announced expansion to New York City',
    source: 'Press Release',
    confidence: 95,
    detectedAt: new Date('2025-01-06'),
  },
  {
    id: 's5',
    type: 'news',
    title: 'Featured in Forbes 30 Under 30',
    description: 'CEO was featured in Forbes 30 Under 30 list',
    source: 'Forbes',
    sourceUrl: 'https://forbes.com/30-under-30',
    confidence: 100,
    detectedAt: new Date('2025-01-03'),
  },
  {
    id: 's6',
    type: 'hiring',
    title: 'New VP of Sales Role',
    description: 'Looking for VP of Sales to lead go-to-market strategy',
    source: 'LinkedIn',
    confidence: 88,
    detectedAt: new Date('2025-01-09'),
  },
  {
    id: 's7',
    type: 'techstack',
    title: 'Adopting Kubernetes',
    description: 'Infrastructure team is implementing Kubernetes for orchestration',
    source: 'GitHub',
    confidence: 72,
    detectedAt: new Date('2025-01-04'),
  },
  {
    id: 's8',
    type: 'funding',
    title: 'Seed Round - $3M',
    description: 'Closed seed round from Y Combinator',
    source: 'Crunchbase',
    confidence: 100,
    detectedAt: new Date('2025-01-02'),
  },
]

const meContact: Contact = { id: 'me', email: 'me@sniper.app', name: 'Me' }

export const mockEmails: Email[] = [
  {
    id: 'e1',
    from: meContact,
    to: [mockContacts[0]],
    subject: 'Congrats on the Series B - Quick thought on scaling',
    body: `Hi Sarah,

Saw the news about Acme's Series B - congratulations! Building out the engineering team at this stage is exactly the right move.

I noticed you're hiring across the stack. We've helped similar companies reduce their infrastructure overhead by 40% during rapid scaling phases.

Would you have 15 minutes this week for a quick call? I'd love to share a few specific ideas based on what I've seen work for teams at your stage.

Best,
Alex`,
    status: 'draft',
    priority: 'high',
    signals: [mockSignals[0], mockSignals[1]],
    createdAt: new Date('2025-01-09T10:30:00'),
    updatedAt: new Date('2025-01-09T14:20:00'),
  },
  {
    id: 'e2',
    from: meContact,
    to: [mockContacts[1]],
    subject: 'Re: Next.js Migration - Have you considered this?',
    body: `Hey Mike,

I saw your team is working on the Next.js 15 migration. We went through the same transition last quarter and learned a few things the hard way.

Happy to share our migration playbook if it would be helpful. The RSC patterns especially took some getting used to.

Let me know if you'd like to chat.

Cheers,
Alex`,
    status: 'draft',
    priority: 'medium',
    signals: [mockSignals[2]],
    createdAt: new Date('2025-01-09T09:15:00'),
    updatedAt: new Date('2025-01-09T11:45:00'),
  },
  {
    id: 'e3',
    from: meContact,
    to: [mockContacts[2]],
    subject: 'NYC expansion - office setup tips',
    body: `Hi Lisa,

Congrats on the NYC expansion! Setting up a new office is exciting but can be tricky.

We've helped 20+ companies navigate the NYC commercial real estate market. A few quick tips:
- WeWork alternatives in SoHo are 40% cheaper
- The talent pool in Brooklyn is underrated
- Tax incentives for tech companies are available until Q2

Would love to share more over coffee if you're ever in the city.

Best,
Alex`,
    status: 'draft',
    priority: 'medium',
    signals: [mockSignals[3]],
    createdAt: new Date('2025-01-08T16:00:00'),
    updatedAt: new Date('2025-01-08T16:30:00'),
  },
  {
    id: 'e4',
    from: meContact,
    to: [mockContacts[3]],
    subject: 'Loved your ProductHunt launch',
    body: `David,

Just saw TechCo hit #1 on ProductHunt - congrats! That's no small feat.

Your product demo video was excellent. The way you showcased the AI features resonated with a lot of our customers who have similar needs.

Would you be open to a quick chat? I think there might be some interesting partnership opportunities.

Best,
Alex`,
    status: 'draft',
    priority: 'low',
    signals: [mockSignals[4]],
    createdAt: new Date('2025-01-08T14:00:00'),
    updatedAt: new Date('2025-01-08T14:15:00'),
  },
  {
    id: 'e5',
    from: meContact,
    to: [mockContacts[4]],
    subject: 'Forbes 30 Under 30 - Well deserved!',
    body: `Hi Emma,

Huge congratulations on the Forbes 30 Under 30 feature! ScaleUp's growth trajectory is impressive.

I've been following your company since the early days and love seeing the progress. Your approach to customer success is refreshing.

If you ever want to compare notes on scaling B2B SaaS, I'd love to connect.

Cheers,
Alex`,
    status: 'draft',
    priority: 'high',
    signals: [mockSignals[4], mockSignals[5]],
    createdAt: new Date('2025-01-07T11:00:00'),
    updatedAt: new Date('2025-01-07T12:30:00'),
  },
  {
    id: 'e6',
    from: meContact,
    to: [mockContacts[5]],
    subject: 'Sales team scaling - quick question',
    body: `James,

I noticed FinTech Solutions is hiring aggressively for the sales team. That's a great sign!

I'm curious - are you using any AI tools for sales enablement? We've seen some interesting patterns emerge in the fintech space.

Would love to hear your perspective. 15 minutes next week?

Best,
Alex`,
    status: 'draft',
    priority: 'medium',
    signals: [mockSignals[5]],
    createdAt: new Date('2025-01-07T09:00:00'),
    updatedAt: new Date('2025-01-07T09:45:00'),
  },
  {
    id: 'e7',
    from: meContact,
    to: [mockContacts[6]],
    subject: 'Kubernetes migration thoughts',
    body: `Hi Olivia,

I saw CloudOps is implementing Kubernetes. Great choice for your scale!

We've been through this journey and have some lessons learned around:
- Cost optimization with spot instances
- Multi-cluster management
- Service mesh considerations

Happy to share our experience if you're interested.

Best,
Alex`,
    status: 'draft',
    priority: 'low',
    signals: [mockSignals[6]],
    createdAt: new Date('2025-01-06T15:00:00'),
    updatedAt: new Date('2025-01-06T15:30:00'),
  },
  {
    id: 'e8',
    from: meContact,
    to: [mockContacts[7]],
    subject: 'Y Combinator congrats + quick intro',
    body: `Noah,

Congrats on the YC funding! DataFlow AI looks like exactly the kind of company YC loves backing.

I've worked with several YC companies in the AI/ML space and noticed some common patterns around go-to-market. Would love to share what's worked.

Are you free for a quick call this week?

Best,
Alex`,
    status: 'draft',
    priority: 'high',
    signals: [mockSignals[7]],
    createdAt: new Date('2025-01-05T10:00:00'),
    updatedAt: new Date('2025-01-05T11:00:00'),
  },
]

// Mock data provider with delay simulation
export async function getMockEmails(delay = 500): Promise<Email[]> {
  await new Promise(resolve => setTimeout(resolve, delay))
  return mockEmails
}

export async function getMockEmail(id: string, delay = 300): Promise<Email | null> {
  await new Promise(resolve => setTimeout(resolve, delay))
  return mockEmails.find(e => e.id === id) || null
}
