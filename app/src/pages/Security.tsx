const securityPillars = [
  {
    title: 'Infrastructure hardening',
    description:
      'Supabase-managed Postgres with row-level security, just-in-time database roles, and encrypted storage for customer vaults.',
    details: [
      'Regional deployment planned across multi-AZ infrastructure for redundancy.',
      'Daily backups with point-in-time recovery windows and automated integrity checks.',
      'Infrastructure-as-code with pull-request reviews before changes reach production.',
    ],
  },
  {
    title: 'Data protection & privacy',
    description:
      'Sensitive fields encrypted at rest and in transit, with strict data minimisation across budgeting, goals, and lab modules.',
    details: [
      'Field-level encryption for bank tokens, income experiments, and insurance coverage notes.',
      'Granular data retention policies so archived labs purge after inactivity windows.',
      'Customer-owned exports with transparent audit trails for all data access events.',
    ],
  },
  {
    title: 'Application security',
    description:
      'Static builds shipped via GitHub Pages, backed by GitHub Actions security scanning and dependency hygiene rituals.',
    details: [
      'Automated dependency review with alerts for critical advisories in npm ecosystem.',
      'Playwright smoke tests planned before every production deploy to guard critical flows.',
      'Bug bounty brief drafted for future community security researchers.',
    ],
  },
  {
    title: 'Payments & compliance',
    description:
      'Stripe Checkout handles card details; WalletHabit never touches PCI scope data and keeps receipts reconciled nightly.',
    details: [
      'SOC 2 Type I readiness workstream kicks off post-auth launch, with security policies written now.',
      'Identity verification guardrails prepared for future premium banking features.',
      'GDPR and CCPA data subject request pathways documented with 30-day response commitments.',
    ],
  },
]

const roadmap = [
  {
    phase: 'Phase 1 — Foundations',
    items: [
      'Finalize Supabase RLS policies for budgets, goals, and lab simulations.',
      'Roll out environment secrets management playbook with rotation cadence.',
      'Enable mandatory SSO for internal admin surfaces (GitHub + Supabase).',
    ],
  },
  {
    phase: 'Phase 2 — Monitoring',
    items: [
      'Wire Supabase audit logs into centralized observability dashboards.',
      'Launch uptime + anomaly alerts piped to the on-call rotation in Slack.',
      'Integrate Snyk or Dependabot security updates into the weekly sprint cadence.',
    ],
  },
  {
    phase: 'Phase 3 — Certifications',
    items: [
      'Engage third-party auditors for SOC 2 Type I readiness assessment.',
      'Complete Stripe Radar tuning and chargeback response runbooks.',
      'Document incident response tabletop exercises with quarterly refresh cadence.',
    ],
  },
]

const faqs = [
  {
    question: 'Where is customer data stored?',
    answer:
      'WalletHabit will host data in Supabase-managed Postgres within the United States by default, with regional replicas considered once customer geography expands.',
  },
  {
    question: 'How do you handle third-party bank connections?',
    answer:
      'Plaid Link tokens remain encrypted and scoped to the minimum endpoints required for transaction syncing. The trust center will share detailed flow diagrams before launch.',
  },
  {
    question: 'Can I export or delete my information?',
    answer:
      'Yes — export tools are on the roadmap for each lab. Deletion requests will be honored within 30 days and verified via Supabase row-level policies.',
  },
  {
    question: 'What happens during a security incident?',
    answer:
      'The incident response playbook defines severity levels, notification windows, and post-incident reviews. Customers are informed within 72 hours for any material impact.',
  },
]

const partners = [
  {
    name: 'Supabase',
    focus: 'Managed Postgres, auth, storage',
    status: 'Active integration',
  },
  {
    name: 'Stripe',
    focus: 'Billing, subscription management',
    status: 'Checkout sandbox ready',
  },
  {
    name: 'Plaid',
    focus: 'Bank connections, transaction sync',
    status: 'Sandbox blueprint staged',
  },
  {
    name: 'Clerk (evaluating)',
    focus: 'Advanced authentication & session management',
    status: 'Under consideration for multi-factor auth',
  },
]

export default function Security() {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-brand/30 bg-white px-8 py-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            Trust center preview
          </span>
          <h1 className="text-4xl font-bold">Security, privacy, and reliability commitments.</h1>
          <p className="text-sm text-slate-600">
            WalletHabit keeps customer finances safe through defense-in-depth, transparent data governance, and always-on observability. This trust hub outlines the safeguards shipping alongside Supabase auth and Plaid bank syncing.
          </p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        {securityPillars.map((pillar) => (
          <article key={pillar.title} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{pillar.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{pillar.description}</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              {pillar.details.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Security roadmap</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {roadmap.map((phase) => (
            <div key={phase.phase} className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
              <h3 className="text-lg font-semibold text-brand-dark">{phase.phase}</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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
          <h3 className="text-base font-semibold">Trusted partners</h3>
          <ul className="mt-4 space-y-3">
            {partners.map((partner) => (
              <li key={partner.name} className="rounded-2xl border border-brand/20 bg-white/70 p-4">
                <p className="text-sm font-semibold text-brand-dark">{partner.name}</p>
                <p className="text-xs text-brand-dark/80">{partner.focus}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-brand">{partner.status}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="rounded-3xl border border-dashed border-brand/40 bg-brand/5 p-8 text-center">
        <h2 className="text-xl font-semibold text-brand">Have security feedback?</h2>
        <p className="mt-3 text-sm text-slate-600">
          Email <a className="font-semibold text-brand-dark" href="mailto:security@wallethabit.com">security@wallethabit.com</a> with findings or suggestions. We acknowledge reports within one business day and keep you updated on resolutions.
        </p>
      </section>
    </div>
  )
}
