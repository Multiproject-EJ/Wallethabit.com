import { useMemo, useState } from 'react'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const goals = [
  {
    id: 'emergency',
    name: 'Emergency cushion',
    description: 'Cover three months of core expenses in a high-yield savings account.',
    target: 10000,
    saved: 6800,
    monthlyCommitment: 400,
    dueLabel: 'Dec 2024',
    priority: 'High',
    trend: [3200, 3600, 4200, 5100, 5800, 6200, 6800],
  },
  {
    id: 'travel',
    name: 'Iceland adventure',
    description: 'Flights, lodging, and experiences for a two-week summer escape.',
    target: 4500,
    saved: 2100,
    monthlyCommitment: 250,
    dueLabel: 'Aug 2025',
    priority: 'Medium',
    trend: [400, 650, 800, 1200, 1500, 1900, 2100],
  },
  {
    id: 'studio',
    name: 'Creative studio upgrade',
    description: 'New desk setup, lighting, and acoustic panels for content creation.',
    target: 3200,
    saved: 1250,
    monthlyCommitment: 180,
    dueLabel: 'Mar 2025',
    priority: 'Low',
    trend: [0, 0, 120, 320, 620, 980, 1250],
  },
]

type Goal = (typeof goals)[number]

export default function Goals() {
  const [focusGoalId, setFocusGoalId] = useState(goals[0].id)
  const [monthlyBoost, setMonthlyBoost] = useState(0)

  const focusGoal = useMemo(() => goals.find((goal) => goal.id === focusGoalId) ?? goals[0], [focusGoalId])
  const summary = useMemo(() => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0)
    const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0)
    const averageProgress = Math.round((totalSaved / totalTarget) * 100)
    const monthlyCommitment = goals.reduce((sum, goal) => sum + goal.monthlyCommitment, 0)

    return { totalTarget, totalSaved, averageProgress, monthlyCommitment }
  }, [])

  const strategy = useMemo(() => {
    const remaining = Math.max(focusGoal.target - focusGoal.saved, 0)
    const baselineMonths = calculateMonths(focusGoal.monthlyCommitment, remaining)
    const acceleratedMonths = calculateMonths(focusGoal.monthlyCommitment + monthlyBoost, remaining)
    const timeSaved =
      Number.isFinite(baselineMonths) && Number.isFinite(acceleratedMonths)
        ? Math.max(baselineMonths - acceleratedMonths, 0)
        : 0

    return {
      remaining,
      baselineMonths,
      acceleratedMonths,
      timeSaved,
    }
  }, [focusGoal, monthlyBoost])

  const baselineFinish = projectCompletionDate(strategy.baselineMonths)
  const acceleratedFinish = projectCompletionDate(strategy.acceleratedMonths)
  const baselineDuration = formatDuration(strategy.baselineMonths)
  const acceleratedDuration = formatDuration(strategy.acceleratedMonths)
  const timeSavedCopy = formatTimeSaved(strategy.timeSaved)
  const newMonthlyTotal = focusGoal.monthlyCommitment + monthlyBoost
  const highlightMessage = buildHighlightMessage({
    goalName: focusGoal.name,
    monthlyBoost,
    timeSaved: strategy.timeSaved,
    acceleratedFinish,
  })

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/15">🎯</span>
          Savings Goals HQ
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Celebrate the milestones that matter
        </h1>
        <p className="max-w-3xl text-base text-slate-600">
          Track progress across every dream you are funding. Fine-tune timelines, monitor monthly momentum,
          and preview the cheer moments WalletHabit will surface once Supabase persistence is live.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-4">
        <SummaryCard label="Total funded" value={currency.format(summary.totalSaved)} accent />
        <SummaryCard label="Goal coverage" value={`${summary.averageProgress}%`} />
        <SummaryCard label="Monthly commitment" value={currency.format(summary.monthlyCommitment)} />
        <SummaryCard label="Aggregate target" value={currency.format(summary.totalTarget)} subtle />
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        <aside className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Celebration roadmap</h2>
          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Supabase sync</strong> will preserve every contribution and unlock collaborative goal setting.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>AI coach</strong> drafts micro-celebrations and nudges when you fall behind schedule.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>
                <strong>Stripe upgrades</strong> expand to shared goals, automation rules, and deeper analytics.
              </p>
            </li>
          </ul>
          <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/10 p-4 text-sm text-brand-dark">
            <p className="font-semibold">Coming soon</p>
            <p className="mt-2 leading-relaxed">
              Connect your bank or import CSVs to fast-track balances. WalletHabit will reconcile deposits,
              forecast completion dates, and suggest optimized contribution plans.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/15">🧪</span>
              Contribution strategy lab
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Stress test your plan</h2>
            <p className="text-sm text-slate-600">
              Preview how small monthly boosts unlock earlier celebrations. Once Supabase persistence lands, this
              simulation will sync with your live contributions.
            </p>
          </div>

          <div className="mt-6 grid gap-6">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Focus goal
              <select
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                value={focusGoalId}
                onChange={(event) => setFocusGoalId(event.target.value)}
              >
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Monthly boost</span>
                <span className="text-slate-700">
                  {monthlyBoost === 0 ? 'No boost' : `+${currency.format(monthlyBoost)} /mo`}
                </span>
              </div>
              <input
                aria-label="Monthly boost"
                type="range"
                min={0}
                max={500}
                step={25}
                value={monthlyBoost}
                onChange={(event) => setMonthlyBoost(Number(event.target.value))}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <span>$0</span>
                <span>+$250</span>
                <span>+$500</span>
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2">
              <StrategyStat label="Baseline finish" value={baselineFinish} helper={baselineDuration} />
              <StrategyStat
                label="Accelerated finish"
                value={acceleratedFinish}
                helper={acceleratedDuration}
                highlight
              />
              <StrategyStat label="Time saved" value={timeSavedCopy} helper="Compared with your current plan" />
              <StrategyStat
                label="Monthly total"
                value={currency.format(newMonthlyTotal)}
                helper={
                  monthlyBoost > 0
                    ? `+${currency.format(monthlyBoost)} boost applied`
                    : 'Matches current commitment'
                }
              />
            </div>
          </div>
        </article>

        <aside className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Playbook summary</h3>
            <p className="mt-2 text-sm text-slate-600">{highlightMessage}</p>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <StrategyBullet
              title="Remaining target"
              description={`${currency.format(strategy.remaining)} left to celebrate this goal.`}
            />
            <StrategyBullet
              title="New monthly cadence"
              description={`${currency.format(newMonthlyTotal)} per month (${monthlyBoost === 0 ? 'baseline pace' : `+${currency.format(monthlyBoost)} boost`}).`}
            />
            <StrategyBullet
              title="Celebration ETA"
              description={
                acceleratedFinish === 'TBD'
                  ? 'Add a boost to reveal a realistic finish window.'
                  : `${acceleratedFinish} • ${acceleratedDuration.toLowerCase()}`
              }
            />
          </ul>
          <p className="rounded-2xl border border-dashed border-brand/40 bg-brand/10 p-4 text-xs text-brand-dark">
            This sandbox will pull in real deposits, transfers, and partner automations once Supabase wiring is ready.
          </p>
        </aside>
      </section>
    </div>
  )
}

