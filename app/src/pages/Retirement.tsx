import { useMemo, useState } from 'react'

const lifestyleArchetypes = [
  {
    id: 'lean',
    label: 'Lean coast',
    description:
      'Keep core comforts covered with intentional housing, healthcare, and travel trade-offs while prioritising flexibility.',
    monthlyNeed: 3800,
    legacy: 'Fund experiences first, then lightweight legacy gifts.',
  },
  {
    id: 'balanced',
    label: 'Balanced independence',
    description:
      'Blend purposeful work breaks, slow travel, and passion projects while maintaining robust healthcare and giving plans.',
    monthlyNeed: 5200,
    legacy: 'Support family milestones and recurring charitable pledges.',
  },
  {
    id: 'abundant',
    label: 'Abundant impact',
    description:
      'Pursue big adventures, family sabbaticals, and philanthropic moonshots with room to handle curveballs gracefully.',
    monthlyNeed: 7600,
    legacy: 'Structure donor-advised fund and intergenerational wealth vehicles.',
  },
] as const

const returnModes = [
  {
    id: 'steady',
    label: 'Steady compounding',
    rate: 0.055,
    volatility: 'Low-medium',
    description: 'Diversified index blend with 60/40 tilt and disciplined rebalancing cadence.',
  },
  {
    id: 'accelerated',
    label: 'Accelerated glide',
    rate: 0.065,
    volatility: 'Medium',
    description: 'Increase equity weight through the final accumulation years before tapering risk.',
  },
  {
    id: 'guarded',
    label: 'Guarded resilience',
    rate: 0.045,
    volatility: 'Low',
    description: 'Prioritise capital preservation, liability matching, and treasury ladders.',
  },
] as const

type LifestyleId = (typeof lifestyleArchetypes)[number]['id']
type ReturnModeId = (typeof returnModes)[number]['id']

type ProjectionRow = {
  age: number
  balance: number
  contributions: number
}

const catchUpMoves = [
  {
    title: 'Mega backdoor funnels',
    narrative:
      'Max traditional + Roth buckets, then route surplus to taxable brokerage with automated tax-loss harvesting rules.',
  },
  {
    title: 'Healthcare cost shields',
    narrative: 'Prefund HSAs and long-term care reserves to soften inflation spikes in later decades.',
  },
  {
    title: 'Bridge income runway',
    narrative: 'Model freelance or sabbatical income so you can delay withdrawals when markets wobble.',
  },
]

const readinessChecklist = [
  'Document retirement lifestyle narratives and legacy intentions with partners or advisors.',
  'Audit current account mix (taxable, tax-deferred, Roth) for future tax-bracket flexibility.',
  'Map annual spending needs with inflation adjustments inside WalletHabit goals + budget tools.',
  'Line up Supabase-linked rituals to review investment policy and rebalance thresholds annually.',
]

const rolloutMilestones = [
  {
    label: 'Retirement schema',
    timeframe: 'Week 1',
    description: 'Model retirement readiness inputs + projections in Supabase with audit history.',
  },
  {
    label: 'Goal linking',
    timeframe: 'Week 2',
    description: 'Attach retirement targets to savings + investing labs for unified funding stories.',
  },
  {
    label: 'Copilot coaching',
    timeframe: 'Week 3',
    description: 'Use WalletHabit Copilot to surface plan gaps, tax strategies, and catch-up prompts.',
  },
  {
    label: 'Plaid enrichment',
    timeframe: 'Week 4',
    description: 'Stream brokerage balances through Plaid to track drift vs. readiness benchmarks.',
  },
]

