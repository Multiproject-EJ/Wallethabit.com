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
  const gapAmount = inflationAdjustedNeed - projectedIncome
  const gap = Math.max(gapAmount, 0)
  const gapLabel = gap <= 0 ? 'Surplus ready' : `Gap ${currencyFormatter.format(gap)}/mo`

  const readinessInsight = useMemo(() => {
    if (readinessRatio >= 1.05) {
      return {
        status: 'Coast-ready momentum',
        message: `Projected withdrawals exceed your ${lifestyleProfile.label.toLowerCase()} lifestyle by ${currencyFormatter.format(
          Math.abs(gapAmount),
        )} each month. Keep autopilot contributions steady to protect the lead.`,
      }
    }

    if (readinessRatio >= 0.9) {
      return {
        status: 'Within reach',
        message: `A consistent contribution streak and small boosts will close the remaining ${currencyFormatter.format(
          Math.max(gapAmount, 0),
        )} gap before launch.`,
      }
    }

    return {
      status: 'Build the runway',
      message:
        'Increase contributions, extend your retirement age, or adjust lifestyle assumptions to lift projected coverage before automations go live.',
    }
  }, [gapAmount, lifestyleProfile.label, readinessRatio])

  return (
    <div className="flex flex-1 flex-col gap-12 pb-20">
      <header className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-200/60 via-teal-500/25 to-navy/50 p-10 text-slate-900 shadow-lg">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-36 -top-32 h-80 w-80 rounded-full bg-emerald-300/50 blur-3xl" />
          <div className="absolute bottom-[-90px] right-[-80px] h-96 w-96 rounded-full bg-teal-300/40 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/80">Retirement readiness lab</p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Design your glide path to work-optional life</h1>
            <p className="max-w-3xl text-sm text-slate-800">
              Tune lifestyle narratives, contribution cadence, and return expectations inside this sandbox. WalletHabit will soon sync your Supabase profile, celebrate milestones, and keep the retirement autopilot honest as real balances stream in from Plaid.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="flex flex-col gap-5 rounded-2xl border border-emerald-200/70 bg-white/80 p-6 backdrop-blur">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> {coveragePercent} coverage
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-slate-700">
                  {yearsToInvest} yrs to invest
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  {returnMode.label}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200 bg-white/80 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Projected income</p>
                  <p className="text-lg font-semibold text-slate-900">{retirementStartIncome}</p>
                  <p className="text-xs text-slate-600">At age {retirementAge} using the {returnMode.label.toLowerCase()} path</p>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Lifestyle need</p>
                  <p className="text-lg font-semibold text-emerald-800">{adjustedNeed}</p>
                  <p className="text-xs text-emerald-700">{lifestyleProfile.label}</p>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200 bg-white/80 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Momentum score</p>
                  <p className="text-lg font-semibold text-slate-900">{readinessScore}</p>
                  <p className="text-xs text-slate-600">{gapLabel}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4 text-sm text-slate-700">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Return assumption</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{percentageFormatter.format(returnMode.rate)}</p>
                  <p className="text-xs text-slate-600">{returnMode.description}</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">{readinessInsight.status}</p>
                  <p className="mt-2 text-xs leading-relaxed">{readinessInsight.message}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200/70 bg-white/70 p-6 text-sm text-slate-700 backdrop-blur">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <span>Projection status</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Sandbox ready
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Work-optional horizon in {yearsToInvest} years</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                WalletHabit will turn this sandbox into your live readiness engine once Supabase connections ship. Until then, experiment freely knowing Plaid inflows, Copilot nudges, and celebration loops will meet you here soon.
              </p>
              <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4 text-xs text-slate-600">
                <p className="font-semibold uppercase tracking-wide text-slate-500">Next up</p>
                <p className="mt-2 text-sm text-slate-700">
                  Prep account linking and document your retirement statement so Copilot can personalise prompts and trigger boost rituals automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Tune your retirement runway</h2>
            <p className="text-sm text-slate-600">
              Adjust the levers that shape your readiness. These inputs will soon persist to Supabase so your dashboard, goals, and Copilot stay aligned with the plan.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Current age</span>
                <p className="text-xs text-slate-600">Where you are today anchors the projection timeline.</p>
                <div className="flex items-center gap-4">
                  <input
                    className="flex-1 accent-primary"
                    type="range"
                    min={25}
                    max={55}
                    value={currentAge}
                    onChange={(event) => setCurrentAge(Number(event.target.value))}
                  />
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    {currentAge}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Target retirement age</span>
                <p className="text-xs text-slate-600">Shift your work-optional horizon and see how coverage responds.</p>
                <div className="flex items-center gap-4">
                  <input
                    className="flex-1 accent-primary"
                    type="range"
                    min={45}
                    max={68}
                    value={retirementAge}
                    onChange={(event) => setRetirementAge(Number(event.target.value))}
                  />
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    {retirementAge}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Current invested balance</span>
                <p className="text-xs text-slate-600">Update this as your accounts sync so projections stay grounded.</p>
                <div className="flex items-center gap-4">
                  <input
                    className="flex-1 accent-primary"
                    type="range"
                    min={50_000}
                    max={900_000}
                    step={5_000}
                    value={currentBalance}
                    onChange={(event) => setCurrentBalance(Number(event.target.value))}
                  />
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    {currencyFormatter.format(currentBalance)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Monthly contributions</span>
                <p className="text-xs text-slate-600">Capture automated transfers, employer plans, and side hustle boosts.</p>
                <div className="flex items-center gap-4">
                  <input
                    className="flex-1 accent-primary"
                    type="range"
                    min={600}
                    max={4000}
                    step={50}
                    value={monthlyContribution}
                    onChange={(event) => setMonthlyContribution(Number(event.target.value))}
                  />
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    {currencyFormatter.format(monthlyContribution)} / mo
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Return paths</p>
              <p className="text-xs text-slate-600">
                Pick the glide path that mirrors your risk posture. WalletHabit will eventually lock your selection into the investing lab so your plan stays coherent.
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {returnModes.map((mode) => {
                const isActive = mode.id === returnMode.id
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedReturnMode(mode.id)}
                    className={[
                      'flex h-full flex-col gap-3 rounded-2xl border p-4 text-left text-sm transition',
                      isActive
                        ? 'border-emerald-400 bg-gradient-to-br from-emerald-100 via-white to-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-slate-200 bg-white/70 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-slate-900',
                    ].join(' ')}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{mode.label}</p>
                    <h4 className="text-base font-semibold text-slate-900">{percentageFormatter.format(mode.rate)}</h4>
                    <p className="text-xs text-slate-600">{mode.description}</p>
                    <div className="mt-auto flex items-center justify-between rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-xs font-semibold">
                      <span className="text-slate-900">{mode.volatility} volatility</span>
                      <span className="text-emerald-600">Select</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-sm text-emerald-800">
            <h3 className="text-base font-semibold text-emerald-900">How the projection works</h3>
            <p className="mt-2 text-xs leading-relaxed text-emerald-800/90">
              We compound today&apos;s invested balance, layer in your monthly contributions, and apply the selected return path. Safe-withdrawal assumptions translate balances into monthly income so you know exactly how lifestyle coverage is tracking.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-emerald-800/90">
              As Supabase syncs arrive, WalletHabit will store every tweak and compare projections against live brokerage feeds to keep the momentum honest.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <h3 className="text-base font-semibold text-slate-900">Catch-up priorities</h3>
            <ul className="mt-3 flex flex-col gap-3 text-sm text-slate-600">
              {catchUpMoves.map((item) => (
                <li key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.narrative}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr,0.75fr]">
        <article className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Lifestyle and legacy focus</h2>
            <p className="text-sm text-slate-600">
              Choose the retirement narrative that best matches your energy, values, and giving goals. We&apos;ll tailor readiness copy and Copilot nudges to keep that story alive.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {lifestyleArchetypes.map((profile) => {
              const active = profile.id === lifestyleProfile.id
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setLifestyle(profile.id)}
                  className={[
                    'flex h-full flex-col gap-2 rounded-2xl border p-4 text-left transition',
                    active
                      ? 'border-emerald-400 bg-gradient-to-br from-emerald-100 via-white to-emerald-50 text-emerald-800 shadow-sm'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-slate-900',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <span>{profile.label}</span>
                    <span>{currencyFormatter.format(profile.monthlyNeed)}/mo</span>
                  </div>
                  <p className="text-xs text-slate-600">{profile.description}</p>
                  <p className="text-xs font-medium text-slate-500">{profile.legacy}</p>
                </button>
              )
            })}
          </div>
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-6 shadow-lg shadow-emerald-100">
          <div className="rounded-2xl border border-emerald-200 bg-white/80 p-5 text-sm text-slate-700">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Legacy focus</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{lifestyleProfile.legacy}</p>
            <p className="mt-4 text-xs text-slate-600">
              We&apos;ll map Supabase rituals to document guardians, giving vehicles, and lifestyle rituals tied to this scenario so everyone in your circle stays aligned.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white/80 p-5 text-sm text-slate-700">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Inflation-adjusted lifestyle need</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{adjustedNeed}</p>
            <p className="text-xs text-slate-600">
              Equivalent to {currencyFormatter.format(lifestyleProfile.monthlyNeed)} in today&apos;s dollars for the {lifestyleProfile.label.toLowerCase()} plan.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.4fr,0.6fr]">
        <article className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Momentum timeline</h2>
            <p className="text-sm text-slate-600">
              Track projected balances every few years. Once live feeds land, this table becomes a living scoreboard for your work-optional countdown.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
              <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
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

        <div className="grid gap-4">
          <article className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 text-sm text-slate-600 shadow-lg shadow-emerald-100">
            <h3 className="text-base font-semibold text-slate-900">Readiness checklist</h3>
            <ul className="flex flex-col gap-3">
              {readinessChecklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 text-sm text-slate-600 shadow-lg shadow-emerald-100">
            <h3 className="text-base font-semibold text-slate-900">Rollout milestones</h3>
            <ul className="flex flex-col gap-3">
              {rolloutMilestones.map((milestone) => (
                <li key={milestone.label} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">{milestone.timeframe}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{milestone.label}</p>
                  <p className="text-xs text-slate-600">{milestone.description}</p>
                </li>
              ))}
            </ul>
          </article>
          <article className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 text-sm text-slate-600 shadow-lg shadow-emerald-100">
            <h3 className="text-base font-semibold text-slate-900">Momentum signals</h3>
            <ul className="flex flex-col gap-3">
              {momentumSignals.map((signal) => (
                <li key={signal} className="flex gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}
