import { useMemo, useState } from 'react'

import { useDemoData } from '../lib/demoDataStore'

type SampleDebt = {
  creditor: string
  balance: number
  rate: number
  min: number
}

const sampleDebts: SampleDebt[] = [
  { creditor: 'Amex Credit Card', balance: 2400, rate: 19.9, min: 60 },
  { creditor: 'Student Loan Plan 2', balance: 12800, rate: 4.2, min: 110 },
]

const accelerationOptions = [
  { value: 0, label: 'Minimums only' },
  { value: 60, label: 'Focus boost' },
  { value: 120, label: 'Momentum push' },
  { value: 200, label: 'Sprint finish' },
]

const playbooks = [
  {
    id: 'snowball',
    name: 'Snowball',
    headline: 'Motivation first',
    description:
      'Clear the Amex balance for an early win, then redirect that freed cash toward the student loan momentum.',
    bestFor: 'When the psychological lift of early victories matters most.',
    base: { months: 26, interest: 1980 },
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    headline: 'Math optimised',
    description: 'Lead with the highest APR card, then cruise through lower-interest balances to minimise total interest.',
    bestFor: 'When you are laser-focused on interest savings and have strong intrinsic motivation.',
    base: { months: 24, interest: 1720 },
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    headline: 'Balanced momentum',
    description: 'Snag the quick Amex win, then pivot to the student loan for the best of both motivation and maths.',
    bestFor: 'When you want tangible momentum plus meaningful interest savings.',
    base: { months: 25, interest: 1840 },
  },
]

const readinessChecklist = [
  'Document balances, APRs, and minimums for every liability.',
  'Align on target payoff date and guardrails for emergency savings.',
  'Set up Direct Debits so minimums run automatically.',
  'Schedule a monthly “debt retro” to review progress and adjust boosts.',
]

const momentumSignals = [
  'Total interest saved versus baseline plan.',
  'Projected debt-free date relative to your goal.',
  'Number of accounts closed in the past 90 days.',
  'Emergency fund runway maintained while paying down balances.',
]

const celebrationIdeas = [
  'Mark each account closed with a journal entry and a calm celebration ritual.',
  'Share a monthly “momentum snapshot” with your accountability partner or coach.',
  'Redirect the final minimum payment into a savings or investing automation.',
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

type HeroStatProps = {
  label: string
  value: string
  detail?: string
  tone?: 'default' | 'accent' | 'warning'
}

function HeroStat({ label, value, detail, tone = 'default' }: HeroStatProps) {
  const toneClasses = {
    default: 'bg-white/10 text-white',
    accent: 'bg-coral/20 text-white',
    warning: 'bg-gold/20 text-midnight',
  } as const

  return (
    <div className="rounded-2xl border border-white/20 p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {detail ? (
        <span
          className={[
            'mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
            toneClasses[tone],
          ].join(' ')}
        >
          {detail}
        </span>
      ) : null}
    </div>
  )
}

function computeProjection(baseMonths: number, baseInterest: number, boost: number) {
  const monthImprovement = Math.min(baseMonths - 10, Math.floor(boost / 45))
  const interestImprovement = Math.min(baseInterest * 0.6, Math.round(boost * 6.2))

  return {
    months: Math.max(10, baseMonths - monthImprovement),
    interest: Math.max(Math.round(baseInterest - interestImprovement), Math.round(baseInterest * 0.35)),
  }
}