const momentumSignals = [
  'Projected withdrawal income covers 90%+ of lifestyle needs with inflation buffers.',
  'Cash cushion maintains 18-24 months of spending to weather market downturns gracefully.',
  'Investment autopilot boosts trigger when surplus cash or bonuses arrive.',
  'Annual readiness review ritual logged with updated assumptions and partner alignment.',
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function buildProjection({
  currentAge,
  retirementAge,
  currentBalance,
  monthlyContribution,
  rate,
}: {
  currentAge: number
  retirementAge: number
  currentBalance: number
  monthlyContribution: number
  rate: number
}): ProjectionRow[] {
  const years = Math.max(retirementAge - currentAge, 0)
  const rows: ProjectionRow[] = []
  const intervals = Math.max(Math.ceil(years / 5), 1)

  let balance = currentBalance

  for (let index = 0; index <= intervals; index += 1) {
    const age = Math.min(retirementAge, Math.round(currentAge + (years / intervals) * index))
    const yearsElapsed = age - currentAge
    const periods = yearsElapsed

    const compounded = currentBalance * Math.pow(1 + rate, periods)
    const contributionFutureValue =
      monthlyContribution > 0 && rate > 0
        ? monthlyContribution * 12 * ((Math.pow(1 + rate, periods) - 1) / rate)
        : monthlyContribution * 12 * periods

    balance = compounded + contributionFutureValue

    rows.push({
      age,
      balance,
      contributions: monthlyContribution * 12 * periods,
    })
  }

  return rows
}

export default function Retirement() {
  const [currentAge, setCurrentAge] = useState(34)
  const [retirementAge, setRetirementAge] = useState(58)
  const [currentBalance, setCurrentBalance] = useState(215_000)
  const [monthlyContribution, setMonthlyContribution] = useState(1_650)
  const [selectedReturnMode, setSelectedReturnMode] = useState<ReturnModeId>('steady')
  const [lifestyle, setLifestyle] = useState<LifestyleId>('balanced')

  const returnMode = useMemo(
    () => returnModes.find((item) => item.id === selectedReturnMode) ?? returnModes[0],
    [selectedReturnMode],
  )

  const lifestyleProfile = useMemo(
    () => lifestyleArchetypes.find((item) => item.id === lifestyle) ?? lifestyleArchetypes[1],
    [lifestyle],
  )

  const yearsToInvest = Math.max(retirementAge - currentAge, 0)
  const projection = useMemo(
    () =>
      buildProjection({
        currentAge,
        retirementAge,
        currentBalance,
        monthlyContribution,
        rate: returnMode.rate,
      }),
    [currentAge, currentBalance, monthlyContribution, retirementAge, returnMode.rate],
  )

  const projectedBalance = projection[projection.length - 1]?.balance ?? currentBalance
  const inflationAdjustedNeed = useMemo(() => {
    const inflationAssumption = 0.02
    return lifestyleProfile.monthlyNeed * Math.pow(1 + inflationAssumption, yearsToInvest)
  }, [lifestyleProfile.monthlyNeed, yearsToInvest])

  const safeWithdrawalRate = 0.04
  const projectedIncome = (projectedBalance * safeWithdrawalRate) / 12
  const readinessRatio = lifestyleProfile.monthlyNeed > 0 ? projectedIncome / inflationAdjustedNeed : 0
  const readinessScore = Math.min(Math.round(readinessRatio * 100), 200)
  const coveragePercent = readinessRatio > 0 ? percentageFormatter.format(Math.min(readinessRatio, 1)) : '0%'

  const timeline = useMemo(() => projection.slice(1), [projection])

  const retirementStartIncome = currencyFormatter.format(projectedIncome)
  const adjustedNeed = currencyFormatter.format(inflationAdjustedNeed)
  const gap = Math.max(inflationAdjustedNeed - projectedIncome, 0)
  const gapCopy = gap <= 0 ? 'Ready to coast — surplus covers dream scenarios.' : `${currencyFormatter.format(gap)} monthly gap to close.`

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-brand">Retirement readiness lab</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Design your glide path to work-optional life</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          Dial in lifestyle archetypes, contribution cadence, and return expectations to see how WalletHabit will coach your
          retirement runway. Once Supabase persistence lands, these assumptions sync with the investment autopilot and budget
          rituals to keep the plan alive.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand">
          <span className="inline-flex h-2 w-2 rounded-full bg-brand"></span>
          Projection sandbox — Supabase sync pending secrets
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.6fr,1.4fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Age trajectory</h2>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current age</label>
              <div className="flex items-center gap-4">
                <input
                  className="flex-1"
                  type="range"
                  min={25}
                  max={55}
                  value={currentAge}
                  onChange={(event) => setCurrentAge(Number(event.target.value))}
                />
                <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-900">
                  {currentAge}
                </span>
              </div>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target retirement age</label>
              <div className="flex items-center gap-4">
                <input
                  className="flex-1"
                  type="range"
                  min={45}
                  max={68}
                  value={retirementAge}
                  onChange={(event) => setRetirementAge(Number(event.target.value))}
                />
                <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-900">
                  {retirementAge}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Investable runway</h2>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current invested balance</label>
              <div className="flex items-center gap-4">
                <input
                  className="flex-1"
                  type="range"
                  min={50_000}
                  max={900_000}
                  step={5_000}
                  value={currentBalance}
                  onChange={(event) => setCurrentBalance(Number(event.target.value))}
                />
                <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-900">
                  {currencyFormatter.format(currentBalance)}
                </span>
              </div>

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly contributions</label>
              <div className="flex items-center gap-4">
                <input
                  className="flex-1"
                  type="range"
                  min={600}
                  max={4000}
                  step={50}
                  value={monthlyContribution}
                  onChange={(event) => setMonthlyContribution(Number(event.target.value))}
                />
                <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-900">
                  {currencyFormatter.format(monthlyContribution)} / mo
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {returnModes.map((mode) => {
              const isActive = mode.id === returnMode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedReturnMode(mode.id)}
                  className={[
                    'flex h-full flex-col gap-2 rounded-2xl border p-4 text-left text-sm transition',
                    isActive
                      ? 'border-brand bg-brand/10 text-brand-dark shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-brand/40 hover:bg-white hover:text-slate-900',
                  ].join(' ')}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{mode.label}</p>
                  <h3 className="text-base font-semibold text-slate-900">{percentageFormatter.format(mode.rate)}</h3>
                  <p className="text-xs text-slate-600">{mode.description}</p>
                  <div className="mt-auto flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs">
                    <span className="font-semibold text-slate-900">{mode.volatility}</span>
                    <span className="font-semibold text-brand">Select</span>
                  </div>
                </button>
              )
            })}
          </div>
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Readiness coverage</p>
              <h2 className="mt-1 text-4xl font-bold text-slate-900">{coveragePercent}</h2>
              <p className="mt-2 text-sm text-slate-600">Projected safe-withdrawal income at {retirementAge} covers lifestyle costs.</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand/40 bg-brand/10 text-lg font-bold text-brand">
              {readinessScore}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Projected monthly income</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{retirementStartIncome}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">Inflation-adjusted lifestyle need</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{adjustedNeed}</p>
            <p className="mt-3 text-sm text-brand-dark">{gapCopy}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lifestyle archetype</p>
            <div className="mt-2 flex flex-col gap-3">
              {lifestyleArchetypes.map((profile) => {
                const active = profile.id === lifestyleProfile.id
                return (
                  <button
                    key={profile.id}
                    onClick={() => setLifestyle(profile.id)}
                    className={[
                      'flex flex-col gap-1 rounded-xl border p-3 text-left transition',
                      active
                        ? 'border-brand bg-brand/10 text-brand-dark shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-brand/40 hover:bg-white hover:text-slate-900',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                      <span>{profile.label}</span>
                      <span>{currencyFormatter.format(profile.monthlyNeed)}/mo</span>
                    </div>
                    <p className="text-xs text-slate-600">{profile.description}</p>
                    <p className="text-xs font-medium text-slate-500">{profile.legacy}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr,1.4fr]">
        <article className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Momentum timeline</h2>
          <p className="text-sm text-slate-600">
            WalletHabit will chart progress every few years once bank and brokerage feeds sync. Use this projection to anchor
            check-ins until live balances flow through Plaid.
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Projected balance</th>
                  <th className="px-4 py-3">Total contributions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeline.map((row) => (
                  <tr key={row.age}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.age}</td>
                    <td className="px-4 py-3 text-slate-600">{currencyFormatter.format(row.balance)}</td>
                    <td className="px-4 py-3 text-slate-600">{currencyFormatter.format(row.contributions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Catch-up priorities</h2>
          <ul className="mt-2 flex flex-col gap-3 text-sm text-slate-600">
            {catchUpMoves.map((item) => (
              <li key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-600">{item.narrative}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Readiness checklist</h3>
          <ul className="flex flex-col gap-3 text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Rollout milestones</h3>
          <ul className="flex flex-col gap-3 text-slate-600">
            {rolloutMilestones.map((milestone) => (
              <li key={milestone.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{milestone.timeframe}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{milestone.label}</p>
                <p className="text-xs text-slate-600">{milestone.description}</p>
              </li>
            ))}
          </ul>
        </article>
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Momentum signals</h3>
          <ul className="flex flex-col gap-3 text-slate-600">
            {momentumSignals.map((signal) => (
              <li key={signal} className="flex gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand"></span>
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
