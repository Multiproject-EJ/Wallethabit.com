import { useCallback, useEffect, useMemo, useState } from 'react'

import type { DemoGoal } from '../lib/demoData'
import { useDemoData } from '../lib/demoDataStore'

export default function Goals() {
  const {
    state: { goals, profile },
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

  const formatCurrency = useCallback((value: number) => numberFormatter.format(value), [numberFormatter])

  const goalItems = goals.items
  const [focusGoalId, setFocusGoalId] = useState(goalItems[0]?.id ?? '')
  const [monthlyBoost, setMonthlyBoost] = useState(0)

  useEffect(() => {
    if (goalItems.length === 0) {
      setFocusGoalId('')
      return
    }

    if (!goalItems.some((goal) => goal.id === focusGoalId)) {
      setFocusGoalId(goalItems[0].id)
    }
  }, [goalItems, focusGoalId])

  const focusGoal = useMemo(
    () => goalItems.find((goal) => goal.id === focusGoalId) ?? goalItems[0],
    [goalItems, focusGoalId],
  )

  const summary = useMemo(() => {
    if (goalItems.length === 0) {
      return { totalTarget: 0, totalSaved: 0, averageProgress: 0, monthlyCommitment: 0 }
    }

    const totalTarget = goalItems.reduce((sum, goal) => sum + goal.target, 0)
    const totalSaved = goalItems.reduce((sum, goal) => sum + goal.saved, 0)
    const averageProgress = Math.round((totalSaved / Math.max(totalTarget, 1)) * 100)
    const monthlyCommitment = goalItems.reduce((sum, goal) => sum + goal.monthlyCommitment, 0)

    return { totalTarget, totalSaved, averageProgress, monthlyCommitment }
  }, [goalItems])

  const strategy = useMemo(() => {
    if (!focusGoal) {
      return { remaining: 0, baselineMonths: Number.POSITIVE_INFINITY, acceleratedMonths: Number.POSITIVE_INFINITY, timeSaved: 0 }
    }

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

  const baselineFinish = projectCompletionDate(strategy.baselineMonths, profile.localeId)
  const acceleratedFinish = projectCompletionDate(strategy.acceleratedMonths, profile.localeId)
  const baselineDuration = formatDuration(strategy.baselineMonths)
  const acceleratedDuration = formatDuration(strategy.acceleratedMonths)
  const timeSavedCopy = formatTimeSaved(strategy.timeSaved)
  const newMonthlyTotal = (focusGoal?.monthlyCommitment ?? 0) + monthlyBoost
  const lastCelebration = new Date(goals.lastCelebrationAt).toLocaleDateString(profile.localeId, {
    month: 'short',
    day: 'numeric',
  })

  const highlightMessage = buildHighlightMessage({
    goalName: focusGoal?.name ?? 'this goal',
    monthlyBoost,
    timeSaved: strategy.timeSaved,
    acceleratedFinish,
    formatCurrency,
  })

  return (
    <div className="relative flex flex-1 flex-col gap-10 pb-24">
      <header className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-dark via-primary to-coral p-8 text-white shadow-uplift">
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <span>🎯</span>
              Goal momentum
            </span>
            <h1 className="text-4xl font-semibold tracking-tight">Every milestone deserves a moment</h1>
            <p className="text-base text-white/80">
              You have already funded {summary.averageProgress}% of your dream list and commit {formatCurrency(summary.monthlyCommitment)} each month.
              WalletHabit keeps the path clear, celebrates your streaks, and nudges the next best move.
            </p>
          </div>
          <div className="grid gap-4 rounded-3xl bg-white/10 p-6 text-sm backdrop-blur">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Focus goal</p>
              <p className="mt-2 text-lg font-semibold">{focusGoal?.name ?? 'Add your first goal'}</p>
              <p className="mt-1 text-xs text-emerald-200">{highlightMessage}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Last celebration</p>
              <p className="mt-2 text-2xl font-semibold">{lastCelebration}</p>
              <p className="mt-1 text-xs text-white/70">Keep the streak alive with consistent deposits.</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-10 top-8 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-[-40px] right-12 h-52 w-52 rounded-full bg-gold/40 blur-3xl" />
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-4">
        <MetricTile label="Total funded" value={formatCurrency(summary.totalSaved)} tone="positive" />
        <MetricTile label="Goal coverage" value={`${summary.averageProgress}%`} />
        <MetricTile label="Monthly commitment" value={formatCurrency(summary.monthlyCommitment)} />
        <MetricTile label="Aggregate target" value={formatCurrency(summary.totalTarget)} tone="muted" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-base">🧪</span>
              Strategy lab
            </div>
            <h2 className="text-2xl font-semibold text-navy">Stress test your celebration timeline</h2>
            <p className="text-sm text-navy/70">
              Explore how small boosts unlock earlier milestones. Once Supabase sync is live, these projections will mirror your real deposits.
            </p>
          </div>

          <div className="mt-6 grid gap-6">
            <label className="flex flex-col gap-2 text-sm font-medium text-navy/80">
              Focus goal
              <select
                className="rounded-2xl border border-white/80 bg-white px-3 py-2 text-sm text-navy shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed"
                value={focusGoalId}
                onChange={(event) => setFocusGoalId(event.target.value)}
                disabled={goalItems.length === 0}
              >
                {goalItems.length === 0 ? (
                  <option value="">Add a goal soon</option>
                ) : (
                  goalItems.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.name}
                    </option>
                  ))
                )}
              </select>
            </label>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-sand/60 p-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-navy/60">
                <span>Monthly boost</span>
                <span className="text-navy">{monthlyBoost === 0 ? 'No boost' : `+${formatCurrency(monthlyBoost)} /mo`}</span>
              </div>
              <input
                aria-label="Monthly boost"
                type="range"
                min={0}
                max={500}
                step={25}
                value={monthlyBoost}
                onChange={(event) => setMonthlyBoost(Number(event.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/40">
                <span>{formatCurrency(0)}</span>
                <span>{`+${formatCurrency(250)}`}</span>
                <span>{`+${formatCurrency(500)}`}</span>
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-white/80 bg-white/70 p-4 sm:grid-cols-2">
              <StrategyStat label="Baseline finish" value={baselineFinish} helper={baselineDuration} />
              <StrategyStat label="Accelerated finish" value={acceleratedFinish} helper={acceleratedDuration} highlight />
              <StrategyStat label="Time saved" value={timeSavedCopy} helper="Compared with your current pace" />
              <StrategyStat
                label="Monthly total"
                value={formatCurrency(newMonthlyTotal)}
                helper={monthlyBoost > 0 ? `+${formatCurrency(monthlyBoost)} boost applied` : 'Matches current commitment'}
              />
            </div>
          </div>
        </article>

        <aside className="flex h-full flex-col justify-between gap-6 rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div>
            <h3 className="text-lg font-semibold text-navy">Playbook summary</h3>
            <p className="mt-2 text-sm text-navy/70">{highlightMessage}</p>
          </div>
          <ul className="space-y-4 text-sm text-navy/70">
            <StrategyBullet title="Remaining target" description={`${formatCurrency(strategy.remaining)} left to celebrate this goal.`} />
            <StrategyBullet
              title="New monthly cadence"
              description={`${formatCurrency(newMonthlyTotal)} per month (${monthlyBoost === 0 ? 'baseline pace' : `+${formatCurrency(monthlyBoost)} boost`}).`}
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
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs text-primary-dark">
            This sandbox will pull in real deposits, transfers, and partner automations once Supabase wiring is ready.
          </div>
        </aside>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-navy">Goal library</h2>
            <p className="text-sm text-navy/60">Reorder, favorite, or open any goal to fine-tune contributions. Completed goals will glow gold in celebration.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span>⚡</span>
            Drag-and-drop coming soon
          </div>
        </div>

        <div className="grid gap-5">
          {goalItems.length > 0 ? (
            goalItems.map((goal) => (
              <GoalCard key={goal.id} goal={goal} isFocused={goal.id === focusGoal?.id} formatCurrency={formatCurrency} />
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/70 bg-white/70 p-6 text-sm text-navy/70">
              Goals will populate here once Supabase sync is live. For now, adjust the demo strategy lab to preview the experience.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

type MetricTileProps = {
  label: string
  value: string
  tone?: 'positive' | 'muted'
}

function MetricTile({ label, value, tone }: MetricTileProps) {
  const toneStyles =
    tone === 'positive'
      ? 'border-primary/30 bg-primary/10 text-primary-dark'
      : tone === 'muted'
        ? 'border-white/70 text-navy/60'
        : 'border-white/60 text-navy'

  return (
    <article className={`rounded-[24px] border bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md ${toneStyles}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/50">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </article>
  )
}

type GoalCardProps = {
  goal: DemoGoal
  isFocused: boolean
  formatCurrency: (value: number) => string
}

function GoalCard({ goal, isFocused, formatCurrency }: GoalCardProps) {
  const progress = Math.min(goal.saved / goal.target, 1)
  const remaining = Math.max(goal.target - goal.saved, 0)
  const priorityLabel = `${goal.priority} priority`

  return (
    <article
      className={`rounded-[28px] border bg-white/90 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg ${
        isFocused ? 'border-primary/40' : 'border-white/60'
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-6">
          <ProgressDonut progress={progress} />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-navy">{goal.name}</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Target {formatCurrency(goal.target)}
              </span>
              <span className="rounded-full bg-coral/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-coral">
                {priorityLabel}
              </span>
            </div>
            <p className="max-w-xl text-sm text-navy/70">{goal.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-navy/70">
              <Detail label="Saved" value={formatCurrency(goal.saved)} />
              <Detail label="Remaining" value={formatCurrency(remaining)} />
              <Detail label="Monthly" value={formatCurrency(goal.monthlyCommitment)} />
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
      className={`rounded-2xl border p-4 shadow-sm transition ${
        highlight ? 'border-primary/40 bg-primary/10 text-primary-dark' : 'border-white/80 bg-white/80 text-navy'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/50">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      <p className="mt-1 text-xs text-navy/60">{helper}</p>
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
      <span className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">
        ✨
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-navy">{title}</p>
        <p className="text-sm text-navy/70">{description}</p>
      </div>
    </li>
  )
}

type DetailProps = {
  label: string
  value: string
}

function Detail({ label, value }: DetailProps) {
  return (
    <div className="rounded-full bg-sand px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/70">
      <span className="text-navy/80">{label}:</span> {value}
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
        className="absolute inset-0 rounded-full shadow-[0_15px_30px_-12px_rgba(15,118,110,0.35)]"
        style={{
          background: `conic-gradient(#14b8a6 ${percentage * 3.6}deg, rgba(15, 118, 110, 0.1) 0deg)`,
        }}
        aria-hidden
      />
      <div className="absolute inset-1 rounded-full bg-white" aria-hidden />
      <div className="relative flex h-full w-full items-center justify-center text-sm font-semibold text-primary-dark">
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
    <figure className="flex w-full flex-col items-end gap-3 text-xs text-navy/50 lg:w-56">
      <svg viewBox="0 0 100 100" className="h-24 w-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={4}
          strokeLinecap="round"
          points={normalised.map((point) => point.join(',')).join(' ')}
        />
        <path d={`${path} L100,100 L0,100 Z`} fill="rgba(20, 184, 166, 0.08)" />
      </svg>
      <figcaption className="text-right">Recent contributions</figcaption>
    </figure>
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

function projectCompletionDate(months: number, locale: string) {
  if (!Number.isFinite(months)) return 'TBD'
  if (months <= 0) return 'Now'

  const projection = new Date()
  projection.setMonth(projection.getMonth() + Math.ceil(months))

  return projection.toLocaleDateString(locale, {
    month: 'short',
    year: 'numeric',
  })
}

type HighlightMessageInput = {
  goalName: string
  monthlyBoost: number
  timeSaved: number
  acceleratedFinish: string
  formatCurrency: (value: number) => string
}

function buildHighlightMessage({ goalName, monthlyBoost, timeSaved, acceleratedFinish, formatCurrency }: HighlightMessageInput) {
  if (monthlyBoost <= 0) {
    return `Dial in a boost to see how quickly ${goalName.toLowerCase()} comes to life.`
  }

  if (timeSaved <= 0 || acceleratedFinish === 'TBD') {
    return `At +${formatCurrency(monthlyBoost)} each month you're staying on pace. Try nudging the slider further to beat the schedule for ${goalName.toLowerCase()}.`
  }

  const savedLabel = timeSaved < 1 ? 'a few weeks' : `${Math.round(timeSaved)} month${Math.round(timeSaved) === 1 ? '' : 's'}`

  return `You're on track to wrap ${goalName.toLowerCase()} roughly ${savedLabel} sooner, celebrating around ${acceleratedFinish}.`
}


