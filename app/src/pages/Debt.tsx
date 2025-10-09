import { useMemo, useState } from 'react'

const sampleDebts = [
  { creditor: 'Chase Freedom', balance: 4200, rate: 21.4, min: 125 },
  { creditor: 'Student loan', balance: 12350, rate: 5.9, min: 160 },
  { creditor: 'Car loan', balance: 8600, rate: 3.1, min: 240 },
]

const accelerationOptions = [
  { value: 0, label: 'Minimums only' },
  { value: 100, label: '+$100 momentum' },
  { value: 200, label: '+$200 stretch' },
  { value: 350, label: '+$350 aggressive' },
]

const playbooks = [
  {
    id: 'snowball',
    name: 'Snowball',
    headline: 'Motivation first',
    description:
      'Target the smallest balances to notch quick wins, free payments, and build momentum.',
    bestFor: 'When you need early psychological wins to stay consistent.',
    base: { months: 26, interest: 1850 },
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    headline: 'Math optimised',
    description: 'Attack the highest interest rates to minimise total interest paid.',
    bestFor: 'When the motivation is baked in and interest savings matter most.',
    base: { months: 24, interest: 1600 },
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    headline: 'Balance motivation + math',
    description: 'Open with a small win, then pivot to highest APRs to accelerate payoff.',
    bestFor: 'When you want the spark of momentum plus meaningful interest savings.',
    base: { months: 25, interest: 1700 },
  },
]

const readinessChecklist = [
  'Document balances, APRs, and minimums for every liability.',
  'Align on target payoff date and guardrails for emergency savings.',
  'Automate minimums through your bank to avoid missed payments.',
  'Schedule a monthly “debt retro” to review progress and adjust boosts.',
]

const momentumSignals = [
  'Total interest saved versus baseline plan.',
  'Projected debt-free date relative to your goal.',
  'Number of accounts closed in the past 90 days.',
  'Emergency fund runway maintained while paying down balances.',
]

const rolloutMilestones = [
  {
    label: 'Debt table schema',
    timeframe: 'Week 1',
    description: 'Model `debts`, `payments`, and payoff projections in Supabase.',
  },
  {
    label: 'Planner persistence',
    timeframe: 'Week 2',
    description: 'Write envelope + payoff strategy choices back to profiles.',
  },
  {
    label: 'AI insights beta',
    timeframe: 'Week 3',
    description: 'Feed Copilot with payoff momentum triggers and celebratory nudges.',
  },
  {
    label: 'Bank sync enrichment',
    timeframe: 'Week 4',
    description: 'Map Plaid liabilities + transactions to live payoff tracking widgets.',
  },
]

type PlaybookId = (typeof playbooks)[number]['id']

function computeProjection(baseMonths: number, baseInterest: number, boost: number) {
  const monthImprovement = Math.min(baseMonths - 10, Math.floor(boost / 45))
  const interestImprovement = Math.min(baseInterest * 0.6, Math.round(boost * 6.2))

  return {
    months: Math.max(10, baseMonths - monthImprovement),
    interest: Math.max(Math.round(baseInterest - interestImprovement), Math.round(baseInterest * 0.35)),
  }
}

