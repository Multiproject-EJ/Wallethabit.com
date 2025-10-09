import IntegrationStatus from '../components/IntegrationStatus'
import { hasStripeConfig, stripeEnvGuidance } from '../lib/stripeClient'
import { hasSupabaseConfig, supabaseEnvGuidance } from '../lib/supabaseClient'
import { useDemoData } from '../lib/demoDataStore'

const highlights = [
  {
    label: 'Budget envelopes',
    value: 'MVP ready',
    description: 'Interactive envelope planner launched with adjustable targets and progress.',
  },
  {
    label: 'Savings goals',
    value: 'Strategy lab live',
    description: 'Goal HQ now includes a contribution sandbox with progress donuts and spark-lines.',
  },
  {
    label: 'AI guidance',
    value: 'Copilot lab',
    description: 'Interactive helper panel seeded with prompt scripts and conversational flows.',
  },
  {
    label: 'Bank syncing',
    value: 'Blueprint live',
    description: 'New integrations lab outlines Plaid-powered imports, guardrails, and rollout milestones.',
  },
  {
    label: 'Debt payoff',
    value: 'Strategy lab',
    description: 'Fresh payoff lab simulates snowball, avalanche, and hybrid acceleration boosts.',
  },
  {
    label: 'Income growth',
    value: 'Boost lab',
    description: 'New income lab models focus hours + leverage playbooks for resilient earnings.',
  },
  {
    label: 'Investments',
    value: 'Autopilot lab',
    description: 'Fresh investing lab sets allocation bands and 10-year projections for compounding.',
  },
  {
    label: 'Protection',
    value: 'Safety net lab',
    description: 'Brand-new protection lab stress-tests emergency runways and insurance coverage gaps.',
  },
  {
    label: 'Estate planning',
    value: 'Legacy lab',
    description: 'Fresh legacy lab aligns trusts, guardianship plans, and liquidity buffers before engaging counsel.',
  },
  {
    label: 'Tax strategy',
    value: 'Optimization lab',
    description: 'Fresh tax lab models contributions, QBI deductions, and Roth conversion scenarios ahead of filing season.',
  },
  {
    label: 'Retirement',
    value: 'Readiness lab',
    description: 'New glide path sandbox aligns lifestyle archetypes with safe-withdrawal coverage.',
  },
]

export default function Dashboard() {
  const {
    state: { profile, budget, goals },
    isAuthenticated,
  } = useDemoData()
  const lastBudgetSync = new Date(budget.lastReconciledAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const lastCelebration = new Date(goals.lastCelebrationAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard preview</h1>
            <p className="mt-2 text-sm text-slate-600">
              A quick snapshot of the guided experience coming soon. This placeholder illustrates the
              future layout once Supabase data is wired in.
            </p>
          </div>
          <div className="grid gap-4 text-xs text-slate-500 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold uppercase tracking-wide text-slate-400">Demo session</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{profile.fullName}</p>
              <p className="mt-1">{profile.email}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold uppercase tracking-wide text-slate-400">Plan</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{profile.planId}</p>
              <p className="mt-1">Budget sync as of {lastBudgetSync}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold uppercase tracking-wide text-slate-400">Momentum</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {isAuthenticated ? 'Demo active' : 'Signed out'}
              </p>
              <p className="mt-1">Last goal celebration {lastCelebration}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Upcoming timeline</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Supabase auth</strong> — bootstrap client, sessions, and profile table wiring.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Budget envelopes</strong> — persist envelope targets to Supabase and sync across devices.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Bank sync pilot</strong> — integrate Plaid Link sandbox and prep transaction schemas.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Debt lab persistence</strong> — store liability profiles + payoff preferences with Supabase.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Investment autopilot</strong> — sync allocation targets + contribution plans for hands-off compounding.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Protection lab persistence</strong> — store coverage assumptions, policy metadata, and Copilot gap alerts.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Estate planning lab</strong> — capture trustees, guardians, liquidity buffers, and legal document statuses.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Tax strategy lab</strong> — sync contribution tracking, quarterly payments, and Roth conversion playbooks.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Retirement readiness</strong> — persist glide path assumptions and lifestyle archetypes for decade planning.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>AI insights</strong> — connect Copilot nudges to synced transaction activity.
              </p>
            </li>
          </ul>
        </div>
        <aside className="rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold text-brand-dark">What this preview represents</h3>
          <p className="mt-2">
            This dashboard scaffold showcases the structure for authenticated experiences. Once
            Supabase and Stripe keys are in place, these widgets will hydrate with real data and
            upgrade prompts.
          </p>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <IntegrationStatus
          label="Supabase auth"
          ready={hasSupabaseConfig}
          description={
            hasSupabaseConfig
              ? 'Client booted. We can start wiring RLS policies and profile hydration next.'
              : 'Add Supabase env secrets so the dashboard cards can hydrate with live data.'
          }
          guidance={supabaseEnvGuidance}
        />
        <IntegrationStatus
          label="Stripe billing"
          ready={hasStripeConfig}
          description={
            hasStripeConfig
              ? 'Publishable key found. Checkout links can be embedded in upgrade prompts next.'
              : 'Set the Stripe publishable key to unlock upgrade CTAs and payment flows.'
          }
          guidance={stripeEnvGuidance}
        />
      </section>
    </div>
  )
}
