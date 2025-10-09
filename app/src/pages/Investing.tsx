import { useMemo, useState } from 'react'

const assetClasses = [
  {
    id: 'usEquities',
    label: 'US total market',
    description: 'Broad exposure across large and mid-cap companies to capture primary growth.',
  },
  {
    id: 'international',
    label: 'International equity',
    description: 'Developed + emerging markets to diversify currency and economic cycles.',
  },
  {
    id: 'bonds',
    label: 'Bond ladder',
    description: 'Blend of intermediate treasuries and investment-grade corporates for ballast.',
  },
  {
    id: 'cash',
    label: 'High-yield cash',
    description: 'Short-term reserves to fund opportunities and protect against drawdowns.',
  },
  {
    id: 'alternatives',
    label: 'Alternatives',
    description: 'Low-correlation assets (REITs, managed futures) for volatility dampening.',
  },
]

const riskProfiles = [
  {
    value: 1,
    label: 'Capital defender',
    tagline: 'Protect principal first, earn modest growth.',
    expectedReturn: 0.035,
    volatility: 'Low',
    allocations: {
      usEquities: 25,
      international: 10,
      bonds: 50,
      cash: 12,
      alternatives: 3,
    },
  },
  {
    value: 2,
    label: 'Steady builder',
    tagline: 'Balance resilience with measured upside.',
    expectedReturn: 0.047,
    volatility: 'Low-medium',
    allocations: {
      usEquities: 35,
      international: 15,
      bonds: 38,
      cash: 8,
      alternatives: 4,
    },
  },
  {
    value: 3,
    label: 'Core growth',
    tagline: 'Lean into equities while keeping a safety sleeve.',
    expectedReturn: 0.061,
    volatility: 'Medium',
    allocations: {
      usEquities: 42,
      international: 18,
      bonds: 30,
      cash: 6,
      alternatives: 4,
    },
  },
  {
    value: 4,
    label: 'Accelerated momentum',
    tagline: 'Prioritise appreciation with guardrails for turbulence.',
    expectedReturn: 0.075,
    volatility: 'Medium-high',
    allocations: {
      usEquities: 48,
      international: 22,
      bonds: 20,
      cash: 5,
      alternatives: 5,
    },
  },
  {
    value: 5,
    label: 'Trailblazer',
    tagline: 'Maximise growth with intentional rebalancing cadence.',
    expectedReturn: 0.086,
    volatility: 'High',
    allocations: {
      usEquities: 52,
      international: 25,
      bonds: 15,
      cash: 4,
      alternatives: 4,
    },
  },
]

const autopilotModes = [
  {
    id: 'steady',
    label: 'Steady autopilot',
    boost: 0,
    description: 'Keep monthly contributions level while monitoring drawdown guardrails.',
  },
  {
    id: 'accelerate',
    label: 'Accelerate boosts',
    boost: 150,
    description: 'Route recent income wins or freelance retainers into automated transfers.',
  },
  {
    id: 'windfall',
    label: 'Windfall surge',
    boost: 350,
    description: 'Temporarily direct tax refunds or bonuses to speed compounding.',
  },
] as const

type AutopilotModeId = (typeof autopilotModes)[number]['id']

type ProjectionRow = {
  year: number
  balance: number
  contributions: number
}

const playbookSpotlights = [
  {
    title: 'Quarterly rebalancing sprints',
    description:
      'Block 45-minute sessions at quarter end to realign allocations and capture drift back into target bands.',
  },
  {
    title: 'Increase automation signals',
    description:
      'Pair bank sync rules with Supabase alerts so raises or new invoices auto-propose contribution bumps.',
  },
  {
    title: 'Tax-advantaged sequencing',
    description:
      'Prioritise 401(k) matches, Roth IRA windows, then taxable brokerage for max flexibility and efficiency.',
  },
]

const readinessChecklist = [
  'Link primary checking + brokerage accounts to prep automated transfers.',
  'Document risk tolerance guardrails (max drawdown %, rebalance thresholds).',
  'Tag savings goals that the investment engine should eventually fund.',
  'Draft investment policy statement in Notion to align future decisions with strategy.',
]