export default function Debt() {
  const [selectedBoost, setSelectedBoost] = useState(accelerationOptions[1].value)
  const [activePlaybook, setActivePlaybook] = useState<PlaybookId>('hybrid')

  const selectedBoostLabel = useMemo(() => {
    return (
      accelerationOptions.find((option) => option.value === selectedBoost)?.label ||
      accelerationOptions[0].label
    )
  }, [selectedBoost])

  const projection = useMemo(() => {
    return playbooks.map((playbook) => {
      const outcome = computeProjection(playbook.base.months, playbook.base.interest, selectedBoost)
      const monthDelta = playbook.base.months - outcome.months
      const interestDelta = playbook.base.interest - outcome.interest

      return {
        ...playbook,
        outcome,
        monthDelta,
        interestDelta,
      }
    })
  }, [selectedBoost])

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-brand">Debt freedom lab</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Craft your payoff runway</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          Model snowball, avalanche, and hybrid strategies before live data arrives. WalletHabit will pull in
          liabilities via Plaid and map them to this planner so you can experiment, commit, and celebrate becoming
          debt-free.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand">
          <span className="inline-flex h-2 w-2 rounded-full bg-brand"></span>
          Interactive sandbox — Supabase persistence coming soon
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.7fr,1.3fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Simulate acceleration boosts</h2>
            <p className="text-sm text-slate-600">
              Choose an extra monthly boost to preview how the payoff timeline shifts across strategies. We&apos;ll
              persist your selection once Supabase credentials are connected.
            </p>
            <div className="flex flex-wrap gap-2">
              {accelerationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedBoost(option.value)}
                  className={[
                    'rounded-full border px-4 py-2 text-xs font-semibold transition',
                    selectedBoost === option.value
                      ? 'border-brand bg-brand text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {projection.map((plan) => {
              const isActive = activePlaybook === plan.id
              const interestCallout = plan.interestDelta > 0
                ? `−$${plan.interestDelta.toLocaleString()}`
                : 'Baseline interest'
              const timelineCallout = plan.monthDelta > 0 ? `${plan.monthDelta} months faster` : 'Same timeline'

              return (
                <button
                  key={plan.id}
                  onClick={() => setActivePlaybook(plan.id)}
                  className={[
                    'flex h-full flex-col gap-3 rounded-2xl border p-4 text-left transition',
                    isActive
                      ? 'border-brand bg-brand/10'
                      : 'border-slate-200 bg-slate-50 hover:border-brand/40 hover:bg-white',
                  ].join(' ')}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{plan.name}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{plan.headline}</h3>
                    <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                  </div>
                  <div className="mt-auto rounded-xl border border-slate-200 bg-white/70 p-3 text-xs text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-900">{plan.outcome.months} months</span> to debt-free
                    </p>
                    <p className="mt-1">
                      ${plan.outcome.interest.toLocaleString()} interest
                      <span
                        className={[
                          'ml-1 font-semibold',
                          plan.interestDelta > 0 ? 'text-brand' : 'text-slate-400',
                        ].join(' ')}
                      >
                        ({interestCallout})
                      </span>
                    </p>
                    <p className={['mt-1 font-semibold', plan.monthDelta > 0 ? 'text-brand' : 'text-slate-400'].join(' ')}>
                      {timelineCallout}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {projection
              .filter((plan) => plan.id === activePlaybook)
              .map((plan) => (
                <div key={plan.id} className="space-y-2">
                  <p className="font-semibold text-slate-900">{plan.name} spotlight</p>
                  <p>{plan.bestFor}</p>
                  <p>
                    With <span className="font-semibold text-brand">{selectedBoostLabel.toLowerCase()}</span>, you&apos;ll{' '}
                    {plan.monthDelta > 0 ? (
                      <>
                        close the gap roughly{' '}
                        <span className="font-semibold text-brand">{plan.monthDelta} months</span> faster
                      </>
                    ) : (
                      <>stay on the same payoff timeline</>
                    )}{' '}
                    and{' '}
                    {plan.interestDelta > 0 ? (
                      <>
                        keep about{' '}
                        <span className="font-semibold text-brand">${plan.interestDelta.toLocaleString()}</span>
                      </>
                    ) : (
                      <>match the baseline interest outlay</>
                    )}
                    {' '}in your pocket versus minimums.
                  </p>
                </div>
              ))}
          </div>
        </article>

        <aside className="flex flex-col gap-5 rounded-3xl border border-brand/40 bg-brand/5 p-6 text-sm text-brand-dark">
          <div>
            <h3 className="text-base font-semibold text-brand-dark">Current liabilities snapshot</h3>
            <ul className="mt-3 space-y-3">
              {sampleDebts.map((debt) => (
                <li key={debt.creditor} className="rounded-2xl border border-brand/20 bg-white/60 p-4 text-xs text-slate-600">
                  <p className="text-sm font-semibold text-slate-900">{debt.creditor}</p>
                  <p className="mt-1">Balance: ${debt.balance.toLocaleString()}</p>
                  <p className="mt-1">APR: {debt.rate}% · Minimum: ${debt.min}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand/30 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Coming soon</p>
            <p className="mt-2 text-xs text-slate-600">
              Once Plaid liability endpoints are connected, these cards will hydrate automatically and unlock real
              amortisation tables + payoff reminders.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Readiness checklist</h2>
          <p className="mt-2 text-sm text-slate-600">
            Step through these foundations to make the most of WalletHabit&apos;s debt payoff workflows.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Momentum signals to watch</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track these metrics each month to stay confident you&apos;re trending toward debt freedom without sacrificing
            resilience.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            {momentumSignals.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Rollout milestones</h2>
          <ul className="mt-4 space-y-4">
            {rolloutMilestones.map((milestone) => (
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
            <h3 className="text-base font-semibold">What&apos;s shipping with this lab</h3>
            <p className="mt-2">
              Supabase tables for debts and payments, Copilot scripts for accountability, and budgeting envelope
              hooks to keep minimums funded while you focus on high-impact payoffs.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/30 bg-white/60 p-4 text-xs text-slate-600">
            <p className="font-semibold uppercase tracking-wide text-brand">Developer note</p>
            <p className="mt-2">
              Payoff calculations will be handled via Supabase Edge Functions so we can keep amortisation schedules in
              sync with live transactions and send celebratory webhooks when debts close out.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
