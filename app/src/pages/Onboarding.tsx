import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDemoData } from '../lib/demoDataStore'

const wizardSteps = [
  { id: 'rhythm', label: 'Set your rhythm' },
  { id: 'money', label: 'Add your money picture' },
  { id: 'nudges', label: 'Lock in helpful nudges' },
] as const

const focusHabitOptions = [
  'Build emergency fund',
  'Stay on budget',
  'Pay down debt',
  'Grow investing autopilot',
  'Celebrate mindful wins',
]

const reminderCadenceOptions = ['Weekly', 'Biweekly', 'Monthly'] as const
const celebrationOptions = ['Calm', 'Cheerful', 'Minimal'] as const
const cadenceOptions = ['Weekly', 'Monthly'] as const

const editableEnvelopeIds = ['groceries', 'dining', 'shopping']

export default function Onboarding() {
  const navigate = useNavigate()
  const {
    state: { profile, budget },
    setBudgetCadence,
    updateFirstDayOfWeek,
    updateRoundingMode,
    setFocusHabits,
    setReminderCadence,
    setCelebrationStyle,
    toggleNotification,
    updateMonthlyIncome,
    updateEnvelopePlanned,
    resetEnvelopePlanned,
    updateLastActive,
  } = useDemoData()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [monthlyIncomeDraft, setMonthlyIncomeDraft] = useState(() => budget.monthlyIncome.toString())
  const [envelopeDrafts, setEnvelopeDrafts] = useState(() =>
    Object.fromEntries(
      budget.envelopes
        .filter((envelope) => editableEnvelopeIds.includes(envelope.id))
        .map((envelope) => [envelope.id, envelope.planned.toString()]),
    ),
  )

  const progress = useMemo(
    () => Math.round(((currentStepIndex + 1) / wizardSteps.length) * 100),
    [currentStepIndex],
  )

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(profile.localeId, {
        style: 'currency',
        currency: profile.currency,
        maximumFractionDigits: 0,
      }),
    [profile.currency, profile.localeId],
  )

  const formattedIncome = useMemo(
    () => currencyFormatter.format(budget.monthlyIncome),
    [budget.monthlyIncome, currencyFormatter],
  )

  const totalSpent = budget.envelopes.reduce((acc, envelope) => acc + envelope.spent, 0)
  const surplus = Math.max(0, budget.monthlyIncome - totalSpent)
  const formattedSurplus = useMemo(() => currencyFormatter.format(surplus), [currencyFormatter, surplus])

  const handleToggleHabit = (habit: string) => {
    if (profile.focusHabits.includes(habit)) {
      setFocusHabits(profile.focusHabits.filter((item) => item !== habit))
      return
    }

    if (profile.focusHabits.length >= 2) {
      return
    }

    setFocusHabits([...profile.focusHabits, habit])
  }

  const handleEnvelopeChange = (id: string, value: string) => {
    setEnvelopeDrafts((previous) => ({ ...previous, [id]: value }))
  }

  const handleFinish = () => {
    updateLastActive()
    navigate('/dashboard')
  }

  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm sm:px-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Start guide
            </span>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
                  A calm setup that personalises your habit dashboard.
                </h1>
                <p className="max-w-2xl text-base text-navy/70">
                  Progress autosaves. Jump between steps at any time and WalletHabit will reflect your choices instantly across the dashboard and Update hub.
                </p>
              </div>
              <div className="text-sm font-medium text-primary sm:text-right">
                <p>Step {currentStepIndex + 1} of {wizardSteps.length}</p>
                <p className="text-xs text-primary/70">{progress}% complete</p>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-sand-darker/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-primary-light to-gold"
                style={{ width: `${progress}%` }}
              />
            </div>
            <nav className="flex flex-wrap gap-2 text-sm font-semibold">
              {wizardSteps.map((step, index) => {
                const isActive = index === currentStepIndex
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStepIndex(index)}
                    className={[
                      'rounded-full border px-4 py-2 transition',
                      isActive
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-slate-200 bg-white hover:border-primary/30 hover:text-primary',
                    ].join(' ')}
                  >
                    {index + 1}. {step.label}
                  </button>
                )
              })}
            </nav>
            <div className="rounded-3xl border border-slate-100 bg-sand p-6 text-sm text-navy/80">
              {currentStepIndex === 0 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-navy">Budget rhythm</h2>
                    <div className="flex flex-wrap gap-3">
                      {cadenceOptions.map((cadence) => {
                        const isActive = profile.budgetCadence === cadence
                        return (
                          <button
                            key={cadence}
                            type="button"
                            onClick={() => setBudgetCadence(cadence)}
                            className={[
                              'rounded-2xl border px-4 py-2 text-sm font-semibold transition',
                              isActive
                                ? 'border-primary bg-white shadow-sm text-primary'
                                : 'border-white/80 bg-white/70 hover:border-primary/40 hover:text-primary',
                            ].join(' ')}
                          >
                            {cadence} budget
                          </button>
                        )
                      })}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-navy/60">First day of week</p>
                        <div className="flex gap-2">
                          {(['Monday', 'Sunday'] as const).map((day) => {
                            const isActive = profile.firstDayOfWeek === day
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => updateFirstDayOfWeek(day)}
                                className={[
                                  'flex-1 rounded-2xl border px-4 py-2 text-sm font-medium transition',
                                  isActive
                                    ? 'border-primary bg-white text-primary shadow-sm'
                                    : 'border-white/80 bg-white/70 hover:border-primary/40 hover:text-primary',
                                ].join(' ')}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-navy/60">Rounding mode</p>
                        <div className="flex gap-2">
                          {(['exact', 'nearest-dollar'] as const).map((mode) => {
                            const isActive = profile.roundingMode === mode
                            return (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => updateRoundingMode(mode)}
                                className={[
                                  'flex-1 rounded-2xl border px-4 py-2 text-sm font-medium transition capitalize',
                                  isActive
                                    ? 'border-primary bg-white text-primary shadow-sm'
                                    : 'border-white/80 bg-white/70 hover:border-primary/40 hover:text-primary',
                                ].join(' ')}
                              >
                                {mode.replace('-', ' ')}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-navy/60">
                      <p>Focus habits</p>
                      <p>{profile.focusHabits.length} of 2 selected</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {focusHabitOptions.map((habit) => {
                        const isActive = profile.focusHabits.includes(habit)
                        const isDisabled = !isActive && profile.focusHabits.length >= 2
                        return (
                          <button
                            key={habit}
                            type="button"
                            onClick={() => handleToggleHabit(habit)}
                            disabled={isDisabled}
                            className={[
                              'rounded-full border px-4 py-2 text-sm transition',
                              isActive
                                ? 'border-primary bg-primary text-white shadow-sm'
                                : 'border-white/80 bg-white/80 hover:border-primary/40 hover:text-primary',
                              isDisabled ? 'opacity-60 cursor-not-allowed' : '',
                            ].join(' ')}
                          >
                            {habit}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
              {currentStepIndex === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr] sm:items-center">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-navy/60">Monthly income</p>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={monthlyIncomeDraft}
                          onChange={(event) => setMonthlyIncomeDraft(event.target.value)}
                          onBlur={() => {
                            const parsed = Number(monthlyIncomeDraft)
                            if (Number.isNaN(parsed)) {
                              setMonthlyIncomeDraft(budget.monthlyIncome.toString())
                              return
                            }
                            updateMonthlyIncome(parsed)
                            setMonthlyIncomeDraft(Math.round(parsed).toString())
                          }}
                          className="w-full rounded-2xl border border-white/80 bg-white px-4 py-2 text-sm shadow-inner focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setMonthlyIncomeDraft(budget.monthlyIncome.toString())
                          }}
                          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-navy/60 transition hover:border-primary/40 hover:text-primary"
                        >
                          Reset
                        </button>
                      </div>
                      <p className="text-xs text-navy/60">Current preview: {formattedIncome}</p>
                    </div>
                    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs text-primary">
                      Surplus after spend: <span className="font-semibold">{formattedSurplus}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-navy/60">Tune your envelopes</p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {budget.envelopes
                        .filter((envelope) => editableEnvelopeIds.includes(envelope.id))
                        .map((envelope) => {
                          const draftValue = envelopeDrafts[envelope.id] ?? envelope.planned.toString()
                          return (
                            <div key={envelope.id} className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                              <p className="text-xs uppercase tracking-wide text-navy/50">{envelope.name}</p>
                              <p className="mt-1 text-sm text-navy/80">Spent {currencyFormatter.format(envelope.spent)}</p>
                              <input
                                type="range"
                                min={Math.max(envelope.spent, envelope.baseline * 0.6)}
                                max={Math.max(envelope.spent, envelope.baseline * 1.6)}
                                step={10}
                                value={Number(draftValue)}
                                onChange={(event) => {
                                  handleEnvelopeChange(envelope.id, event.target.value)
                                  updateEnvelopePlanned(envelope.id, Number(event.target.value))
                                }}
                                className="mt-3 w-full"
                              />
                              <div className="mt-2 flex items-center justify-between text-xs text-navy/60">
                                <span>Planned</span>
                                <span className="font-semibold text-navy">{currencyFormatter.format(Number(draftValue))}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  handleEnvelopeChange(envelope.id, envelope.baseline.toString())
                                  resetEnvelopePlanned(envelope.id)
                                }}
                                className="mt-2 text-xs font-semibold text-primary transition hover:text-primary-dark"
                              >
                                Back to baseline
                              </button>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              )}
              {currentStepIndex === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-navy/60">Reminder cadence</p>
                      <div className="flex flex-wrap gap-2">
                        {reminderCadenceOptions.map((cadence) => {
                          const isActive = profile.reminderCadence === cadence
                          return (
                            <button
                              key={cadence}
                              type="button"
                              onClick={() => setReminderCadence(cadence)}
                              className={[
                                'rounded-full border px-4 py-2 text-sm transition',
                                isActive
                                  ? 'border-primary bg-primary text-white shadow-sm'
                                  : 'border-white/80 bg-white/80 hover:border-primary/40 hover:text-primary',
                              ].join(' ')}
                            >
                              {cadence} nudges
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-navy/60">Celebration style</p>
                      <div className="flex flex-wrap gap-2">
                        {celebrationOptions.map((style) => {
                          const isActive = profile.celebrationStyle === style
                          return (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setCelebrationStyle(style)}
                              className={[
                                'rounded-full border px-4 py-2 text-sm transition',
                                isActive
                                  ? 'border-gold bg-gold/90 text-navy shadow-sm'
                                  : 'border-white/80 bg-white/80 hover:border-gold/60 hover:text-gold/80',
                              ].join(' ')}
                            >
                              {style}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-navy/60">Email + push nudges</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(profile.notifications).map(([id, value]) => (
                        <label
                          key={id}
                          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/80 bg-white/80 p-4 text-sm shadow-sm transition hover:border-primary/40"
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => toggleNotification(id)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          <span className="space-y-1">
                            <span className="block font-semibold text-navy">
                              {id
                                .split('-')
                                .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
                                .join(' ')}
                            </span>
                            <span className="text-xs text-navy/60">
                              {value ? 'Enabled — we will keep you posted just enough.' : 'Off for now — no pings until you toggle back on.'}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex((index) => Math.max(0, index - 1))}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-navy transition hover:border-primary/40 hover:text-primary"
                >
                  Back
                </button>
              )}
              {currentStepIndex < wizardSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex((index) => Math.min(wizardSteps.length - 1, index + 1))}
                  className="rounded-full bg-primary px-6 py-2.5 text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="rounded-full bg-primary px-6 py-2.5 text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Finish setup
                </button>
              )}
            </div>
          </div>
          <aside className="flex w-full max-w-md flex-col gap-4 rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Live preview</h2>
            <p className="text-sm text-navy/70">
              Your dashboard will open with your habit score, surplus, and focus habits front and centre.
            </p>
            <div className="space-y-4 text-sm text-navy/80">
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-primary/70">Budget cadence</p>
                <p className="mt-1 text-base font-semibold text-navy">{profile.budgetCadence} rhythm · {profile.firstDayOfWeek} start</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-primary/70">Focus habits</p>
                <p className="mt-1 text-base font-semibold text-navy">
                  {profile.focusHabits.length ? profile.focusHabits.join(' · ') : 'Pick up to two habits to highlight'}
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-primary/70">Next nudges</p>
                <p className="mt-1 text-base font-semibold text-navy">{profile.reminderCadence} check-ins · {profile.celebrationStyle} celebrations</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-primary/70">Surplus ready</p>
                <p className="mt-1 text-base font-semibold text-navy">{formattedSurplus}</p>
                <p className="mt-1 text-xs text-navy/60">Route it to your highlighted goals from the Update hub.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFinish}
              className="rounded-full border border-primary/30 px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10"
            >
              Jump to dashboard preview
            </button>
          </aside>
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-navy">What to expect after setup</h2>
          <p className="text-sm text-navy/70">
            As soon as you hit finish, the dashboard highlights your habit score and cash pulse while the Update hub unlocks tailored action cards. Weekly digests and gentle nudges keep you returning just enough to stay on track.
          </p>
          <ul className="space-y-3 text-sm text-navy/80">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">✓</span>
              <span>All forms autosave, so you never lose progress while exploring.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">✓</span>
              <span>You can revisit any step from the dashboard checklist once setup is complete.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary">✓</span>
              <span>Upgrade prompts stay contextual — no upsell wall before you see value.</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-primary/30 bg-gradient-to-br from-white via-primary/5 to-primary/10 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary/80">First week momentum</h3>
          <div className="space-y-4 text-sm text-navy/80">
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-primary/60">Day 1</p>
              <p className="mt-1 text-base font-semibold text-navy">Dashboard unlocks habit score</p>
              <p className="mt-1 text-sm text-navy/70">See your savings rate, current streak, and top goal next action.</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-primary/60">Day 3</p>
              <p className="mt-1 text-base font-semibold text-navy">Update hub suggests boosts</p>
              <p className="mt-1 text-sm text-navy/70">Log new transactions, tweak envelopes, or celebrate a win in one tap.</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-primary/60">Day 7</p>
              <p className="mt-1 text-base font-semibold text-navy">Weekly email recap</p>
              <p className="mt-1 text-sm text-navy/70">Celebrate wins and preview next focus before Monday arrives.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
