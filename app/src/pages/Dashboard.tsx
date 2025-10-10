import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useDemoData } from '../lib/demoDataStore'

const habitScoreHistory = [72, 78, 81, 84]

const recentActivity = [
  {
    title: 'Logged rent payment',
    description: '£1,450 applied to Home base envelope',
    timestamp: 'Today · 8:32',
  },
  {
    title: 'Savings transfer scheduled',
    description: '£250 to Emergency fund for Friday',
    timestamp: 'Yesterday · 19:05',
  },
  {
    title: 'Celebrated Mallorca milestone',
    description: 'Holiday savings hit 50% funded — confetti sent 🎉',
    timestamp: 'Sun · 09:12',
  },
]

const smartNudges = [
  {
    label: 'Rebalance envelopes',
    detail: 'Groceries trending £12 above plan',
  },
  {
    label: 'Boost emergency fund',
    detail: 'You are 75% to your target — finish this month?',
  },
  {
    label: 'Log side income',
    detail: 'Remember to add Saturday’s freelance invoice',
  },
]

export default function Dashboard() {
  const {
    state: { profile, budget, goals },
    isAuthenticated,
  } = useDemoData()

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(profile.localeId, {
        style: 'currency',
        currency: profile.currency,
        maximumFractionDigits: 0,
      }),
    [profile.currency, profile.localeId],
  )

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(profile.localeId, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [profile.localeId],
  )

  const monthlyExpenses = budget.envelopes.reduce((total, envelope) => total + envelope.spent, 0)
  const savings = budget.monthlyIncome - monthlyExpenses
  const savingsRate = budget.monthlyIncome ? savings / budget.monthlyIncome : 0

  const topGoals = goals.items.slice(0, 2)

  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <header className="rounded-[32px] border border-slate-200 bg-gradient-to-r from-primary-dark via-primary to-primary-light px-8 py-10 text-white shadow-uplift">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">Dashboard</p>
            <h1 className="text-4xl font-semibold tracking-tight">Hi {profile.fullName.split(' ')[0]}, here is your calm money pulse.</h1>
            <p className="max-w-xl text-sm text-white/80">
              Your habit score, cash flow, and key goals stay centre stage. Update anything in one tap from the hub — WalletHabit
              keeps the rest in sync.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                to="/update"
                className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-primary transition hover:bg-white"
              >
                <span>＋</span>
                Open Update hub
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-white transition hover:bg-white/20"
              >
                <span>✨</span>
                Set focus habit
              </button>
            </div>
          </div>
          <div className="grid w-full max-w-md gap-4 rounded-3xl bg-white/10 p-6 text-left text-sm">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-white/70">Habit score</p>
              <p className="mt-2 text-3xl font-semibold">{habitScoreHistory[habitScoreHistory.length - 1]}</p>
              <p className="mt-1 text-xs text-emerald-200">{percentFormatter.format(0.06)} vs last month</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-white/70">Savings this month</p>
              <p className="mt-2 text-3xl font-semibold">{numberFormatter.format(savings)}</p>
              <p className="mt-1 text-xs text-emerald-200">{percentFormatter.format(savingsRate)} of income</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-white/70">Session</p>
              <p className="mt-2 text-3xl font-semibold">{isAuthenticated ? 'Active' : 'Signed out'}</p>
              <p className="mt-1 text-xs text-white/70">Last celebration {new Date(goals.lastCelebrationAt).toLocaleDateString(profile.localeId, {
                month: 'short',
                day: 'numeric',
              })}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Cash flow pulse</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Live</span>
          </div>
          <p className="text-sm text-navy/70">Income vs. spending this month.</p>
          <div className="space-y-3 text-sm text-navy/80">
            <div className="flex items-center justify-between">
              <span>Income</span>
              <span className="font-semibold text-primary">{numberFormatter.format(budget.monthlyIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Spending</span>
              <span className="font-semibold text-coral">{numberFormatter.format(monthlyExpenses)}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-sand-darker/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                style={{ width: `${Math.min(100, (monthlyExpenses / budget.monthlyIncome) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-navy/60">
              You are tracking a surplus of {numberFormatter.format(savings)}. Route it to your priority goals or stash it for
              upcoming bills.
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Goal momentum</h2>
            <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold/80">In progress</span>
          </div>
          <ul className="space-y-4 text-sm text-navy/80">
            {topGoals.map((goal) => {
              const progress = goal.target ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0
              return (
                <li key={goal.id} className="rounded-2xl border border-slate-100 bg-sand p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-navy/60">
                    <span>{goal.priority} priority</span>
                    <span>{goal.dueLabel}</span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-navy">{goal.name}</p>
                  <p className="mt-1 text-sm text-navy/70">{goal.description}</p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/70">
                    <div className="h-full rounded-full bg-gradient-to-r from-gold to-primary-light" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-navy/60">
                    {numberFormatter.format(goal.saved)} saved of {numberFormatter.format(goal.target)} — {progress}% complete.
                  </p>
                </li>
              )
            })}
          </ul>
        </article>
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Habit timeline</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Last 7 days</span>
          </div>
          <ul className="space-y-4 text-sm text-navy/80">
            {recentActivity.map((item) => (
              <li key={item.title} className="rounded-2xl border border-slate-100 bg-sand p-4">
                <p className="text-xs uppercase tracking-wide text-navy/60">{item.timestamp}</p>
                <p className="mt-2 text-base font-semibold text-navy">{item.title}</p>
                <p className="mt-1 text-sm text-navy/70">{item.description}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="flex flex-wrap gap-3">
        {smartNudges.map((nudge) => (
          <button
            key={nudge.label}
            type="button"
            className="inline-flex flex-col items-start gap-1 rounded-2xl border border-primary/20 bg-white px-4 py-3 text-left text-sm text-primary transition hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="font-semibold">{nudge.label}</span>
            <span className="text-xs text-primary/70">{nudge.detail}</span>
          </button>
        ))}
      </section>
    </div>
  )
}
