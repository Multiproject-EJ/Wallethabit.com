import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useDemoData } from '../lib/demoDataStore'

const premiumUpsells = [
  {
    name: 'Auto-sync',
    detail: 'Connect banks and let WalletHabit reconcile daily.',
  },
  {
    name: 'AI copilot',
    detail: 'Personalised prompts and planning sessions in chat.',
  },
]

export default function UpdateHub() {
  const {
    state: { budget, goals, profile },
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

  const totalSpent = budget.envelopes.reduce((acc, envelope) => acc + envelope.spent, 0)
  const surplus = Math.max(0, budget.monthlyIncome - totalSpent)
  const overspentEnvelopes = budget.envelopes
    .filter((envelope) => envelope.spent > envelope.planned)
    .sort((a, b) => b.spent - b.planned - (a.spent - a.planned))
    .slice(0, 2)
  const mindfulEnvelopes = budget.envelopes
    .filter((envelope) => envelope.spent <= envelope.planned)
    .sort((a, b) => a.planned - a.spent - (b.planned - b.spent))
    .slice(0, 1)

  const goalsWithProgress = goals.items.map((goal) => {
    const progress = goal.target ? Math.min(1, goal.saved / goal.target) : 0
    return {
      goal,
      progress,
      formattedSaved: currencyFormatter.format(goal.saved),
      formattedTarget: currencyFormatter.format(goal.target),
    }
  })

  const focusHabits = profile.focusHabits.length ? profile.focusHabits : ['Pick habits in setup']

  const moduleGroups = [
    {
      title: 'Cash',
      description: 'Keep spending aligned with your rhythm.',
      modules: [
        overspentEnvelopes[0]
          ? {
              name: overspentEnvelopes[0].name,
              status: `${currencyFormatter.format(overspentEnvelopes[0].spent - overspentEnvelopes[0].planned)} over plan`,
              cta: 'Rebalance envelope',
            }
          : {
              name: 'Reconcile envelopes',
              status: 'Everything on track',
              cta: 'Open envelopes',
            },
        overspentEnvelopes[1]
          ? {
              name: overspentEnvelopes[1].name,
              status: `${currencyFormatter.format(overspentEnvelopes[1].spent - overspentEnvelopes[1].planned)} to smooth out`,
              cta: 'Adjust plan',
            }
          : surplus > 0
            ? {
                name: 'Route surplus',
                status: `${currencyFormatter.format(surplus)} ready to allocate`,
                cta: 'Assign surplus',
              }
            : mindfulEnvelopes[0]
              ? {
                  name: mindfulEnvelopes[0].name,
                  status: `${currencyFormatter.format(mindfulEnvelopes[0].planned - mindfulEnvelopes[0].spent)} spare`,
                  cta: 'Redirect surplus',
                }
              : {
                  name: 'Log transaction',
                  status: 'No new receipts',
                  cta: 'Add now',
                },
      ],
    },
    {
      title: 'Goals',
      description: 'Celebrate milestones and adjust commitments.',
      modules: goalsWithProgress.slice(0, 2).map(({ goal, progress, formattedSaved, formattedTarget }) => ({
        name: goal.name,
        status: `${Math.round(progress * 100)}% funded · ${formattedSaved} of ${formattedTarget}`,
        cta: progress >= 1 ? 'Celebrate win' : 'Update transfer',
      })),
    },
    {
      title: 'Habits & nudges',
      description: 'Stay accountable to the focus habits you chose.',
      modules: [
        {
          name: focusHabits[0],
          status: `${profile.reminderCadence} check-ins active`,
          cta: 'View next nudge',
        },
        {
          name: focusHabits[1] ?? 'Add a second habit',
          status: profile.focusHabits.length >= 2 ? `${profile.celebrationStyle} celebrations ready` : 'Pick one more habit',
          cta: profile.focusHabits.length >= 2 ? 'Plan celebration' : 'Open setup',
        },
      ],
    },
  ]

  if (moduleGroups[1].modules.length < 2) {
    moduleGroups[1].modules.push({
      name: 'Add another goal',
      status: 'No additional goals yet',
      cta: 'Create goal card',
    })
  }

  const quickFilters = ['All', 'Cash', 'Goals', 'Habits', ...profile.focusHabits]

  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm sm:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Update hub
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
              Every action card in one calm grid.
            </h1>
            <p className="text-lg text-navy/70">
              When you are ready to make a change, land here. Modules match your focus habits and stay lightweight so you can log
              updates without leaving flow.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                to="/dashboard"
                className="rounded-full bg-primary px-5 py-2.5 text-white shadow-sm transition hover:bg-primary-dark"
              >
                Back to dashboard
              </Link>
              <button
                type="button"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-navy transition hover:border-primary/60 hover:text-primary"
              >
                Command palette (⌘K)
              </button>
            </div>
          </div>
          <div className="grid w-full max-w-md gap-4 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-sm text-navy/80">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Focus filters</h2>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
                >
                  {filter}
                </button>
              ))}
            </div>
            <p className="text-xs text-navy/60">Filters mirror your setup choices so you can open the right module without searching.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {moduleGroups.map((group) => (
          <article key={group.title} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-navy">{group.title}</h2>
              <p className="text-sm text-navy/70">{group.description}</p>
            </div>
            <ul className="space-y-3 text-sm text-navy/80">
              {group.modules.map((module) => (
                <li key={module.name} className="rounded-2xl border border-slate-100 bg-sand p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-navy/60">
                    <span>{module.name}</span>
                    <span>{module.status}</span>
                  </div>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
                  >
                    {module.cta}
                  </button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-dashed border-primary/40 bg-gradient-to-br from-white via-primary/5 to-primary/10 p-8 text-sm text-navy/80">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-navy">Premium boosts when you are ready</h2>
            <p className="text-sm text-navy/70">
              WalletHabit stays honest — upgrades appear only when they unlock clear value for your habits.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {premiumUpsells.map((offer) => (
              <div key={offer.name} className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-primary">{offer.name}</p>
                <p className="mt-1 text-xs text-navy/70">{offer.detail}</p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary transition hover:text-primary-dark"
                >
                  Learn more →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
