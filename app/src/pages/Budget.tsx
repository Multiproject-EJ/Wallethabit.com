import { type ChangeEvent, useMemo } from 'react'

import { useDemoData } from '../lib/demoDataStore'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type EnvelopeRowProps = {
  envelope: {
    id: string
    name: string
    description: string
    planned: number
    spent: number
    essentials?: boolean
  }
  onAdjust: (id: string, planned: number) => void
  onRevert: () => void
}

type SummaryItemProps = {
  label: string
  value: number
  highlight?: boolean
  positive?: boolean
}

type HeroMetricProps = {
  label: string
  value: string
  detail?: string
  tone?: 'default' | 'accent' | 'muted' | 'warning'
}

export default function Budget() {
  const {
    state: {
      budget: { envelopes, monthlyIncome, lastReconciledAt },
    },
    updateEnvelopePlanned,
    resetEnvelopePlanned,
    resetBudget,
  } = useDemoData()

  const totals = useMemo(() => {
    const planned = envelopes.reduce((sum, env) => sum + env.planned, 0)
    const spent = envelopes.reduce((sum, env) => sum + env.spent, 0)

    const essentials = envelopes.filter((env) => env.essentials)
    const essentialsPlanned = essentials.reduce((sum, env) => sum + env.planned, 0)
    const essentialsSpent = essentials.reduce((sum, env) => sum + env.spent, 0)

    return {
      planned,
      spent,
      remaining: Math.max(planned - spent, 0),
      toAssign: Math.max(monthlyIncome - planned, 0),
      essentialsPlanned,
      essentialsSpent,
    }
  }, [envelopes, monthlyIncome])

  const formattedLastReconciledAt = new Date(lastReconciledAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  const essentialsCompletion = totals.essentialsPlanned
    ? Math.min(120, Math.round((totals.essentialsSpent / totals.essentialsPlanned) * 100))
    : 0

  const plannedRatio = monthlyIncome ? Math.round((totals.planned / monthlyIncome) * 100) : 0

  const focusMessage = (() => {
    if (totals.toAssign > 0) {
      return `You still have ${currency.format(totals.toAssign)} ready to direct toward priorities.`
    }
    if (totals.spent > totals.planned) {
      return `You are ${currency.format(Math.abs(totals.planned - totals.spent))} past plan — tune a few envelopes below.`
    }
    if (totals.remaining > 0) {
      return `Beautiful buffer! ${currency.format(totals.remaining)} is still resting in envelopes.`
    }
    return 'All dollars are spoken for. Review insights to stay a step ahead.'
  })()

  const focusPrompts = totals.toAssign > 0
    ? [
        'Add fuel to your top savings goal.',
        'Boost the “Future You” reserve before lifestyle upgrades.',
        'Schedule an automatic transfer so new income lands with purpose.',
      ]
    : totals.spent > totals.planned
    ? [
        'Review essentials — can anything shift to upcoming pay period?',
        'Nudge the dining and fun envelopes down for the rest of the month.',
        'Plan a mid-month check-in with the Copilot for new ideas.',
      ]
    : [
        'Lock in your wins with a Friday review ritual.',
        'Channel leftover dollars into debt payoff or investing goals.',
        'Celebrate the streak — add a note to your progress journal.',
      ]

  return (
    <div className="flex flex-col gap-12 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary-dark via-primary to-navy text-white shadow-uplift">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-coral/30 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-8 px-8 py-12 sm:px-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
              <span className="text-base">💸</span>
              Budget Mission Control
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Direct every dollar with calm confidence
            </h1>
            <p className="text-base text-white/80">
              Realign envelopes, spotlight essentials, and feel momentum in a glance. WalletHabit saves these demo moves locally today — Supabase sync arrives next.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/60">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <span className="text-lg">🗓️</span>
                Last reconciled {formattedLastReconciledAt}
              </span>
              <button
                type="button"
                onClick={resetBudget}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold transition hover:bg-white/20"
              >
                <span>Reset demo envelopes</span>
              </button>
            </div>
          </div>

          <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
            <HeroMetric
              label="Monthly income"
              value={currency.format(monthlyIncome)}
              detail={`${plannedRatio}% aimed`}
            />
            <HeroMetric
              label="Planned this month"
              value={currency.format(totals.planned)}
              tone={totals.spent > totals.planned ? 'warning' : 'default'}
              detail={totals.spent > totals.planned ? 'Adjust below' : 'On track'}
            />
            <HeroMetric
              label="Free to assign"
              value={currency.format(totals.toAssign)}
              tone={totals.toAssign > 0 ? 'accent' : 'muted'}
              detail={totals.toAssign > 0 ? 'Ready to deploy' : 'Fully allocated'}
            />
            <HeroMetric
              label="Essentials covered"
              value={`${essentialsCompletion}%`}
              detail={
                totals.essentialsPlanned
                  ? `${currency.format(totals.essentialsSpent)} spent`
                  : 'Tag essentials to track'
              }
            />
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-navy">Active envelopes</h2>
                <p className="text-sm text-slate-500">
                  {envelopes.length} categories tuned for the month. Adjust sliders and WalletHabit will suggest shifts instantly.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                <span className="text-base">✨</span>
                {focusMessage}
              </div>
            </div>
            <div className="grid gap-4">
              {envelopes.map((envelope) => (
                <EnvelopeRow
                  key={envelope.id}
                  envelope={envelope}
                  onAdjust={updateEnvelopePlanned}
                  onRevert={() => resetEnvelopePlanned(envelope.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-navy">Monthly snapshot</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <SummaryItem label="Total planned" value={totals.planned} highlight />
              <SummaryItem label="Spent so far" value={totals.spent} />
              <SummaryItem label="Left to spend" value={totals.remaining} positive={totals.remaining > 0} />
              <SummaryItem label="Free to assign" value={totals.toAssign} positive={totals.toAssign > 0} />
            </dl>
          </div>

          <div className="rounded-3xl border border-dashed border-brand/30 bg-brand/5 p-6 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Automation landing soon</p>
            <p className="mt-3 leading-relaxed">
              Supabase sync will remember every tweak across devices. Plaid rules will auto-label envelope matches while Copilot nudges you ahead of overspending.
            </p>
            <p className="mt-3 text-xs text-brand">
              Stripe upgrades unlock historical envelope trends + bulk adjustments.
            </p>
          </div>

          <div className="rounded-3xl bg-navy px-6 py-5 text-slate-100 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand/70">Momentum playbook</p>
            <p className="mt-3 text-sm text-slate-100/90">
              Build a weekly budget ritual and let WalletHabit celebrate the streak.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200/80">
              {focusPrompts.map((prompt) => (
                <li key={prompt} className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand/80">•</span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 text-xs text-brand/80">
              <span>🔁</span>
              <span>Save your wins in the Copilot journal after each adjustment.</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

function EnvelopeRow({ envelope, onAdjust, onRevert }: EnvelopeRowProps) {
  const { id, name, description, planned, spent, essentials } = envelope
  const remaining = Math.max(planned - spent, 0)
  const usedPercentage = planned === 0 ? 0 : Math.round((spent / planned) * 100)
  const completion = Math.min(120, Math.max(usedPercentage, 0))
  const delta = planned - spent
  const statusIsPositive = delta >= 0
  const statusLabel = statusIsPositive
    ? `${currency.format(remaining)} cushion`
    : `Over by ${currency.format(Math.abs(delta))}`

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value)
    onAdjust(id, nextValue)
  }

  return (
    <div className="group rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-navy">{name}</h3>
            {essentials ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                <span className="text-sm">⭐</span>
                Essential
              </span>
            ) : null}
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                statusIsPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-coral/10 text-coral'
              }`}
            >
              {statusIsPositive ? 'On track' : 'Adjust soon'}
            </span>
          </div>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Planned</p>
          <p className="text-2xl font-semibold text-navy">{currency.format(planned)}</p>
          <button
            type="button"
            onClick={onRevert}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-brand/10 hover:text-brand"
          >
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-slider`} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Adjust monthly target
          </label>
          <input
            id={`${id}-slider`}
            type="range"
            min={spent}
            max={2000}
            step={10}
            value={planned}
            onChange={handleChange}
            className="w-full accent-brand"
          />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-sand p-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-slate-500">
              <span>Spent</span>
              <span>{currency.format(spent)}</span>
            </span>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
              statusIsPositive ? 'bg-brand/10 text-brand' : 'bg-coral/10 text-coral'
            }`}>
              <span>{statusLabel}</span>
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="h-2 w-48 overflow-hidden rounded-full bg-white">
              <div
                className={`${
                  completion > 105
                    ? 'bg-rose-500'
                    : completion >= 95
                    ? 'bg-amber-400'
                    : 'bg-primary-light'
                } h-full transition-[width] duration-200`}
                style={{ width: `${completion}%` }}
                aria-hidden
              />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{Math.max(usedPercentage, 0)}% used</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryItem({ label, value, highlight, positive }: SummaryItemProps) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-2xl border bg-white p-4 shadow-sm transition ${
        highlight ? 'border-brand/40 bg-brand/5' : 'border-slate-200'
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-2xl font-semibold text-navy">{currency.format(value)}</span>
      {positive ? <span className="text-xs font-semibold text-brand">Ready to allocate</span> : null}
    </div>
  )
}

function HeroMetric({ label, value, detail, tone = 'default' }: HeroMetricProps) {
  const toneStyles = {
    default: 'bg-white/10 text-white',
    accent: 'bg-emerald-400/20 text-white',
    muted: 'bg-white/5 text-white/80',
    warning: 'bg-coral/30 text-white',
  } as const

  return (
    <div className={`flex flex-col gap-2 rounded-2xl border border-white/20 px-4 py-5 backdrop-blur ${toneStyles[tone]}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-white/70">{label}</span>
      <span className="text-2xl font-semibold">{value}</span>
      {detail ? <span className="text-xs uppercase tracking-wide text-white/60">{detail}</span> : null}
    </div>
  )
}
