export interface MockScrapedContent {
  content: string
  url: string
}

export const mockScrapedContent: Record<string, MockScrapedContent> = {
  'Acme Corp': {
    url: 'https://acmecorp.com',
    content: `Acme Corp - Enterprise Software Solutions

About Us: Acme Corp is a leading enterprise software company founded in 2018.
We've raised $75M in Series B funding from top VCs including Sequoia and a16z.

Careers: We're hiring! Join our team of 200+ engineers. Currently 15 open positions
in engineering, including Senior Full-Stack Engineers, DevOps specialists, and ML Engineers.

News:
- Just opened new offices in New York City and London
- Announced partnership with AWS for cloud infrastructure
- CEO featured in Forbes 30 Under 30

Tech Stack: React, TypeScript, Node.js, PostgreSQL, Kubernetes`,
  },
  'Startup.io': {
    url: 'https://startup.io',
    content: `Startup.io - The Future of Developer Tools

About: We're building the next generation of developer productivity tools.
Recently closed a $25M Series A led by Andreessen Horowitz.

Team: Small but mighty team of 30 engineers, growing rapidly.
Open roles: Senior Backend Engineers (Go), Platform Engineers, DevRel.

Recent Announcements:
- Launched v2.0 with AI-powered code suggestions
- Migrating to Next.js 15 for our web platform
- Expanding to European markets Q2

Technologies: Go, Rust, TypeScript, Next.js, PostgreSQL`,
  },
  'Enterprise Inc': {
    url: 'https://enterprise.com',
    content: `Enterprise Inc - Fortune 500 Solutions

Overview: Enterprise Inc is a global leader in business process automation.
Market cap: $5B. Annual revenue: $800M.

Hiring Initiative: Massive expansion of engineering team planned.
50+ open positions across all engineering disciplines.

Latest News:
- Acquired AI startup for $100M
- Announced cloud-native transformation initiative
- Named a Leader in Gartner Magic Quadrant

Technology Investments: Kubernetes, AWS, Terraform, Python, Java`,
  },
  default: {
    url: 'https://example.com',
    content: `Company Overview

This is a growing technology company focused on innovation.
The company has been expanding its engineering team.

Recent activities suggest:
- Investment in new technologies
- Team expansion plans
- Market growth initiatives

Note: Limited public information available. Using existing signals for analysis.`,
  },
}