type SummaryCardProps = {
  label: string
  value: string
  accent?: boolean
  subtle?: boolean
}

function SummaryCard({ label, value, accent, subtle }: SummaryCardProps) {
  return (
    <article
      className={[
        'rounded-3xl border bg-white p-6 shadow-sm transition',
        accent ? 'border-brand/40 bg-brand/10 text-brand-dark' : 'border-slate-200',
        subtle ? 'text-slate-500' : 'text-slate-900',
      ].join(' ')}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </article>
  )
}

type GoalCardProps = {
  goal: Goal
}

function GoalCard({ goal }: GoalCardProps) {
  const progress = Math.min(goal.saved / goal.target, 1)
  const remaining = Math.max(goal.target - goal.saved, 0)

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <ProgressDonut progress={progress} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-slate-900">{goal.name}</h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {goal.priority} priority
              </span>
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
                Target {currency.format(goal.target)}
              </span>
            </div>
            <p className="mt-2 max-w-xl text-sm text-slate-600">{goal.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
              <Detail label="Saved" value={currency.format(goal.saved)} />
              <Detail label="Remaining" value={currency.format(remaining)} />
              <Detail label="Monthly" value={currency.format(goal.monthlyCommitment)} />
              <Detail label="Goal date" value={goal.dueLabel} />
            </div>
          </div>
        </div>
        <TrendChart id={goal.id} values={goal.trend} />
      </div>
    </article>
  )
}

