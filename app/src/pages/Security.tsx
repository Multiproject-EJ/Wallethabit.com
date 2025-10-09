type Highlight = {
  label: string
  value: string
  description: string
}

type Pillar = {
  title: string
  description: string
  details: string[]
}

type Practice = {
  title: string
  summary: string
  checkpoints: string[]
}

type RoadmapPhase = {
  phase: string
  target: string
  items: string[]
}

type Faq = {
  question: string
  answer: string
}

type Channel = {
  name: string
  description: string
  action: { label: string; href: string }
}

const highlights: Highlight[] = [
  {
    label: 'Encryption',
    value: '100% sensitive fields',
    description: 'Access tokens, credentials, and vault notes encrypted at rest and in transit.',
  },
  {
    label: 'Availability goal',
    value: '99.5% preview target',
    description: 'Multi-AZ Supabase deployment plan with automated nightly backups & PITR.',
  },
  {
    label: 'Security response',
    value: '< 1 business day',
    description: 'Acknowledgement SLA for vulnerability reports sent to the trust desk.',
  },
]

const securityPillars: Pillar[] = [
  {
    title: 'Infrastructure hardening',
    description:
      'Supabase-managed Postgres with row-level security, scoped database roles, and Terraform-controlled infrastructure.',
    details: [
      'Automated backups with seven-day point-in-time recovery coverage.',
      'Separate projects for production, staging, and internal sandboxes.',
      'GitHub-required code reviews before infra changes reach main.',
    ],
  },
  {
    title: 'Data protection & privacy',
    description:
      'Encryption policies, retention controls, and access logging keep budgeting and lab data private by default.',
    details: [
      'Field-level encryption for bank connections, insights, and advisor notes.',
      'Retention schedules enforce purge windows for archived experiments.',
      'Customers receive export + deletion tooling tied to their Supabase profile.',
    ],
  },
  {
    title: 'Secure development lifecycle',
    description:
      'Continuous dependency scanning, automated previews, and threat modeling rituals guide every release.',
    details: [
      'Dependabot alerts triaged weekly alongside vulnerability scoring.',
      'Security champions checklist baked into pull request templates.',
      'Playwright smoke suite planned for authentication, billing, and budget flows.',
    ],
  },
  {
    title: 'Payments & compliance',
    description:
      'Stripe Checkout & Billing store card data; WalletHabit limits scope to subscription metadata and receipts.',
    details: [
      'SOC 2 Type I readiness runbook with policy owners assigned.',
      'Incident communications plan covering customers, partners, and regulators.',
      'GDPR/CCPA intake form templates staged for auth launch.',
    ],
  },
]

const operationalPractices: Practice[] = [
  {
    title: 'Identity & access',
    summary: 'Least-privilege access enforced through Supabase policies and SSO requirements.',
    checkpoints: [
      'SSO enforced for GitHub, Supabase, and deployment tooling.',
      'Secrets rotated quarterly with audit confirmation in TODO tracker.',
      'Role-based dashboards define on-call vs. builder permissions.',
    ],
  },
  {
    title: 'Monitoring & detection',
    summary: 'Logs, metrics, and alerting stitched together for quick anomaly triage.',
    checkpoints: [
      'Realtime log streaming into project observability dashboards.',
      'Synthetic uptime probes on dashboard, auth, and checkout flows.',
      'Slack channel escalation path with 24/7 notification routing.',
    ],
  },
  {
    title: 'Continuity planning',
    summary: 'Resilience plans protect customer outcomes if incidents occur.',
    checkpoints: [
      'Documented incident severities and communication scripts.',
      'Quarterly tabletop exercises with action item tracking.',
      'Partner failover checklists for Plaid and Stripe disruption scenarios.',
    ],
  },
]

const roadmap: RoadmapPhase[] = [
  {
    phase: 'Now',
    target: 'Preview launch',
    items: [
      'Finish Supabase RLS coverage for every lab table.',
      'Roll out environment secret rotation playbook.',
      'Ship public-facing security disclosure guidelines.',
    ],
  },
  {
    phase: 'Next',
    target: 'Beta release',
    items: [
      'Add automated accessibility + security linting to CI.',
      'Integrate uptime and error telemetry into operations dashboard.',
      'Publish third-party penetration test summary.',
    ],
  },
  {
    phase: 'Later',
    target: 'General availability',
    items: [
      'Pursue SOC 2 Type I attestation with independent auditor.',
      'Launch self-serve data export & deletion tooling.',
      'Establish community bug bounty with published scope.',
    ],
  },
]

