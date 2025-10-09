import { useMemo } from 'react'

import IntegrationStatus from '../components/IntegrationStatus'
import type { DemoBudgetEnvelope } from '../lib/demoData'
import { hasStripeConfig, stripeEnvGuidance } from '../lib/stripeClient'
import { hasSupabaseConfig, supabaseEnvGuidance } from '../lib/supabaseClient'
import { useDemoData } from '../lib/demoDataStore'

const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const netWorthHistory = [55200, 56150, 56900, 57480, 58210, 59300, 60090]

const insights = [
  {
    title: 'Dining dialed-in',
    body: 'You spent 12% less on dining out than your three-month average. Friday night ramen stayed under $35. 🍜',
  },
  {
    title: 'Momentum win',
    body: 'Emergency cushion grew by $400 this month — you are 68% funded and six weeks ahead of schedule.',
  },
  {
    title: 'Cash flow nudge',
    body: 'A recurring subscription increased by $4.20. Consider moving it to your “Plan Ahead” envelope.',
  },
]

const quickActions = [
  { label: 'Add Transaction', icon: '➕' },
  { label: 'Add Goal', icon: '🎯' },
  { label: 'Pay Debt', icon: '💸' },
  { label: 'Transfer', icon: '🔁' },
  { label: 'Plan Ahead', icon: '🧭' },
]

const dailySpend = [38, 42, 26, 18, 47, 22, 34]