export default function Debt() {
  const {
    state: { profile },
  } = useDemoData()

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(profile.localeId, {
        style: 'currency',
        currency: profile.currency,
        maximumFractionDigits: 0,
      }),
    [profile.currency, profile.localeId],
  )

  const [selectedBoost, setSelectedBoost] = useState(accelerationOptions[1].value)
  const [activePlaybook, setActivePlaybook] = useState<PlaybookId>('hybrid')

  const selectedBoostOption = useMemo(() => {
    return accelerationOptions.find((option) => option.value === selectedBoost) ?? accelerationOptions[0]
  }, [selectedBoost])

  const selectedBoostLabel = selectedBoostOption.label
  const selectedBoostSummary = selectedBoostOption.value
    ? `${selectedBoostLabel} · ${currencyFormatter.format(selectedBoostOption.value)}/mo`
    : selectedBoostLabel

  const totals = useMemo(() => {
    const totalBalance = sampleDebts.reduce((sum, debt) => sum + debt.balance, 0)
    const totalMinimums = sampleDebts.reduce((sum, debt) => sum + debt.min, 0)
    const highestBalance = sampleDebts.reduce((max, debt) => Math.max(max, debt.balance), 0)
    const highestRateDebt = sampleDebts.reduce((highest, debt) => (debt.rate > highest.rate ? debt : highest), sampleDebts[0])
    const weightedApr = totalBalance
      ? sampleDebts.reduce((sum, debt) => sum + debt.balance * debt.rate, 0) / totalBalance
      : 0

    return { totalBalance, totalMinimums, highestBalance, highestRateDebt, weightedApr }
  }, [])

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

  const activePlan = useMemo(() => projection.find((plan) => plan.id === activePlaybook) ?? projection[0], [
    activePlaybook,
    projection,
  ])

  const focusPrompts = useMemo(() => {
    if (!activePlan) return [] as string[]

    if (selectedBoost === 0) {
      return [
        `Review last month's Monzo feed to uncover ${currencyFormatter.format(50)} you can redirect next month.`,
        `Sweep any freelance wins straight into ${activePlan.name.toLowerCase()} momentum the day they land.`,
        'Let Copilot reminders keep every direct debit covered so minimums never slip.',
      ]
    }

    if (selectedBoost >= 200) {
      return [
        'Lock in an automatic transfer so the sprint boost happens without friction.',
        'Celebrate each cleared milestone with a ritual that keeps morale high.',
        `Guard your emergency fund — ${activePlan.outcome.months} months is within reach.`,
      ]
    }

    const formattedBoost = currencyFormatter.format(selectedBoost)
    const interestSavings = activePlan.interestDelta > 0 ? currencyFormatter.format(activePlan.interestDelta) : null

    return [
      `Redirect the ${formattedBoost} boost from low-joy spending into the ${activePlan.name.toLowerCase()} plan.`,
      interestSavings
        ? `That pace keeps roughly ${interestSavings} in interest out of the bank's hands.`
        : 'Keep the boost steady so momentum compounds month over month.',
      `Stay mindful of ${totals.highestRateDebt.creditor}'s ${totals.highestRateDebt.rate}% APR when deciding the next focus.`,
    ]
  }, [activePlan, currencyFormatter, selectedBoost, totals.highestRateDebt])

  return (
    <div className="flex flex-col gap-12 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary-dark via-primary to-navy text-white shadow-uplift">
        <div className="pointer-events-none absolute -left-32 top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-coral/30 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-8 px-8 py-12 sm:px-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em]">
              <span className="text-lg">⚡</span>
              Debt Freedom Lab
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Design your debt-free countdown</h1>
            <p className="text-base text-white/80">
              Model snowball, avalanche, and hybrid acceleration boosts. WalletHabit will sync live liabilities through
              Plaid next, so every tweak you make here becomes a confident automation in the real product.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <span className="text-lg">🛣️</span>
                {activePlan?.outcome.months ?? 0} month horizon · {selectedBoostSummary}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <span className="text-lg">🎯</span>
                {activePlan?.interestDelta
                  ? `≈${currencyFormatter.format(activePlan.interestDelta)} interest saved`
                  : 'Baseline interest'}
              </span>
            </div>
          </div>

          <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
            <HeroStat
              label="Debt load"
              value={currencyFormatter.format(totals.totalBalance)}
              detail={`${sampleDebts.length} accounts · ${totals.weightedApr.toFixed(1)}% APR blend`}
            />
            <HeroStat
              label="Active strategy"
              value={activePlan?.name ?? 'Snowball'}
              detail={`${activePlan?.outcome.months ?? 0} month path`}
              tone="accent"
            />
            <HeroStat
              label="Boost applied"
              value={selectedBoost ? `+${currencyFormatter.format(selectedBoost)}/mo` : 'Minimums only'}
              detail={selectedBoost ? 'Automate this through Monzo' : 'Explore new boost ideas'}
              tone={selectedBoost ? 'default' : 'warning'}
            />
            <HeroStat
              label="Minimums"
              value={currencyFormatter.format(totals.totalMinimums)}
              detail="Currently automated"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.7fr,1.3fr]">
        <article className="flex flex-col gap-8 rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">Acceleration lab</h2>
            <p className="text-sm text-slate-600">
              Choose a monthly boost and explore how each playbook shifts your debt-free date. Soon, Supabase persistence
              will remember your selection so Copilot can keep nudging momentum in-app.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-sand p-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Select payoff boost">
              {accelerationOptions.map((option) => {
                const optionLabel =
                  option.value > 0
                    ? `${option.label} · ${currencyFormatter.format(option.value)}/mo`
                    : option.label

                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedBoost(option.value)}
                    type="button"
                    className={[
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                      selectedBoost === option.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-primary/10 hover:text-primary',
                    ].join(' ')}
                    aria-pressed={selectedBoost === option.value}
                  >
                    {optionLabel}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-white/80 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">
                {selectedBoost ? `${selectedBoostSummary} in play` : 'Minimums only selected'}
              </p>
              <p>
                {selectedBoost
                  ? 'Every extra pound you route is immediately re-applied to the active plan below.'
                  : 'Add a boost to see the timeline shrink and interest savings appear in real time.'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {projection.map((plan) => {
              const isActive = activePlaybook === plan.id
              const interestCallout =
                plan.interestDelta > 0 ? `−${currencyFormatter.format(plan.interestDelta)}` : 'Baseline interest'
              const timelineCallout = plan.monthDelta > 0 ? `${plan.monthDelta} months faster` : 'Same timeline'

              return (
                <button
                  key={plan.id}
                  onClick={() => setActivePlaybook(plan.id)}
                  type="button"
                  className={[
                    'group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border p-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isActive
                      ? 'border-primary bg-gradient-to-br from-primary/15 via-white to-white shadow-lg'
                      : 'border-slate-200 bg-white hover:border-primary/40 hover:shadow-md',
                  ].join(' ')}
                  aria-pressed={isActive}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-coral to-gold opacity-0 transition-opacity duration-200 group-aria-pressed:opacity-100" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{plan.name}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{plan.headline}</h3>
                    <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                  </div>
                  <div className="mt-auto space-y-2 rounded-xl border border-slate-200/70 bg-white/70 p-3 text-xs text-slate-500">
                    <p className="font-semibold text-slate-900">
                      {plan.outcome.months} month path · {timelineCallout}
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Interest projection</span>
                      <span className={['font-semibold', plan.interestDelta > 0 ? 'text-primary' : 'text-slate-400'].join(' ')}>
                        {plan.interestDelta > 0 ? interestCallout : 'Match baseline'}
                      </span>
                    </p>
                    <p>
                      Keeps you {plan.monthDelta > 0 ? `${plan.monthDelta} months` : 'on pace'} ahead of minimums.
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {activePlan ? (
            <div className="grid gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-6 text-sm text-primary">
              <div className="flex flex-col gap-2 text-primary-dark">
                <p className="text-xs font-semibold uppercase tracking-[0.3em]">{activePlan.name} spotlight</p>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedBoost ? 'This is your current payoff runway' : 'Add a boost to ignite this playbook'}
                </h3>
                <p className="text-slate-600">
                  With <span className="font-semibold text-primary-dark">{selectedBoostSummary}</span>, you are pacing to
                  become debt-free in <span className="font-semibold text-primary-dark">{activePlan.outcome.months} months</span>.
                  {activePlan.monthDelta > 0 ? (
                    <>
                      {' '}That is roughly <span className="font-semibold text-primary-dark">{activePlan.monthDelta} months</span> faster than
                      minimums alone.
                    </>
                  ) : (
                    <> Stay consistent until you can unlock a boost.</>
                  )}{' '}
                  Interest savings land near{' '}
                  {activePlan.interestDelta > 0 ? (
                    <span className="font-semibold text-primary-dark">{currencyFormatter.format(activePlan.interestDelta)}</span>
                  ) : (
                    <span className="font-semibold text-primary-dark">baseline levels</span>
                  )}{' '}
                  by the time the countdown finishes.
                </p>
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                {focusPrompts.map((prompt) => (
                  <div key={prompt} className="rounded-2xl border border-primary/20 bg-white/80 p-4 text-slate-600">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">Momentum move</p>
                    <p className="mt-2 text-sm">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <aside className="flex flex-col gap-6 rounded-3xl border border-primary/20 bg-gradient-to-b from-white via-sand to-white p-8 shadow-sm">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Current liabilities snapshot</h3>
            <ul className="mt-4 space-y-4">
              {sampleDebts.map((debt) => (
                <li key={debt.creditor} className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{debt.creditor}</p>
                      <p className="mt-1 text-xs text-slate-500">APR {debt.rate}% · Minimum {currencyFormatter.format(debt.min)}</p>
                    </div>
                    {debt.rate >= totals.highestRateDebt.rate ? (
                      <span className="rounded-full bg-coral/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-coral">
                        Highest APR
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Balance</span>
                    <span className="font-semibold text-slate-900">{currencyFormatter.format(debt.balance)}</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-sand-darker/60">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.max(12, Math.round((debt.balance / totals.highestBalance) * 100))}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-white/80 p-5 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Coming soon</p>
            <p className="mt-2">
              Once Plaid liability endpoints are connected, these cards will hydrate automatically and unlock real
              amortisation tables, celebratory confetti when balances close, and Copilot accountability nudges.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Readiness checklist</h2>
          <p className="mt-2 text-sm text-slate-600">
            Step through these foundations to make the most of WalletHabit&apos;s debt payoff workflows.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary"></span>
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
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gold"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Celebrate the wins</h2>
          <p className="mt-2 text-sm text-slate-600">
            Build emotional momentum so every milestone feels like progress, not pressure.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            {celebrationIdeas.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-coral"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Rollout milestones</h2>
          <p className="mt-2 text-sm text-slate-600">
            Here&apos;s how the live debt lab ships across four focused sprints.
          </p>
          <ol className="mt-4 space-y-4">
            {rolloutMilestones.map((milestone, index) => (
              <li key={milestone.label} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-sand p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="space-y-1 text-sm text-slate-600">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{milestone.timeframe}</p>
                  <p className="text-base font-semibold text-slate-900">{milestone.label}</p>
                  <p>{milestone.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>
        <aside className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 text-sm text-primary">
          <div>
            <h3 className="text-base font-semibold text-primary-dark">What&apos;s shipping with this lab</h3>
            <p className="mt-2 text-slate-600">
              Supabase tables for debts and payments, Copilot scripts for accountability, and budgeting envelope hooks to
              keep minimums funded while you focus on high-impact payoffs.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-white/70 p-4 text-xs text-slate-600">
            <p className="font-semibold uppercase tracking-[0.3em] text-primary">Developer note</p>
            <p className="mt-2">
              Payoff calculations will be handled via Supabase Edge Functions so we can keep amortisation schedules in sync
              with live transactions and send celebratory webhooks when debts close out.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}