const faqs: Faq[] = [
  {
    question: 'Where is customer data stored?',
    answer:
      'Supabase manages encrypted Postgres clusters hosted in the United States. Regional replicas will be evaluated as soon as customer demand requires localized residency.',
  },
  {
    question: 'How do you handle third-party bank connections?',
    answer:
      'Plaid Link tokens remain encrypted and scoped to the minimal endpoints required for transaction syncing. Bank credentials are never stored on WalletHabit infrastructure.',
  },
  {
    question: 'Can I export or delete my information?',
    answer:
      'Account owners can request exports and deletions via in-app controls or email. Requests are verified through Supabase auth and fulfilled within 30 days.',
  },
  {
    question: 'What happens during a security incident?',
    answer:
      'Incidents are triaged using a four-level severity scale with clear notification windows. Customers impacted by a major incident hear from the team within 72 hours.',
  },
]

const disclosureChannels: Channel[] = [
  {
    name: 'Security desk',
    description: 'Send responsible disclosure reports or privacy concerns directly to the team.',
    action: {
      label: 'Email security@wallethabit.com',
      href: 'mailto:security@wallethabit.com',
    },
  },
  {
    name: 'Status dashboard',
    description: 'Real-time uptime metrics and historical incident retrospectives (coming soon).',
    action: {
      label: 'View status page',
      href: 'https://status.wallethabit.com',
    },
  },
  {
    name: 'Roadmap updates',
    description: 'Follow milestone shipping notes and security updates in the public changelog.',
    action: {
      label: 'Read changelog',
      href: 'https://github.com/wallethabit/Wallethabit.com/blob/main/TODO.md',
    },
  },
]

export default function Security() {
  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <header className="rounded-3xl border border-brand/30 bg-white px-8 py-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            Trust center preview
          </span>
          <h1 className="text-4xl font-bold text-slate-900">Security, privacy, and reliability commitments</h1>
          <p className="text-base text-slate-600">
            WalletHabit protects household finances with defense-in-depth infrastructure, responsible data governance, and transparent communications. This living page highlights what is delivered today and what is landing next.
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {highlights.map((highlight) => (
          <article
            key={highlight.label}
            className="rounded-3xl border border-brand/20 bg-brand/5 p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">{highlight.label}</p>
            <p className="mt-3 text-xl font-semibold text-brand-dark">{highlight.value}</p>
            <p className="mt-2 text-sm text-brand-dark/80">{highlight.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {securityPillars.map((pillar) => (
          <article key={pillar.title} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{pillar.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{pillar.description}</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              {pillar.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Operational practices</h2>
            <p className="text-sm text-slate-600">
              Day-to-day routines keep sensitive information protected while ensuring the product remains reliable for households and partners.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {operationalPractices.map((practice) => (
            <article key={practice.title} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{practice.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{practice.summary}</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {practice.checkpoints.map((checkpoint) => (
                  <li key={checkpoint} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                    <span>{checkpoint}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Security roadmap</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {roadmap.map((phase) => (
            <article key={phase.phase} className="flex flex-col gap-4 rounded-2xl border border-brand/20 bg-brand/5 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">{phase.phase}</p>
                <h3 className="text-lg font-semibold text-brand-dark">{phase.target}</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
          <dl className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <dt className="text-sm font-semibold text-slate-900">{faq.question}</dt>
                <dd className="mt-2 text-sm text-slate-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
        <aside className="rounded-3xl border border-brand/40 bg-brand/10 p-8 text-sm text-brand-dark shadow-sm">
          <h3 className="text-base font-semibold text-brand-dark">Disclosure & updates</h3>
          <ul className="mt-4 space-y-3">
            {disclosureChannels.map((channel) => (
              <li key={channel.name} className="rounded-2xl border border-brand/20 bg-white/80 p-4">
                <p className="text-sm font-semibold text-brand-dark">{channel.name}</p>
                <p className="mt-1 text-xs text-brand-dark/80">{channel.description}</p>
                <a
                  className="mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-brand hover:text-brand-dark"
                  href={channel.action.href}
                >
                  {channel.action.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="rounded-3xl border border-dashed border-brand/40 bg-brand/5 p-8 text-center">
        <h2 className="text-xl font-semibold text-brand">Partner with us on security</h2>
        <p className="mt-3 text-sm text-slate-600">
          Have a question, vulnerability report, or idea for improving resilience? Email{' '}
          <a className="font-semibold text-brand-dark" href="mailto:security@wallethabit.com">
            security@wallethabit.com
          </a>{' '}
          and we will acknowledge your message within one business day.
        </p>
      </section>
    </div>
  )
}