export default function Dashboard() {
  const {
    state: { profile, budget, goals },
    isAuthenticated,
  } = useDemoData()

  const netWorth = netWorthHistory[netWorthHistory.length - 1]
  const previousNetWorth = netWorthHistory[netWorthHistory.length - 2]
  const netWorthDelta = netWorth - previousNetWorth
  const netWorthChange = previousNetWorth ? netWorthDelta / previousNetWorth : 0

  const monthlyExpenses = budget.envelopes.reduce((total, envelope) => total + envelope.spent, 0)
  const savings = budget.monthlyIncome - monthlyExpenses
  const savingsRate = budget.monthlyIncome ? savings / budget.monthlyIncome : 0
  const incomeRatio = budget.monthlyIncome ? monthlyExpenses / budget.monthlyIncome : 0
  const savingsRatio = budget.monthlyIncome ? savings / budget.monthlyIncome : 0

  const dailyAverage = monthlyExpenses / 30
  const todaySpend = dailySpend[dailySpend.length - 1]
  const highestDailySpend = Math.max(...dailySpend)

  const upcomingCelebration = new Date(goals.lastCelebrationAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const chart = useMemo(() => createNetWorthChart(netWorthHistory), [])

  const spendingSegments = useMemo(() => createSpendingSegments(budget.envelopes), [budget.envelopes])

  return (
    <div className="relative flex flex-1 flex-col gap-8 pb-20">
      <header className="overflow-hidden rounded-[32px] bg-gradient-to-r from-primary-dark via-primary to-primary-light p-8 text-white shadow-uplift">
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">Clarity &amp; Momentum</p>
            <h1 className="text-4xl font-semibold tracking-tight">Good morning, {profile.fullName.split(' ')[0]}</h1>
            <p className="text-base text-white/80">
              You are in control. Here is the live pulse of your money — grounded, optimistic, and ready for your next move.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
                <span className="text-lg">✨</span>
                My focus today
              </button>
              <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-sand">
                <span className="text-lg">＋</span>
                Quick add
              </button>
            </div>
          </div>
          <div className="grid gap-4 rounded-3xl bg-white/10 p-5 text-sm lg:grid-cols-3 lg:text-left">
            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-white/60">Net worth</p>
              <p className="mt-2 text-2xl font-semibold">{numberFormatter.format(netWorth)}</p>
              <p className="mt-1 text-xs text-emerald-200">{percentFormatter.format(netWorthChange)} this month</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-white/60">Cash flow</p>
              <p className="mt-2 text-2xl font-semibold">{numberFormatter.format(savings)}</p>
              <p className="mt-1 text-xs text-emerald-200">{percentFormatter.format(savingsRate)} to goals</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-white/60">Momentum</p>
              <p className="mt-2 text-2xl font-semibold">{isAuthenticated ? 'Streak: 12 days' : 'Signed out'}</p>
              <p className="mt-1 text-xs text-white/70">Last celebration {upcomingCelebration}</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-0 opacity-30">
          <div className="absolute -left-10 top-12 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-48 w-48 rounded-full bg-gold/40 blur-3xl" />
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-4">
        <article className="xl:col-span-2 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Net worth trajectory</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Trending up</span>
          </div>
          <p className="mt-2 text-sm text-navy/70">Steady compounding across savings, investments, and debt payoff.</p>
          <div className="mt-6">
            <svg viewBox="0 0 100 100" className="h-48 w-full text-white" preserveAspectRatio="none">
              <defs>
                <linearGradient id="networth-gradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path d={chart.areaPath} fill="url(#networth-gradient)" opacity={0.7} />
              <path d={chart.linePath} fill="none" stroke="#0f766e" strokeWidth={2.4} strokeLinecap="round" />
            </svg>
            <dl className="mt-4 grid gap-4 text-sm text-navy/80 sm:grid-cols-3">
              <div>
                <dt className="uppercase tracking-wide text-navy/60">Last month</dt>
                <dd className="mt-1 font-semibold">{numberFormatter.format(previousNetWorth)}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide text-navy/60">Change</dt>
                <dd className="mt-1 font-semibold text-primary">
                  {numberFormatter.format(netWorthDelta)} ({percentFormatter.format(netWorthChange)})
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide text-navy/60">Projection</dt>
                <dd className="mt-1 font-semibold">{numberFormatter.format(netWorth + 4500)}</dd>
              </div>
            </dl>
          </div>
        </article>

        <article className="xl:col-span-2 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Cash flow balance</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-primary-dark">Healthy</span>
          </div>
          <p className="mt-2 text-sm text-navy/70">Income vs. expenses for the current month.</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-navy/70">
              <span>Income</span>
              <span className="font-semibold text-primary">{numberFormatter.format(budget.monthlyIncome)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-navy/70">
              <span>Spending</span>
              <span className="font-semibold text-coral">{numberFormatter.format(monthlyExpenses)}</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-sand-darker/60">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-light"
                style={{ width: `${Math.min(Math.max(incomeRatio * 100, 0), 100)}%` }}
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center justify-center rounded-full bg-gradient-to-r from-gold to-coral/80 text-[11px] font-semibold text-navy"
                style={{ width: `${Math.min(Math.max(savingsRatio * 100, 0), 100)}%` }}
              >
                {percentFormatter.format(savingsRate)} saved
              </div>
            </div>
            <p className="text-xs text-navy/60">
              You are outpacing your spending plan by {numberFormatter.format(savings)}. Keep routing the surplus to your priority goals.
            </p>
          </div>
        </article>

        <article className="xl:col-span-2 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Spending clarity</h2>
            <span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold text-coral">This month</span>
          </div>
          <p className="mt-2 text-sm text-navy/70">Tap a slice for details and gentle coaching.</p>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="mx-auto w-40">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
                  <g fill="none" strokeWidth={16}>
                    <circle cx={80} cy={80} r={60} stroke="#e2e6ec" />
                    {spendingSegments.map((segment) => (
                      <circle
                        key={segment.id}
                        cx={80}
                        cy={80}
                        r={60}
                        stroke={segment.color}
                        strokeDasharray={segment.dashArray}
                        strokeDashoffset={segment.dashOffset}
                        strokeLinecap="round"
                        className="transition-all duration-200 hover:opacity-90"
                      />
                    ))}
                  </g>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-white/60 text-center">
                  <span className="text-xs uppercase tracking-widest text-navy/60">Spent</span>
                  <span className="mt-1 text-lg font-semibold text-navy">{numberFormatter.format(monthlyExpenses)}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {spendingSegments.map((segment) => (
                <div key={segment.id} className="flex items-center justify-between rounded-2xl bg-sand px-3 py-3 text-sm text-navy/80">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                    <div>
                      <p className="font-semibold">{segment.name}</p>
                      <p className="text-xs text-navy/60">{segment.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{numberFormatter.format(segment.spent)}</p>
                    <p className="text-xs text-navy/60">{percentFormatter.format(segment.portion)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="xl:col-span-2 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Budget tracker</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Peaceful pacing</span>
          </div>
          <p className="mt-2 text-sm text-navy/70">Color-coded progress bars guide your monthly rhythm.</p>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {budget.envelopes.map((envelope) => {
              const ratio = envelope.planned ? envelope.spent / envelope.planned : 0
              const tone = ratio <= 0.9 ? 'bg-primary-light' : ratio <= 1.1 ? 'bg-gold' : 'bg-rose-400'

              return (
                <div key={envelope.id} className="group flex flex-col items-center gap-3 rounded-2xl bg-sand px-3 py-4 text-center text-sm text-navy/80">
                  <div className="relative h-32 w-12 overflow-hidden rounded-full bg-white shadow-inner">
                    <div className="absolute bottom-0 left-0 right-0 rounded-t-full transition-all duration-300" style={{ height: `${Math.min(ratio, 1.2) * 100}%` }}>
                      <div className={`h-full w-full rounded-t-full ${tone}`} />
                    </div>
                    <div className="absolute inset-x-1 bottom-1 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-primary shadow-sm">
                      {Math.round(ratio * 100)}%
                    </div>
                  </div>
                  <p className="font-semibold">{envelope.name}</p>
                  <p className="text-xs text-navy/60">{numberFormatter.format(envelope.spent)}</p>
                </div>
              )
            })}
          </div>
        </article>

        <article className="xl:col-span-2 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Goals momentum</h2>
            <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">3 active goals</span>
          </div>
          <p className="mt-2 text-sm text-navy/70">Each milestone keeps your financial story moving forward.</p>
          <div className="mt-6 space-y-4">
            {goals.items.map((goal) => {
              const progress = goal.target ? goal.saved / goal.target : 0
              return (
                <div key={goal.id} className="rounded-2xl bg-sand px-4 py-4 text-sm text-navy">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-base font-semibold">{goal.name}</p>
                    <p className="text-xs text-navy/60">{goal.dueLabel}</p>
                  </div>
                  <p className="mt-1 text-xs text-navy/60">{goal.description}</p>
                  <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-light via-gold to-coral"
                      style={{ width: `${Math.min(progress * 100, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-navy/70">
                    <span>{numberFormatter.format(goal.saved)} saved</span>
                    <span>{percentFormatter.format(progress)} complete</span>
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className="xl:col-span-2 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Debt freedom meter</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Debt free in 18 months</span>
          </div>
          <p className="mt-2 text-sm text-navy/70">You have already cleared 36% of your debt plan.</p>
          <div className="mt-6 space-y-4">
            <div className="relative h-5 w-full overflow-hidden rounded-full bg-sand-darker/60">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-coral via-gold to-primary-light" style={{ width: '36%' }} />
              <div className="absolute inset-y-0 right-0 flex items-center justify-center text-[11px] font-semibold text-navy">64% to go</div>
            </div>
            <div className="grid gap-4 text-sm text-navy/80 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-navy/60">Total balance</p>
                <p className="mt-1 font-semibold">{numberFormatter.format(18600)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-navy/60">Paid to date</p>
                <p className="mt-1 font-semibold text-primary">{numberFormatter.format(6700)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-navy/60">Next milestone</p>
                <p className="mt-1 font-semibold text-coral">Snowball boost in 5 weeks</p>
              </div>
            </div>
          </div>
        </article>

        <article className="xl:col-span-2 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">AI insights feed</h2>
            <span className="rounded-full bg-midnight/10 px-3 py-1 text-xs font-semibold text-midnight">Supportive coach</span>
          </div>
          <p className="mt-2 text-sm text-navy/70">Celebrations, gentle nudges, and actionable suggestions.</p>
          <div className="mt-6 space-y-4">
            {insights.map((insight) => (
              <div key={insight.title} className="rounded-2xl bg-white p-4 shadow-inner">
                <p className="text-sm font-semibold text-navy">{insight.title}</p>
                <p className="mt-2 text-sm text-navy/70">{insight.body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="xl:col-span-2 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Today&apos;s snapshot</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Daily streak 7</span>
          </div>
          <p className="mt-2 text-sm text-navy/70">You&apos;ve spent {numberFormatter.format(todaySpend)} today — below your average of {numberFormatter.format(dailyAverage)}.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-sand px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-navy/60">Spend rhythm</p>
              <div className="mt-3 flex items-end gap-1">
                {dailySpend.map((value, index) => {
                  const height = highestDailySpend ? (value / highestDailySpend) * 100 : 0
                  const isToday = index === dailySpend.length - 1
                  return (
                    <div key={index} className="flex-1">
                      <div
                        className={`mx-auto w-6 rounded-t-full ${isToday ? 'bg-primary-light' : 'bg-sand-darker/80'}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  )
                })}
              </div>
              <p className="mt-3 text-xs text-navy/60">Streak goal: keep daily spend under {numberFormatter.format(60)}.</p>
            </div>
            <div className="rounded-2xl bg-sand px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-navy/60">Habits checklist</p>
              <ul className="mt-3 space-y-2 text-sm text-navy/80">
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <p>Logged breakfast and commute expenses.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <p>Transferred $150 to Emergency Cushion.</p>
                </li>
                <li className="flex items-start gap-2">
                  <span>🌀</span>
                  <p>Review weekend fun budget before Friday night.</p>
                </li>
              </ul>
            </div>
          </div>
        </article>
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

      <div className="fixed inset-x-0 bottom-6 z-20 flex justify-center px-6 lg:static lg:justify-end">
        <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur lg:max-w-none lg:rounded-3xl lg:bg-transparent lg:p-0 lg:shadow-none">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary/10 px-3 py-3 text-xs font-semibold text-primary transition hover:bg-primary/20 lg:flex-none lg:px-5 lg:text-sm"
            >
              <span className="text-base">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

type ChartPaths = {
  linePath: string
  areaPath: string
}

const createNetWorthChart = (data: number[]): ChartPaths => {
  if (data.length === 0) {
    return { linePath: '', areaPath: '' }
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const height = 70
  const topPadding = 15
  const bottom = topPadding + height

  const points = data.map((value, index) => {
    const x = data.length === 1 ? 0 : (index / (data.length - 1)) * 100
    const normalized = max === min ? 0.5 : (value - min) / (max - min)
    const y = topPadding + (1 - normalized) * height
    const command = index === 0 ? 'M' : 'L'
    return `${command} ${x.toFixed(2)} ${y.toFixed(2)}`
  })

  const linePath = points.join(' ')
  const areaPath = `${points.join(' ')} L 100 ${bottom} L 0 ${bottom} Z`

  return { linePath, areaPath }
}

type SpendingSegment = {
  id: string
  name: string
  description: string
  spent: number
  portion: number
  color: string
  dashArray: string
  dashOffset: number
}

const categoryPalette = ['#14b8a6', '#f98473', '#f3c969', '#6366f1', '#2dd4bf', '#38bdf8']

const createSpendingSegments = (envelopes: DemoBudgetEnvelope[]): SpendingSegment[] => {
  const total = envelopes.reduce((sum, envelope) => sum + envelope.spent, 0)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  let cumulative = 0

  return envelopes.map((envelope, index) => {
    const portion = total ? envelope.spent / total : 0
    const start = cumulative
    cumulative += portion
    const dashArray = `${portion * circumference} ${circumference}`
    const dashOffset = circumference * (1 - start)

    return {
      id: envelope.id,
      name: envelope.name,
      description: envelope.description,
      spent: envelope.spent,
      portion,
      color: categoryPalette[index % categoryPalette.length],
      dashArray,
      dashOffset,
    }
  })
}
