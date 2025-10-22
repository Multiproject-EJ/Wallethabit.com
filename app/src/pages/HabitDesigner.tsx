import { useMemo, useState } from 'react'

type StepId = 'persona' | 'blueprint' | 'support' | 'review'

type StepDefinition = {
  id: StepId
  label: string
  caption: string
}

type PersonaOption = {
  id: string
  label: string
  emoji: string
  description: string
  highlight: string
  gradient: string
  companion: string
}

type HabitFocusOption = {
  id: string
  label: string
  summary: string
  missions: string[]
  color: string
  xp: number
}

type CadenceOption = {
  id: string
  label: string
  description: string
  rhythm: string
}

type TimeWindowOption = {
  id: string
  label: string
  description: string
  icon: string
}

type AnchorOption = {
  id: string
  label: string
  description: string
}

type MultiSelectOption = {
  id: string
  label: string
  description: string
  icon: string
}

type RewardOption = {
  id: string
  label: string
  description: string
  icon: string
}

type DesignerState = {
  personaId: PersonaOption['id']
  habitName: string
  motivation: string
  focusId: HabitFocusOption['id']
  cadenceId: CadenceOption['id']
  timeWindowId: TimeWindowOption['id']
  anchorId: AnchorOption['id']
  durationMinutes: number
  automationIds: string[]
  supportIds: string[]
  rewardId: RewardOption['id']
  celebrationMessage: string
}

const steps: StepDefinition[] = [
  {
    id: 'persona',
    label: 'Quest identity',
    caption: 'Name the mission and pick the vibe that fits your energy.',
  },
  {
    id: 'blueprint',
    label: 'Routine blueprint',
    caption: 'Lock the cadence, anchors, and timeline so the habit feels effortless.',
  },
  {
    id: 'support',
    label: 'Support system',
    caption: 'Layer automations, accountability, and rewards that keep the streak alive.',
  },
  {
    id: 'review',
    label: 'Launch ritual',
    caption: 'Preview the quest log and activate the celebration loop.',
  },
]

const personaOptions: PersonaOption[] = [
  {
    id: 'sunrise-sage',
    label: 'Sunrise Sage',
    emoji: '🌅',
    description: 'Ease into the day with a calm warm-up that keeps your money radar sharp before decisions stack up.',
    highlight: 'Protects focus with quiet micro-reflections.',
    gradient: 'from-amber-100 via-rose-100 to-white',
    companion: 'Ember the fox sketches your wins at dawn.',
  },
  {
    id: 'momentum-maker',
    label: 'Momentum Maker',
    emoji: '🚀',
    description: 'Drop in mid-day for a burst of action that keeps budgets honest and momentum rising.',
    highlight: 'Stacks quick wins to power through the afternoon dip.',
    gradient: 'from-sky-100 via-emerald-100 to-white',
    companion: 'Nova the otter cheers every checklist streak.',
  },
  {
    id: 'twilight-strategist',
    label: 'Twilight Strategist',
    emoji: '🌙',
    description: 'Wind down with reflection, adjust tomorrow’s plan, and head to bed with a clear money map.',
    highlight: 'Turns evenings into a calm planning ritual.',
    gradient: 'from-indigo-100 via-purple-100 to-white',
    companion: 'Luna the cat keeps a lantern on your progress path.',
  },
]

const focusOptions: HabitFocusOption[] = [
  {
    id: 'budget-pulse',
    label: 'Budget pulse check',
    summary: 'Review envelopes, spot overspending, and adjust the plan before the next swipe.',
    missions: [
      'Glance at safe-to-spend and upcoming bills.',
      'Shift envelopes if any glow red.',
      'Log one gratitude moment about money momentum.',
    ],
    color: 'emerald',
    xp: 35,
  },
  {
    id: 'savings-sprint',
    label: 'Savings sprint boost',
    summary: 'Move micro-amounts into goals, celebrate milestones, and preview how close you are.',
    missions: [
      'Send a £10 micro-transfer to the highlighted goal.',
      'Log why the goal matters in one sentence.',
      'Share a quick win sticker with your accountability buddy.',
    ],
    color: 'sky',
    xp: 35,
  },
  {
    id: 'debt-accelerator',
    label: 'Debt accelerator lab',
    summary: 'Check payoff ETA, plan the next extra payment, and defuse surprise charges.',
    missions: [
      'Confirm the minimums are covered for the week.',
      'Queue or schedule the next top-up payment.',
      'Scan transactions for anything unexpected to tag.',
    ],
    color: 'violet',
    xp: 35,
  },
]

