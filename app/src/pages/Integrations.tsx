import { Link } from 'react-router-dom'

const partnerOptions = [
  {
    name: 'Plaid',
    status: 'Preferred launch partner',
    details:
      'Plaid provides robust coverage across US/CA banks with a polished Link flow and category enrichment.',
  },
  {
    name: 'Finicity',
    status: 'Backup aggregator',
    details:
      'Great for mortgage + investment visibility. Kept warm in case we need alternative coverage.',
  },
  {
    name: 'MX',
    status: 'Researching add-on',
    details:
      'MX Insight APIs could power deeper spending insights once core syncing is stable.',
  },
]

const connectionSteps = [
  'Kick off Plaid Link from the dashboard when the user requests bank syncing.',
  'Exchange the public token server-side via Supabase Edge Functions to secure access tokens.',
  'Hydrate budgets and goals with fetched transactions, categorised using WalletHabit rules.',
  'Surface recurring merchant detections and nudge envelopes/goals with context-rich callouts.',
]

const dataFlow = [
  {
    title: 'Initial sync',
    description:
      'Import 90 days of transactions per connected account. Categorise and map to envelopes/goals.',
  },
  {
    title: 'Ongoing refresh',
    description:
      'Use Plaid webhooks to trigger background Supabase jobs that keep balances fresh.',
  },
  {
    title: 'User controls',
    description:
      'Daily digest email + in-app review tray for new activity before it impacts budgets.',
  },
]

const guardrails = [
  'Read-only data access — WalletHabit never initiates payments or transfers.',
  'Transparent consent with clear language on what data is accessed and how it is used.',
  'Easy disconnect controls in settings with immediate revocation of tokens.',
  'SOC 2 roadmap aligned with vendor requirements before GA.',
]

const milestones = [
  {
    label: 'Edge function scaffold',
    timeframe: 'Week 1',
    description: 'Set up Supabase Edge function shell and secure secret storage for Plaid keys.',
  },
  {
    label: 'Link preview in dashboard',
    timeframe: 'Week 2',
    description: 'Embed Link sandbox flow and simulate success states for stakeholders.',
  },
  {
    label: 'Transaction hydration',
    timeframe: 'Week 3-4',
    description: 'Persist bank data into Supabase tables and stitch into budget + goals experiences.',
  },
  {
    label: 'Beta feedback',
    timeframe: 'Week 5',
    description: 'Run a closed beta with early adopters and refine categorisation rules.',
  },
]

export default function Integrations() {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-brand">Bank sync blueprint</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Aggregations & automations on deck</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          This integrations lab showcases how WalletHabit will pull transactions into your budgets and goals.
          We&apos;re staging the experience ahead of credentials so the API wiring can plug in without UI churn.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand">
          <span className="inline-flex h-2 w-2 rounded-full bg-brand"></span>
          Sandbox mode — waiting on Plaid client secrets
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Launch partner landscape</h2>
          <p className="mt-2 text-sm text-slate-600">
            WalletHabit will start with Plaid for coverage + developer velocity, while keeping optional
            aggregators in the wings for specialty needs.
          </p>
          <ul className="mt-6 space-y-4">
            {partnerOptions.map((partner) => (
              <li key={partner.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-slate-900">{partner.name}</p>
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand">{partner.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{partner.details}</p>
              </li>
            ))}
          </ul>
        </article>
        <aside className="flex flex-col gap-4 rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold">Integration checklist</h3>
          <ul className="space-y-3">
            {connectionSteps.map((step) => (
              <li key={step} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand"></span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <Link to="/settings" className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand hover:text-brand-dark">
            Review permissions in settings →
          </Link>
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {dataFlow.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.title}</p>
            <p className="mt-3 text-sm text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Safety guardrails</h2>
        <p className="mt-2 text-sm text-slate-600">
          Security and consent remain at the centre of the integration rollout.
        </p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {guardrails.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Rollout milestones</h2>
          <ul className="mt-4 space-y-4">
            {milestones.map((milestone) => (
              <li key={milestone.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="font-semibold uppercase tracking-wide text-slate-600">{milestone.timeframe}</span>
                  <span className="text-brand">{milestone.label}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{milestone.description}</p>
              </li>
            ))}
          </ul>
        </article>
        <aside className="flex flex-col justify-between gap-4 rounded-3xl border border-brand/40 bg-brand/5 p-6 text-sm text-brand-dark">
          <div>
            <h3 className="text-base font-semibold">What&apos;s next</h3>
            <p className="mt-2">
              While secrets wait in the wings, we&apos;re finalising schema plans for `bank_accounts`,
              `transactions`, and webhook processors.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/30 bg-white/60 p-4 text-xs text-slate-600">
            <p className="font-semibold uppercase tracking-wide text-brand">Developer note</p>
            <p className="mt-2">
              Supabase Edge Functions will proxy Plaid token exchanges. Once deployed, the dashboard
              and budget planner can read live balances without structural changes.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