type StrategyStatProps = {
  label: string
  value: string
  helper: string
  highlight?: boolean
}

function StrategyStat({ label, value, helper, highlight }: StrategyStatProps) {
  return (
    <div
      className={[
        'rounded-xl border p-4 shadow-sm transition',
        highlight ? 'border-brand/50 bg-brand/5 text-brand-dark' : 'border-slate-200 bg-white text-slate-700',
      ].join(' ')}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  )
}

type StrategyBulletProps = {
  title: string
  description: string
}

function StrategyBullet({ title, description }: StrategyBulletProps) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs text-brand">
        ✨
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </li>
  )
}

function calculateMonths(contribution: number, remaining: number) {
  if (remaining <= 0) return 0
  if (contribution <= 0) return Number.POSITIVE_INFINITY
  return remaining / contribution
}

function formatDuration(months: number) {
  if (!Number.isFinite(months)) return 'No plan yet'
  if (months <= 0) return 'Fully funded'
  if (months < 1) return 'Under 1 month'
  if (months < 1.5) return 'About 1 month'
  return `About ${Math.ceil(months)} months`
}

function formatTimeSaved(months: number) {
  if (!Number.isFinite(months) || months <= 0) return '0 months'
  if (months < 1) return 'A few weeks'
  if (months < 1.5) return '≈1 month'
  return `≈${Math.round(months)} months`
}

function projectCompletionDate(months: number) {
  if (!Number.isFinite(months)) return 'TBD'
  if (months <= 0) return 'Now'

  const projection = new Date()
  projection.setMonth(projection.getMonth() + Math.ceil(months))

  return projection.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

type HighlightMessageInput = {
  goalName: string
  monthlyBoost: number
  timeSaved: number
  acceleratedFinish: string
}

function buildHighlightMessage({ goalName, monthlyBoost, timeSaved, acceleratedFinish }: HighlightMessageInput) {
  if (monthlyBoost <= 0) {
    return `Dial in a boost to see how quickly ${goalName.toLowerCase()} comes to life.`
  }

  if (timeSaved <= 0 || acceleratedFinish === 'TBD') {
    return `At +${currency.format(monthlyBoost)} each month you're staying on pace. Try nudging the slider further to beat the schedule for ${goalName.toLowerCase()}.`
  }

  const savedLabel =
    timeSaved < 1 ? 'a few weeks' : `${Math.round(timeSaved)} month${Math.round(timeSaved) === 1 ? '' : 's'}`

  return `You're on track to wrap ${goalName.toLowerCase()} roughly ${savedLabel} sooner, celebrating around ${acceleratedFinish}.`
}

type DetailProps = {
  label: string
  value: string
}

function Detail({ label, value }: DetailProps) {
  return (
    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
      <span className="text-slate-700">{label}:</span> {value}
    </div>
  )
}

type ProgressDonutProps = {
  progress: number
}

function ProgressDonut({ progress }: ProgressDonutProps) {
  const clamped = Math.max(0, Math.min(progress, 1))
  const percentage = Math.round(clamped * 100)

  return (
    <div className="relative h-20 w-20">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#6366f1 ${percentage * 3.6}deg, #e2e8f0 0deg)`,
        }}
        aria-hidden
      />
      <div className="absolute inset-1 rounded-full bg-white" aria-hidden />
      <div className="relative flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700">
        {percentage}%
      </div>
    </div>
  )
}

type TrendChartProps = {
  id: string
  values: number[]
}

function TrendChart({ id, values }: TrendChartProps) {
  if (values.length === 0) return null

  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const range = Math.max(maxValue - minValue, maxValue || 1, 1)
  const normalised = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100
    const y = values.length === 1 ? 50 : 90 - ((value - minValue) / range) * 70
    return [x, y]
  })

  const path = normalised
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point[0]},${point[1]}`)
    .join(' ')

  const gradientId = `goalTrend-${id}`

  return (
    <figure className="flex w-full flex-col items-end gap-3 text-xs text-slate-500 lg:w-56">
      <svg viewBox="0 0 100 100" className="h-24 w-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={4}
          strokeLinecap="round"
          points={normalised.map((point) => point.join(',')).join(' ')}
        />
        <path d={`${path} L100,100 L0,100 Z`} fill="rgba(99, 102, 241, 0.08)" />
      </svg>
      <figcaption className="text-right">Recent contributions</figcaption>
    </figure>
  )
}