const cadenceOptions: CadenceOption[] = [
  {
    id: 'daily',
    label: 'Daily glow (5 min)',
    description: 'Micro check-in that keeps the streak alive with tiny wins.',
    rhythm: 'Every day',
  },
  {
    id: 'weekday',
    label: 'Weekday rhythm (10 min)',
    description: 'Lock in Monday–Friday reviews so weekends stay flexible.',
    rhythm: 'Weekdays',
  },
  {
    id: 'pulse-pair',
    label: 'Twice weekly power-up',
    description: 'Choose two anchor days to review, adjust, and celebrate.',
    rhythm: 'Mondays & Thursdays',
  },
]

const timeWindowOptions: TimeWindowOption[] = [
  {
    id: 'morning-window',
    label: '7:15 AM – 8:00 AM',
    description: 'Stack with your first coffee or commute pause.',
    icon: '☀️',
  },
  {
    id: 'midday-window',
    label: '12:30 PM – 1:00 PM',
    description: 'Pair with a lunch reset to spark afternoon energy.',
    icon: '🌤️',
  },
  {
    id: 'evening-window',
    label: '8:30 PM – 9:00 PM',
    description: 'Unwind, log the day, and prep tomorrow.',
    icon: '🌙',
  },
]

const anchorOptions: AnchorOption[] = [
  {
    id: 'after-coffee',
    label: 'After my first coffee',
    description: 'Habit stacks with a warm mug and quiet focus.',
  },
  {
    id: 'post-standup',
    label: 'After the morning stand-up',
    description: 'Slide into momentum right after your team sync.',
  },
  {
    id: 'post-dinner',
    label: 'After dinner cleanup',
    description: 'Tidy the kitchen, tidy the finances.',
  },
]

const automationOptions: MultiSelectOption[] = [
  {
    id: 'snapshot-reminder',
    label: 'WalletHabit snapshot reminder',
    description: 'Receive a quick push summary of cash, envelopes, and streak.',
    icon: '🔔',
  },
  {
    id: 'auto-transfer',
    label: 'Auto-transfer suggestion',
    description: 'Let Copilot queue micro-transfers when surplus appears.',
    icon: '🤖',
  },
  {
    id: 'calendar-block',
    label: 'Calendar block sync',
    description: 'Drops the session into your calendar with focus notes.',
    icon: '🗓️',
  },
]

const supportOptions: MultiSelectOption[] = [
  {
    id: 'buddy-checkin',
    label: 'Accountability buddy ping',
    description: 'Send a quick sticker to your chosen teammate after each session.',
    icon: '🤝',
  },
  {
    id: 'community-post',
    label: 'Community highlight',
    description: 'Share one win in the Habit Party channel once a week.',
    icon: '🎉',
  },
  {
    id: 'coach-reflection',
    label: 'Coach reflection prompt',
    description: 'WalletHabit Copilot nudges a reflection question every Friday.',
    icon: '🧠',
  },
]

const rewardOptions: RewardOption[] = [
  {
    id: 'ritual-playlist',
    label: 'Ritual playlist unlock',
    description: 'Hit play on a curated focus playlist once the session finishes.',
    icon: '🎧',
  },
  {
    id: 'friday-treat',
    label: 'Friday treat envelope',
    description: 'Move £5 into a fun envelope for the weekend when streaks hit 4.',
    icon: '🍩',
  },
  {
    id: 'evening-reset',
    label: 'Evening reset ritual',
    description: 'Swap to cosy lighting and unwind with a show after the session.',
    icon: '🕯️',
  },
]

