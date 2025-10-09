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

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-brand">Investment autopilot lab</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Grow long-term wealth with calm, automated moves</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          Shape your ideal portfolio mix, set autopilot contribution boosts, and preview how consistency compounding over a
          decade moves net worth. Supabase persistence will lock in policy settings and surface drift alerts once secrets go
          live.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          Autopilot engine — ready for Supabase-backed persistence
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.5fr,1.5fr] xl:grid-cols-[1.4fr,1.6fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Choose your risk posture</h2>
            <p className="text-sm text-slate-600">
              Dial the slider to reflect how much volatility you are comfortable riding through. WalletHabit will match this to
              allocation bands and surface rebalance prompts before drift gets uncomfortable.
            </p>
            <div className="flex items-center gap-4">
              <input
                className="flex-1"
                type="range"
                min={1}
                max={5}
                step={1}
                value={riskLevel}
                onChange={(event) => setRiskLevel(Number(event.target.value))}
              />
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
                <span className="font-semibold text-slate-900">{profile.label}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">{profile.tagline}</p>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Expected return</p>
                <p className="text-base font-semibold text-emerald-600">{(profile.expectedReturn * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Volatility band</p>
                <p className="text-base font-semibold text-slate-900">{profile.volatility}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Monthly autopilot</h3>
            <p className="text-sm text-slate-600">
              Set the base amount you want automatically invested. Layer in contribution boosts to route fresh cash toward the
              plan without manual effort.
            </p>
            <div className="flex items-center gap-4">
              <input
                className="flex-1"
                type="range"
                min={250}
                max={1500}
                step={50}
                value={monthlyContribution}
                onChange={(event) => setMonthlyContribution(Number(event.target.value))}
              />
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm">
                <span className="font-semibold text-slate-900">{currencyFormatter.format(monthlyContribution)}</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {autopilotModes.map((mode) => {
                const isActive = mode.id === autopilot.id
                return (
                  <button
                    key={mode.id}
                    onClick={() => setAutopilotMode(mode.id)}
                    className={[
                      'flex h-full flex-col gap-2 rounded-2xl border p-4 text-left text-sm transition',
                      isActive
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-slate-900',
                    ].join(' ')}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{mode.label}</p>
                    <p>{mode.description}</p>
                    <div className="mt-auto flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs">
                      <span className="font-semibold text-slate-900">+{currencyFormatter.format(mode.boost)}</span>
                      <span className="font-semibold text-emerald-600">/mo</span>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700">
              <span>Total autopilot contribution</span>
              <span>{currencyFormatter.format(targetContribution)}</span>
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Target allocation bands</h2>
          <p className="text-sm text-slate-600">
            These percentages guide rebalancing nudges. Once account connections are live, WalletHabit will compare actual
            holdings to these ranges and raise Copilot suggestions when drift widens.
          </p>
          <div className="space-y-4">
            {allocationEntries.map((asset) => (
              <div key={asset.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{asset.label}</p>
                    <p className="text-xs text-slate-500">{asset.description}</p>
                  </div>
                  <span className="text-base font-semibold text-slate-900">{asset.percent}%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${asset.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700">
            Supabase will store these targets and run background jobs to flag drift in the dashboard once integrations light up.
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr,1.4fr]">
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">10-year projection</h2>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-700">
              Horizon: {horizonYears} years
            </div>
          </div>
          <p className="text-sm text-slate-600">
            This simple projection assumes contributions stay consistent and returns follow the selected risk posture&apos;s average.
            Real performance will vary, but the trend highlights how monthly habits compound.
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Total contributions</th>
                  <th className="px-4 py-3">Projected balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {projection.map((row) => (
                  <tr key={row.year} className={row.year === horizonYears ? 'bg-emerald-50/80 font-semibold text-emerald-700' : ''}>
                    <td className="px-4 py-3">Year {row.year}</td>
                    <td className="px-4 py-3">{currencyFormatter.format(row.contributions)}</td>
                    <td className="px-4 py-3">{currencyFormatter.format(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {decadeOutcome && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Staying the course yields {currencyFormatter.format(decadeOutcome.balance)} after {horizonYears} years with
              {currencyFormatter.format(targetContribution * 12)} contributed annually. Future versions will overlay scenario
              comparisons and inflation adjustments once data stores connect.
            </div>
          )}
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Strategy spotlights</h3>
          <div className="space-y-3">
            {playbookSpotlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-xs text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
            Copilot will translate these into personalised nudges using your contribution history and upcoming goals.
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr,1.6fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Momentum signals to watch</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {momentumSignals.map((signal) => (
              <li key={signal} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></span>
                <p>{signal}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Rollout checklist</h3>
          <div className="space-y-3">
            {rolloutMilestones.map((milestone) => (
              <div key={milestone.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>{milestone.label}</span>
                  <span className="text-emerald-600">{milestone.timeframe}</span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{milestone.description}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
            Supabase + Plaid integration workstreams will unlock automation. Until then, use this checklist for manual pilots.
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Readiness checklist</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {readinessChecklist.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
