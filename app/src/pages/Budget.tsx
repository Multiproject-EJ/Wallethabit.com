import { type ChangeEvent, useMemo, useState } from 'react'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type Envelope = {
  id: string
  name: string
  description: string
  planned: number
  spent: number
  essentials?: boolean
}

const defaultEnvelopes: Envelope[] = [
  {
    id: 'housing',
    name: 'Housing',
    description: 'Rent, utilities, insurance, internet',
    planned: 1400,
    spent: 1350,
    essentials: true,
  },
  {
    id: 'food',
    name: 'Groceries & Dining',
    description: 'Weekly groceries, occasional dinners out',
    planned: 520,
    spent: 410,
    essentials: true,
  },
  {
    id: 'transport',
    name: 'Transportation',
    description: 'Gas, public transit, ride shares, maintenance',
    planned: 240,
    spent: 180,
    essentials: true,
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Gym, therapy, supplements, sports',
    planned: 160,
    spent: 95,
  },
  {
    id: 'fun',
    name: 'Fun & Experiences',
    description: 'Streaming, hobbies, travel savings, gifting',
    planned: 220,
    spent: 60,
  },
  {
    id: 'future',
    name: 'Future You',
    description: 'Emergency fund, investments, education',
    planned: 400,
    spent: 150,
  },
]

type EnvelopeDraft = Envelope & { plannedDraft: number }

export default function Budget() {
  const [envelopes, setEnvelopes] = useState<EnvelopeDraft[]>(
    defaultEnvelopes.map((envelope) => ({ ...envelope, plannedDraft: envelope.planned })),
  )

  const totals = useMemo(() => {
    const planned = envelopes.reduce((sum, env) => sum + env.plannedDraft, 0)
    const spent = envelopes.reduce((sum, env) => sum + env.spent, 0)
    return {
      planned,
      spent,
      remaining: Math.max(planned - spent, 0),
      toAssign: Math.max(4200 - planned, 0),
    }
  }, [envelopes])

  const handleAdjust = (id: string, plannedDraft: number) => {
    setEnvelopes((prev) =>
      prev.map((env) => (env.id === id ? { ...env, plannedDraft: Math.max(plannedDraft, env.spent) } : env)),
    )
  }

  const handleRevert = (id: string) => {
    const original = defaultEnvelopes.find((env) => env.id === id)
    if (!original) return
    setEnvelopes((prev) => prev.map((env) => (env.id === id ? { ...env, plannedDraft: original.planned } : env)))
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/15">💸</span>
          Monthly Envelope Plan
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Give every dollar a home you feel good about
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Adjust your envelope targets, track progress, and keep an eye on the free-to-assign dollars still waiting
          for marching orders. WalletHabit will autosave and sync these targets once Supabase is connected — for now
          you can explore the flows and dial in a plan that fits.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          {envelopes.map((envelope) => (
            <EnvelopeRow
              key={envelope.id}
              envelope={envelope}
              onAdjust={handleAdjust}
              onRevert={() => handleRevert(envelope.id)}
            />
          ))}
        </div>

        <aside className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Monthly Snapshot</h2>
          <dl className="space-y-4 text-sm">
            <SummaryItem label="Total Planned" value={totals.planned} highlight />
            <SummaryItem label="Spent So Far" value={totals.spent} />
            <SummaryItem label="Left to Spend" value={totals.remaining} positive />
            <SummaryItem label="Free to Assign" value={totals.toAssign} positive={totals.toAssign > 0} />
          </dl>
          <div className="rounded-xl border border-dashed border-brand/40 bg-brand/5 p-4 text-xs text-slate-600">
            <p className="font-medium text-brand">Automation coming soon</p>
            <p className="mt-2 leading-relaxed">
              Once Supabase is live, WalletHabit will remember your envelope choices, alert you when you overspend, and
              surface savings insights right here. Stripe upgrades will unlock multi-month trend views.
            </p>
          </div>
          <div className="rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
            <p className="font-semibold tracking-wide text-brand/80">Momentum tip</p>
            <p className="mt-2 text-slate-200">
              Keep $500 buffered in “Future You.” If envelopes dip, top them up before adding new spending goals.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

type EnvelopeRowProps = {
  envelope: EnvelopeDraft
  onAdjust: (id: string, plannedDraft: number) => void
  onRevert: () => void
}

function EnvelopeRow({ envelope, onAdjust, onRevert }: EnvelopeRowProps) {
  const { id, name, description, plannedDraft, spent, essentials } = envelope
  const remaining = Math.max(plannedDraft - spent, 0)
  const completion = plannedDraft === 0 ? 0 : Math.min(100, Math.round((spent / plannedDraft) * 100))

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value)
    onAdjust(id, nextValue)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
            {essentials ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                Essential
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <div className="flex flex-col items-start gap-1 text-right sm:items-end">
          <p className="text-sm font-medium text-slate-500">Planned</p>
          <p className="text-2xl font-semibold text-slate-900">{currency.format(plannedDraft)}</p>
          <button
            type="button"
            onClick={onRevert}
            className="text-xs font-medium text-brand transition hover:text-brand/80"
          >
            Reset to default
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
            value={plannedDraft}
            onChange={handleChange}
            className="w-full accent-brand"
          />
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-slate-100 p-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Spent {currency.format(spent)}
            </span>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              Remaining {currency.format(remaining)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-slate-500">
            <div className="h-2 w-28 overflow-hidden rounded-full bg-white">
              <div className="h-full bg-brand" style={{ width: `${completion}%` }} aria-hidden />
            </div>
            {completion}% used
          </div>
        </div>
      </div>
    </div>
  )
}

type SummaryItemProps = {
  label: string
  value: number
  highlight?: boolean
  positive?: boolean
}

function SummaryItem({ label, value, highlight, positive }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={[
          'font-semibold',
          highlight ? 'text-slate-900 text-base' : 'text-slate-800',
          positive ? 'text-emerald-600' : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {currency.format(value)}
      </dd>
    </div>
  )
}