const rolloutMilestones = [
  {
    label: 'Portfolio schema',
    timeframe: 'Week 1',
    description: 'Model holdings + contribution plans in Supabase with user ownership + audit trails.',
  },
  {
    label: 'Bank sync triggers',
    timeframe: 'Week 2',
    description: 'Map Plaid transactions to recurring contributions and detect opportunity surpluses.',
  },
  {
    label: 'AI rebalance coach',
    timeframe: 'Week 3',
    description: 'Have Copilot suggest allocation tweaks when drift exceeds guardrails or goals update.',
  },
  {
    label: 'Insights dashboard',
    timeframe: 'Week 4',
    description: 'Launch charts for net worth velocity, contribution cadence, and risk health.',
  },
]

const momentumSignals = [
  'Contribution streaks and autopilot boosts applied without manual intervention.',
  'Risk drift staying inside ±5% bands with quarterly rebalance rituals logged.',
  'Goal funding timeline shrinking as investment engine compounds contributions.',
  'Cash buffer maintained above 3 months of expenses while investing aggressively.',
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function Investing() {
  const [riskLevel, setRiskLevel] = useState(4)
  const [monthlyContribution, setMonthlyContribution] = useState(900)
  const [autopilotMode, setAutopilotMode] = useState<AutopilotModeId>('accelerate')

  const profile = useMemo(() => riskProfiles.find((item) => item.value === riskLevel) ?? riskProfiles[3], [riskLevel])
  const autopilot = useMemo(
    () => autopilotModes.find((mode) => mode.id === autopilotMode) ?? autopilotModes[1],
    [autopilotMode],
  )

  const targetContribution = useMemo(() => monthlyContribution + autopilot.boost, [monthlyContribution, autopilot])
  const startingBalance = 24000
  const horizonYears = 10

  const projection = useMemo<ProjectionRow[]>(() => {
    const rows: ProjectionRow[] = []
    let balance = startingBalance
    for (let year = 1; year <= horizonYears; year += 1) {
      balance = balance * (1 + profile.expectedReturn) + targetContribution * 12
      rows.push({
        year,
        balance: Math.round(balance),
        contributions: targetContribution * 12 * year,
      })
    }
    return rows
  }, [profile.expectedReturn, targetContribution])

  const decadeOutcome = projection[projection.length - 1]
  const allocationEntries = assetClasses.map((asset) => ({
    ...asset,
    percent: profile.allocations[asset.id as keyof typeof profile.allocations],
  }))

  const growthGenerated = decadeOutcome.balance - decadeOutcome.contributions - startingBalance
  const contributionBoost = currencyFormatter.format(autopilot.boost)
  const autopilotTarget = currencyFormatter.format(targetContribution)

  return (
    <div className="flex flex-1 flex-col gap-12 pb-20">
      <header className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-300/30 via-teal-500/20 to-slate-900/40 p-10 text-slate-900 shadow-lg">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-emerald-400/40 blur-3xl" />
          <div className="absolute bottom-0 right-[-80px] h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/80">Investment autopilot lab</p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Build a calm, confident investing rhythm with clarity and momentum
            </h1>
            <p className="max-w-3xl text-sm text-slate-800">
              Shape a diversified allocation, programme contribution boosts, and preview how discipline compounds over the next
              decade. WalletHabit will store your investment policy, watch drift, and celebrate every milestone.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-200/60 bg-white/70 p-4 backdrop-blur">
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{profile.label}</div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Expected return</p>
                  <p className="text-base font-semibold text-emerald-700">{(profile.expectedReturn * 100).toFixed(1)}%</p>
                </div>
                <span className="h-8 w-px bg-emerald-200/70" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Volatility band</p>
                  <p className="text-base font-semibold text-slate-900">{profile.volatility}</p>
                </div>
              </div>
              <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Autopilot standing by — Supabase sync next
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200/60 bg-white/70 p-4 backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contribution cadence</div>
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-3xl font-semibold text-slate-900">{autopilotTarget}</p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  +{contributionBoost} boost
                </span>
              </div>
              <p className="text-xs text-slate-600">
                WalletHabit routes windfalls into your plan automatically while protecting cash buffers.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-slate-900">Tune the investment engine</h2>
            <p className="text-sm text-slate-600">
              Use the sliders and autopilot modes to align contributions with your energy level. Micro-adjustments keep the plan
              feeling achievable while still moving the needle.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
              <div className="flex flex-col gap-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Risk posture</div>
                <p className="text-sm text-slate-600">
                  Slide to the mix that lets you stay invested through turbulence. We’ll surface nudges before drift stretches
                  outside your guardrails.
                </p>
                <div className="flex items-center gap-4">
                  <input
                    className="flex-1 accent-emerald-500"
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={riskLevel}
                    onChange={(event) => setRiskLevel(Number(event.target.value))}
                  />
                  <div className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    {profile.label}
                  </div>
                </div>
                <p className="text-xs text-slate-500">{profile.tagline}</p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly autopilot</p>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <input
                      className="flex-1 accent-emerald-500"
                      type="range"
                      min={250}
                      max={1500}
                      step={50}
                      value={monthlyContribution}
                      onChange={(event) => setMonthlyContribution(Number(event.target.value))}
                    />
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                      {currencyFormatter.format(monthlyContribution)}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {autopilotModes.map((mode) => {
                      const isActive = mode.id === autopilot.id
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setAutopilotMode(mode.id)}
                          className={[
                            'flex h-full flex-col gap-3 rounded-2xl border p-4 text-left text-sm transition',
                            isActive
                              ? 'border-emerald-400 bg-gradient-to-br from-emerald-100 via-white to-emerald-50 text-emerald-800 shadow-sm'
                              : 'border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-slate-900',
                          ].join(' ')}
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{mode.label}</p>
                          <p>{mode.description}</p>
                          <div className="mt-auto flex items-center justify-between rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-xs font-semibold">
                            <span className="text-slate-900">+{currencyFormatter.format(mode.boost)}</span>
                            <span className="text-emerald-600">/mo</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ten-year snapshot</p>
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Projected balance</p>
                    <p className="text-lg font-semibold text-slate-900">{currencyFormatter.format(decadeOutcome.balance)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Total contributions</p>
                    <p className="text-lg font-semibold text-slate-900">{currencyFormatter.format(decadeOutcome.contributions)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Growth unlocked</p>
                    <p className="text-lg font-semibold text-emerald-600">{currencyFormatter.format(growthGenerated)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {projection.map((row) => {
                  const contributionShare = Math.min(100, Math.max(8, Math.round((row.contributions / row.balance) * 100)))
                  return (
                    <div key={row.year} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Year {row.year}</span>
                        <span>{currencyFormatter.format(row.balance)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400"
                          style={{ width: `${contributionShare}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why it works</p>
                <p className="mt-2 text-sm text-slate-600">
                  Consistent deposits + automatic boosts capture market upswings while limiting decision fatigue. We’ll note when
                  rebalancing or de-risking keeps you ahead of schedule.
                </p>
              </div>
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Allocation blueprint</h2>
            <p className="text-sm text-slate-600">
              Each sleeve pulls its weight — growth engines, ballast, and liquidity — so you feel calm staying invested.
            </p>
            <div className="grid gap-3">
              {allocationEntries.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <span className="text-sm font-semibold text-emerald-600">{item.percent}%</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 via-white to-emerald-50 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Insight spotlight</p>
            <p className="mt-1">
              {profile.value >= 4
                ? 'You’re leaning into momentum. Set a quarterly calendar reminder to review guardrails and add fresh bonuses into the boost sleeve.'
                : 'Your balanced stance keeps volatility manageable. Consider toggling an accelerate boost when new income streams spin up.'}
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr,0.75fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Momentum playbook</h2>
            <p className="text-sm text-slate-600">
              Layer these rituals to keep your investing OS feeling alive, adaptive, and celebratory.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {playbookSpotlights.map((spotlight) => (
              <div
                key={spotlight.title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 shadow-sm shadow-emerald-100/30"
              >
                <p className="text-sm font-semibold text-slate-900">{spotlight.title}</p>
                <p className="text-xs text-slate-600">{spotlight.description}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-sm text-emerald-800">
            <p className="font-semibold">Confidence boost</p>
            <p className="mt-1">
              Your autopilot horizon spans {horizonYears} years. Keep the rhythm — WalletHabit will celebrate every milestone you cross.
            </p>
          </div>
        </article>

        <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Readiness checklist</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              {readinessChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Rollout roadmap</h3>
            <ul className="flex flex-col gap-4 text-sm text-slate-600">
              {rolloutMilestones.map((milestone) => (
                <li key={milestone.label} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{milestone.label}</p>
                    <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{milestone.timeframe}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{milestone.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Momentum signals</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              {momentumSignals.map((signal) => (
                <li key={signal} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-400" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}