const defaultState: DesignerState = {
  personaId: 'sunrise-sage',
  habitName: 'Money warm-up',
  motivation: 'Feel calm and intentional before making spending decisions.',
  focusId: 'budget-pulse',
  cadenceId: 'daily',
  timeWindowId: 'morning-window',
  anchorId: 'after-coffee',
  durationMinutes: 10,
  automationIds: ['snapshot-reminder'],
  supportIds: ['buddy-checkin'],
  rewardId: 'ritual-playlist',
  celebrationMessage: 'Launch Money warm-up this week and celebrate every streak with Ember!'
}

export default function HabitDesigner() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [state, setState] = useState<DesignerState>(defaultState)
  const [showCelebration, setShowCelebration] = useState(false)

  const currentStep = steps[activeStepIndex]

  const selectedPersona = useMemo(
    () => personaOptions.find((option) => option.id === state.personaId) ?? personaOptions[0],
    [state.personaId]
  )

  const selectedFocus = useMemo(
    () => focusOptions.find((option) => option.id === state.focusId) ?? focusOptions[0],
    [state.focusId]
  )

  const selectedCadence = useMemo(
    () => cadenceOptions.find((option) => option.id === state.cadenceId) ?? cadenceOptions[0],
    [state.cadenceId]
  )

  const selectedTimeWindow = useMemo(
    () => timeWindowOptions.find((option) => option.id === state.timeWindowId) ?? timeWindowOptions[0],
    [state.timeWindowId]
  )

  const selectedAnchor = useMemo(
    () => anchorOptions.find((option) => option.id === state.anchorId) ?? anchorOptions[0],
    [state.anchorId]
  )

  const selectedReward = useMemo(
    () => rewardOptions.find((option) => option.id === state.rewardId) ?? rewardOptions[0],
    [state.rewardId]
  )

  const xp = useMemo(() => {
    const base = state.personaId ? 40 : 0
    const nameXp = state.habitName.trim().length > 0 ? 12 : 0
    const motivationXp = state.motivation.trim().length > 0 ? 10 : 0
    const focusXp = state.focusId ? 25 : 0
    const cadenceXp = state.cadenceId ? 10 : 0
    const timeWindowXp = state.timeWindowId ? 10 : 0
    const anchorXp = state.anchorId ? 10 : 0
    const automationXp = state.automationIds.length * 6
    const supportXp = state.supportIds.length * 8
    const rewardXp = state.rewardId ? 12 : 0
    const celebrationXp = state.celebrationMessage.trim().length > 0 ? 6 : 0
    const launchBonus = showCelebration ? 30 : 0

    return (
      base +
      nameXp +
      motivationXp +
      focusXp +
      cadenceXp +
      timeWindowXp +
      anchorXp +
      automationXp +
      supportXp +
      rewardXp +
      celebrationXp +
      launchBonus
    )
  }, [state, showCelebration])

  const xpPerLevel = 120
  const level = Math.max(1, Math.floor(xp / xpPerLevel) + 1)
  const levelNames = ['Newcomer Navigator', 'Momentum Builder', 'Habit Architect', 'Legendary Steward']
  const levelName = levelNames[Math.min(levelNames.length - 1, level - 1)]
  const xpProgress = xp % xpPerLevel
  const xpPercent = Math.min(100, Math.round((xpProgress / xpPerLevel) * 100))
  const xpToNext = xpPerLevel - xpProgress

  const questStatus = xpPercent === 0 ? 'Fresh level unlocked!' : `${xpToNext} XP to level ${level + 1}`

  const completion = useMemo(
    () => ({
      persona: state.habitName.trim().length > 0 && state.motivation.trim().length > 0,
      blueprint:
        !!state.focusId &&
        !!state.cadenceId &&
        !!state.timeWindowId &&
        !!state.anchorId &&
        state.durationMinutes > 0,
      support: state.supportIds.length > 0 && !!state.rewardId,
      review: showCelebration,
    }),
    [state, showCelebration]
  )

  const isReadyToLaunch = completion.persona && completion.blueprint && completion.support
  const isLastStep = currentStep.id === 'review'

  const stepStatuses = useMemo(
    () =>
      steps.map((step, index) => {
        if (completion[step.id]) {
          return { step, status: 'complete' as const }
        }

        if (index === activeStepIndex) {
          return { step, status: 'current' as const }
        }

        return { step, status: 'upcoming' as const }
      }),
    [activeStepIndex, completion]
  )

  const questNarrative = useMemo(() => {
    const personaTag = selectedPersona.label
    const focusTag = selectedFocus.label.toLowerCase()
    const timeTag = selectedTimeWindow.label
    const anchorTag = selectedAnchor.label.toLowerCase()

    return `You are the ${personaTag} guiding a ${focusTag} ritual each ${selectedCadence.rhythm.toLowerCase()} at ${timeTag}. Anchor it ${anchorTag} and let ${selectedPersona.companion} celebrate every win.`
  }, [selectedPersona, selectedFocus, selectedTimeWindow, selectedAnchor, selectedCadence])

  const scheduleSamples = useMemo(() => {
    const anchorLabel = selectedAnchor.label

    if (selectedCadence.id === 'daily') {
      return [
        { day: 'Tomorrow', detail: `${selectedTimeWindow.label} • ${anchorLabel}` },
        { day: 'In 3 days', detail: 'Midweek reflection • Celebrate streak badges' },
      ]
    }

    if (selectedCadence.id === 'weekday') {
      return [
        { day: 'Next weekday', detail: `${selectedTimeWindow.label} • ${anchorLabel}` },
        { day: 'Friday', detail: 'Weekly recap • Send buddy highlight' },
      ]
    }

    return [
      { day: 'Monday', detail: `${selectedTimeWindow.label} • ${anchorLabel}` },
      { day: 'Thursday', detail: 'Momentum boost • Run automation check' },
    ]
  }, [selectedCadence, selectedAnchor, selectedTimeWindow])

  const toggleAutomation = (id: string) => {
    setState((prev) => {
      const exists = prev.automationIds.includes(id)
      return {
        ...prev,
        automationIds: exists ? prev.automationIds.filter((item) => item !== id) : [...prev.automationIds, id],
      }
    })
  }

  const toggleSupport = (id: string) => {
    setState((prev) => {
      const exists = prev.supportIds.includes(id)
      return {
        ...prev,
        supportIds: exists ? prev.supportIds.filter((item) => item !== id) : [...prev.supportIds, id],
      }
    })
  }

  const goToStep = (index: number) => {
    setActiveStepIndex(index)
  }

  const handleNext = () => {
    if (isLastStep) {
      if (isReadyToLaunch) {
        setShowCelebration(true)
      }
      return
    }

    setActiveStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setActiveStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const renderPersonaStep = () => (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {personaOptions.map((persona) => {
          const isSelected = persona.id === state.personaId
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => setState((prev) => ({ ...prev, personaId: persona.id }))}
              className={`relative flex h-full flex-col gap-3 rounded-3xl border bg-gradient-to-br p-5 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${persona.gradient} ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-300' : 'border-slate-200 hover:border-emerald-200'}`}
            >
              <span className="text-3xl" aria-hidden>
                {persona.emoji}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold text-navy">{persona.label}</span>
                <p className="text-sm text-navy/70">{persona.description}</p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/60">{persona.highlight}</p>
              <div className="mt-auto inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {persona.companion}
              </div>
              {isSelected ? (
                <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Selected
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-navy">Quest name</span>
          <input
            value={state.habitName}
            onChange={(event) => setState((prev) => ({ ...prev, habitName: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-navy shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="e.g. Weekly Money Pulse"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-navy">Why this matters</span>
          <input
            value={state.motivation}
            onChange={(event) => setState((prev) => ({ ...prev, motivation: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Keep tabs on spending with a calm start"
          />
        </label>
      </div>

      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-inner">
        <p className="text-sm text-emerald-900">{questNarrative}</p>
      </div>
    </div>
  )

  const renderBlueprintStep = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Pick your core mission</span>
        <div className="grid gap-4 lg:grid-cols-3">
          {focusOptions.map((focus) => {
            const isSelected = focus.id === state.focusId
            const borderClass = isSelected ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-slate-200 hover:border-emerald-200'
            return (
              <button
                key={focus.id}
                type="button"
                onClick={() => setState((prev) => ({ ...prev, focusId: focus.id }))}
                className={`flex h-full flex-col gap-3 rounded-3xl border bg-white p-5 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${borderClass}`}
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {focus.label}
                </span>
                <p className="text-sm text-navy/70">{focus.summary}</p>
                <ul className="mt-2 space-y-2 text-xs text-navy/60">
                  {focus.missions.map((mission) => (
                    <li key={mission} className="flex items-start gap-2">
                      <span aria-hidden className="mt-0.5 text-emerald-500">
                        •
                      </span>
                      <span>{mission}</span>
                    </li>
                  ))}
                </ul>
                {isSelected ? (
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    +{focus.xp} XP to your quest log
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {cadenceOptions.map((option) => {
          const isSelected = option.id === state.cadenceId
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setState((prev) => ({ ...prev, cadenceId: option.id }))}
              className={`flex flex-col gap-2 rounded-3xl border bg-white p-4 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-emerald-200'}`}
            >
              <span className="text-sm font-semibold text-navy">{option.label}</span>
              <p className="text-sm text-navy/70">{option.description}</p>
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{option.rhythm}</span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {timeWindowOptions.map((option) => {
            const isSelected = option.id === state.timeWindowId
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setState((prev) => ({ ...prev, timeWindowId: option.id }))}
                className={`flex flex-col gap-2 rounded-3xl border bg-white p-4 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-emerald-200'}`}
              >
                <span className="text-xl" aria-hidden>
                  {option.icon}
                </span>
                <span className="text-sm font-semibold text-navy">{option.label}</span>
                <p className="text-xs text-navy/70">{option.description}</p>
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stack it to stick it</span>
          {anchorOptions.map((option) => {
            const isSelected = option.id === state.anchorId
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setState((prev) => ({ ...prev, anchorId: option.id }))}
                className={`flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left text-sm transition ${isSelected ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-navy hover:border-emerald-200'}`}
              >
                <span className="font-semibold">{option.label}</span>
                <span className="text-xs text-navy/60">{option.description}</span>
              </button>
            )
          })}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</span>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={state.durationMinutes}
              onChange={(event) =>
                setState((prev) => ({ ...prev, durationMinutes: Number(event.target.value) }))
              }
              className="w-full accent-emerald-500"
            />
            <span className="text-sm font-medium text-navy">{state.durationMinutes} minutes per session</span>
          </label>
        </div>
      </div>
    </div>
  )

  const selectedAutomations = useMemo(
    () => automationOptions.filter((option) => state.automationIds.includes(option.id)),
    [state.automationIds]
  )

  const selectedSupports = useMemo(
    () => supportOptions.filter((option) => state.supportIds.includes(option.id)),
    [state.supportIds]
  )

  const timelinePreview = useMemo(() => {
    const missions = selectedFocus.missions
    const firstMission = missions[0]
    const secondMission = missions[1]
    const rewardTitle = selectedReward.label

    return [
      {
        label: 'T-1 min',
        detail: `Open WalletHabit snapshot and scan the dashboard widgets you pinned.`,
      },
      {
        label: 'T+0 min',
        detail: firstMission,
      },
      {
        label: `T+${Math.max(3, Math.min(state.durationMinutes, 8))} min`,
        detail: secondMission ?? 'Log one insight so the future you remembers the win.',
      },
      {
        label: `T+${state.durationMinutes} min`,
        detail: `Trigger ${rewardTitle.toLowerCase()} and log a streak note.`,
      },
    ]
  }, [selectedFocus, selectedReward, state.durationMinutes])

  const renderSupportStep = () => (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Automations</span>
          <div className="space-y-3">
            {automationOptions.map((option) => {
              const isActive = state.automationIds.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleAutomation(option.id)}
                  className={`flex w-full items-start gap-3 rounded-3xl border px-4 py-3 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
                    isActive ? 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200' : 'border-slate-200 bg-white text-navy hover:border-emerald-200'
                  }`}
                >
                  <span className="text-xl" aria-hidden>
                    {option.icon}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{option.label}</span>
                    <p className="text-xs text-navy/60">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Accountability allies</span>
          <div className="space-y-3">
            {supportOptions.map((option) => {
              const isActive = state.supportIds.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleSupport(option.id)}
                  className={`flex w-full items-start gap-3 rounded-3xl border px-4 py-3 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
                    isActive ? 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200' : 'border-slate-200 bg-white text-navy hover:border-emerald-200'
                  }`}
                >
                  <span className="text-xl" aria-hidden>
                    {option.icon}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{option.label}</span>
                    <p className="text-xs text-navy/60">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Celebration & rewards</span>
          <div className="grid gap-3 sm:grid-cols-3">
            {rewardOptions.map((option) => {
              const isSelected = state.rewardId === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, rewardId: option.id }))}
                  className={`flex flex-col gap-2 rounded-2xl border px-4 py-3 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
                    isSelected ? 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200' : 'border-slate-200 bg-white text-navy hover:border-emerald-200'
                  }`}
                >
                  <span className="text-xl" aria-hidden>
                    {option.icon}
                  </span>
                  <span className="text-sm font-semibold">{option.label}</span>
                  <p className="text-xs text-navy/60">{option.description}</p>
                </button>
              )
            })}
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Victory message</span>
            <textarea
              value={state.celebrationMessage}
              onChange={(event) => setState((prev) => ({ ...prev, celebrationMessage: event.target.value }))}
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="e.g. Confetti drop! Text Nova and log the win."
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-inner">
          <h3 className="text-base font-semibold text-emerald-900">Support preview</h3>
          <p className="text-sm text-emerald-900/80">
            {selectedSupports.length > 0
              ? `You’ll celebrate with ${selectedSupports.map((item) => item.label.toLowerCase()).join(', ')}.`
              : 'Add at least one ally so the habit feels supported.'}
          </p>
          <p className="text-sm text-emerald-900/80">
            {selectedAutomations.length > 0
              ? `Automations active: ${selectedAutomations.map((item) => item.label.toLowerCase()).join(', ')}.`
              : 'Switch on a WalletHabit automation to make progress effortless.'}
          </p>
          <ul className="space-y-2 text-xs text-emerald-900/70">
            {scheduleSamples.map((sample) => (
              <li key={sample.day} className="flex items-start gap-2">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                <span>
                  <span className="font-semibold">{sample.day}:</span> {sample.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-navy">{state.habitName}</h3>
            <p className="text-sm text-navy/70">{state.motivation}</p>
          </div>
          <div className="inline-flex flex-col items-end gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Level {level}</span>
            <span className="text-sm font-semibold text-emerald-900">{levelName}</span>
            <span className="text-xs text-emerald-900/70">{questStatus}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Persona</span>
            <p className="mt-1 text-sm font-semibold text-navy">{selectedPersona.label}</p>
            <p className="text-xs text-navy/60">{selectedPersona.highlight}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Focus</span>
            <p className="mt-1 text-sm font-semibold text-navy">{selectedFocus.label}</p>
            <p className="text-xs text-navy/60">{selectedFocus.summary}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cadence</span>
            <p className="mt-1 text-sm font-semibold text-navy">{selectedCadence.label}</p>
            <p className="text-xs text-navy/60">{selectedTimeWindow.label} • {selectedAnchor.label}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reward</span>
            <p className="mt-1 text-sm font-semibold text-navy">{selectedReward.label}</p>
            <p className="text-xs text-navy/60">{selectedReward.description}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-base font-semibold text-navy">Quest timeline</h4>
        <ul className="mt-4 space-y-3 text-sm text-navy/80">
          {timelinePreview.map((item) => (
            <li key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3">
              <span className="mt-0.5 inline-flex min-w-[70px] justify-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {item.label}
              </span>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {showCelebration ? (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-100 via-white to-sky-100 p-6 shadow-lg">
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/40" aria-hidden />
          <div className="absolute -right-12 bottom-0 h-28 w-28 rounded-full bg-sky-200/40" aria-hidden />
          <div className="relative flex flex-col gap-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Quest launched</span>
            <h4 className="text-2xl font-bold text-navy">Streak celebration unlocked!</h4>
            <p className="text-sm text-navy/70">{state.celebrationMessage}</p>
            <p className="text-xs uppercase tracking-wide text-emerald-700">+30 XP launch bonus</p>
          </div>
        </div>
      ) : null}
    </div>
  )

  const renderActiveStep = () => {
    switch (currentStep.id) {
      case 'persona':
        return renderPersonaStep()
      case 'blueprint':
        return renderBlueprintStep()
      case 'support':
        return renderSupportStep()
      case 'review':
        return renderReviewStep()
      default:
        return null
    }
  }

  const nextLabel = isLastStep ? (showCelebration ? 'Quest launched' : 'Launch quest') : 'Next step'
  const canAdvance = isLastStep ? isReadyToLaunch && !showCelebration : true

  return (
    <div className="flex flex-1 flex-col gap-10 pb-20">
      <header className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Habit designer beta
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">Design a habit that plays like a game</h1>
            <p className="text-sm text-navy/70 sm:text-base">Craft a ritual that unlocks streaks, XP, and calm momentum in your WalletHabit dashboard.</p>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-emerald-200 bg-white/80 p-4 shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Level</span>
              <span className="text-lg font-semibold text-emerald-700">{level}</span>
              <span className="text-xs text-emerald-700/70">{levelName}</span>
            </div>
            <div className="h-16 w-px bg-emerald-100" aria-hidden />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>XP progress</span>
                <span>{xpPercent}%</span>
              </div>
              <div className="h-2 w-40 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${xpPercent}%` }} />
              </div>
              <span className="text-xs text-emerald-700/80">{questStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto">
          {stepStatuses.map(({ step, status }, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(index)}
              className={`flex min-w-[160px] flex-col gap-1 rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
                status === 'complete'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : status === 'current'
                  ? 'border-emerald-400 bg-white text-emerald-900 shadow-sm'
                  : 'border-slate-200 bg-white text-navy/60 hover:border-emerald-200'
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wide">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </span>
              <span className="font-semibold">{step.label}</span>
              <span className="text-xs text-navy/60">{step.caption}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {renderActiveStep()}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={activeStepIndex === 0}
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                activeStepIndex === 0
                  ? 'cursor-not-allowed border-slate-200 text-slate-400'
                  : 'border-slate-200 text-navy hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canAdvance}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition ${
                canAdvance ? 'bg-emerald-600 hover:bg-emerald-500' : 'cursor-not-allowed bg-slate-300'
              }`}
            >
              {nextLabel}
              {!isLastStep ? <span aria-hidden>→</span> : null}
            </button>
          </div>
        </section>

        <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-navy">Quest log</h2>
            <ul className="space-y-3">
              {stepStatuses.map(({ step, status }) => (
                <li key={step.id} className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      status === 'complete'
                        ? 'bg-emerald-500 text-white'
                        : status === 'current'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                    aria-hidden
                  >
                    {status === 'complete' ? '✓' : status === 'current' ? '•' : indexLabel(step.id)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-navy">{step.label}</span>
                    <span className="text-xs text-navy/60">{step.caption}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Companion tip</span>
            <p className="mt-2 text-sm text-emerald-900/80">{selectedPersona.companion}</p>
            <p className="mt-2 text-xs text-emerald-900/70">{selectedPersona.highlight}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-navy">Upcoming check-ins</h3>
            <ul className="space-y-2 text-sm text-navy/70">
              {scheduleSamples.map((sample) => (
                <li key={sample.day} className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2">
                  <span className="font-semibold text-navy">{sample.day}</span>
                  <span className="text-xs text-navy/60">{sample.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

function indexLabel(stepId: StepId) {
  const index = steps.findIndex((step) => step.id === stepId)
  if (index === -1) return '•'
  const label = index + 1
  return label < 10 ? `0${label}` : String(label)
}

