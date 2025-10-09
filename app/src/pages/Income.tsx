import { useMemo, useState } from 'react'

const incomeStreams = [
  {
    id: 'salary',
    name: 'Lead product design role',
    description:
      'Primary role with stable base pay and quarterly bonus potential. Growth comes from scope expansion and leveling conversations.',
    baseMonthly: 7200,
    scaler: 0.08,
    stability: 'High',
  },
  {
    id: 'freelance',
    name: 'Strategy sprint retainers',
    description:
      'Two-week product strategy intensives for fintech teams. Highly leverageable through playbooks and async collaboration.',
    baseMonthly: 1800,
    scaler: 0.22,
    stability: 'Medium',
  },
  {
    id: 'courses',
    name: 'Habit systems cohort',
    description:
      'Digital course + community that onboards 20 builders per launch. Growth hinges on storytelling and referral loops.',
    baseMonthly: 950,
    scaler: 0.3,
    stability: 'Variable',
  },
]

const growthPlaybooks = [
  {
    id: 'steady',
    label: 'Steady + sustainable',
    multiplier: 1,
    risk: 'Low',
    headline: 'Dial in current responsibilities first',
    narrative:
      'Focus on sharpening the craft, leading discovery rituals, and showcasing impact inside the current role before expanding.',
  },
  {
    id: 'stretch',
    label: 'Stretch retainers',
    multiplier: 1.28,
    risk: 'Medium',
    headline: 'Trade extra focus hours for premium packages',
    narrative:
      'Convert one-off sprints into rolling retainers with clear outcomes. Package async deliverables so hours compound into revenue.',
  },
  {
    id: 'scale',
    label: 'Scale leverage',
    multiplier: 1.55,
    risk: 'Elevated',
    headline: 'Automate delivery and lean on digital leverage',
    narrative:
      'Productise the cohort, implement evergreen onboarding, and invest in acquisition channels that convert without 1:1 time.',
  },
]

const momentumSignals = [
  'Monthly recurring revenue mix between salary, services, and leveraged products.',
  'Lead pipeline health — discovery calls booked and close rates across channels.',
  'Energy + bandwidth score after each week to keep burnout risk in check.',
  'Emergency fund runway maintained while experimenting with higher-risk bets.',
]

const readinessChecklist = [
  'Confirm runway needs and guardrails for experimenting with new income streams.',
  'Document positioning, pricing, and delivery promises for each offer.',
  'Prep lightweight measurement (Notion/Sheets) to track outreach, conversions, and fulfilment.',
  'Line up accountability partners or mentors for feedback on negotiation moments.',
]

const rolloutMilestones = [
  {
    label: 'Income schema',
    timeframe: 'Week 1',
    description: 'Model income stream tables in Supabase to store mixes, experiments, and projections.',
  },
  {
    label: 'Scenario persistence',
    timeframe: 'Week 2',
    description: 'Sync preferred focus hours and playbooks to profiles so trends follow across devices.',
  },
  {
    label: 'Copilot insights',
    timeframe: 'Week 3',
    description: 'Feed AI helper with negotiation scripts, pitch reminders, and celebration nudges.',
  },
  {
    label: 'Bank sync enrichment',
    timeframe: 'Week 4',
    description: 'Map Plaid transaction categories to stream tags for live progress dashboards.',
  },
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type GrowthPlaybookId = (typeof growthPlaybooks)[number]['id']

type Forecast = {
  id: string
  name: string
  description: string
  stability: string
  baseMonthly: number
  scaler: number
  projected: number
  delta: number
}

export default function Income() {
  const [focusHours, setFocusHours] = useState(8)
  const [activePlaybook, setActivePlaybook] = useState<GrowthPlaybookId>('stretch')

  const playbook = useMemo(
    () => growthPlaybooks.find((item) => item.id === activePlaybook) ?? growthPlaybooks[0],
    [activePlaybook],
  )

  const forecast: Forecast[] = useMemo(() => {
    return incomeStreams.map((stream) => {
      const hoursBoost = 1 + (focusHours / 12) * stream.scaler
      const projected = Math.round(stream.baseMonthly * hoursBoost * playbook.multiplier)
      const delta = projected - stream.baseMonthly

      return {
        ...stream,
        projected,
        delta,
      }
    })
  }, [focusHours, playbook])

  const monthlyTotal = useMemo(() => forecast.reduce((sum, stream) => sum + stream.projected, 0), [forecast])
  const baseTotal = useMemo(() => incomeStreams.reduce((sum, stream) => sum + stream.baseMonthly, 0), [])
  const totalDelta = monthlyTotal - baseTotal

  return (
    <div className="flex flex-1 flex-col gap-12 pb-20">
      <header className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-200/50 via-teal-500/20 to-navy/40 p-10 text-slate-900 shadow-lg">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-emerald-300/50 blur-3xl" />
          <div className="absolute bottom-[-80px] right-[-60px] h-80 w-80 rounded-full bg-teal-300/40 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/80">Income boost lab</p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Design a resilient earnings mix with clarity and momentum
            </h1>
            <p className="max-w-3xl text-sm text-slate-800">
              Calibrate your weekly focus investment, explore leverage playbooks, and see how each stream compounds into a
              sustainable income engine. WalletHabit will soon sync real inflows, celebrate wins, and keep your runway safe.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200/70 bg-white/70 p-5 backdrop-blur">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Focus {focusHours} hrs/week
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                  {playbook.label}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-slate-700">
                  {incomeStreams.length} income streams
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200 bg-white/80 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Baseline</p>
                  <p className="text-lg font-semibold text-slate-900">{currencyFormatter.format(baseTotal)}</p>
                  <p className="text-xs text-slate-600">Today&apos;s dependable inflows</p>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200 bg-white/80 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Forecast</p>
                  <p className="text-lg font-semibold text-emerald-700">{currencyFormatter.format(monthlyTotal)}</p>
                  <p className="text-xs text-slate-600">Powered by focus + leverage</p>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Momentum delta</p>
                  <p className="text-lg font-semibold text-emerald-700">
                    {totalDelta >= 0 ? '+' : '−'}{currencyFormatter.format(Math.abs(totalDelta))}
                  </p>
                  <p className="text-xs text-emerald-800">{playbook.headline}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200/70 bg-white/70 p-5 text-sm text-slate-700 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Scenario status</p>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Sandbox ready
                </span>
              </div>
              <p className="text-base font-semibold text-slate-900">{playbook.headline}</p>
              <p className="text-xs leading-relaxed text-slate-600">{playbook.narrative}</p>
              <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Next step</p>
                <p className="mt-2 text-sm text-slate-700">
                  Prep Supabase sync so your Copilot can watch inflows, protect cash buffers, and nudge outreach rituals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Tune your focus investment</h2>
            <p className="text-sm text-slate-600">
              Allocate weekly hours for income experiments. This slider represents reclaimed energy from meetings, TV, or
              low-leverage work. Once profiles sync, we’ll store this target and celebrate the consistency streak.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
              <div className="flex flex-col gap-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Weekly focus hours</div>
                <p className="text-xs text-slate-600">
                  Slide until the commitment feels challenging but sustainable. Momentum comes from small, steady deposits.
                </p>
                <div className="flex items-center gap-4">
                  <input
                    className="flex-1 accent-primary"
                    type="range"
                    min={2}
                    max={18}
                    step={1}
                    value={focusHours}
                    onChange={(event) => setFocusHours(Number(event.target.value))}
                  />
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    {focusHours} hrs/week
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Growth playbooks</p>
                <p className="mt-2 text-xs text-slate-600">
                  Choose the leverage plan that mirrors your season. Each option adjusts multipliers across every stream.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {growthPlaybooks.map((option) => {
                    const isActive = option.id === playbook.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setActivePlaybook(option.id)}
                        className={[
                          'flex h-full flex-col gap-3 rounded-2xl border p-4 text-left text-sm transition',
                          isActive
                            ? 'border-emerald-400 bg-gradient-to-br from-emerald-100 via-white to-emerald-50 text-emerald-800 shadow-sm'
                            : 'border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-slate-900',
                        ].join(' ')}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{option.label}</p>
                        <h4 className="text-base font-semibold text-slate-900">{option.headline}</h4>
                        <p className="text-xs text-slate-600">{option.narrative}</p>
                        <div className="mt-auto flex items-center justify-between rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-xs font-semibold">
                          <span className="text-slate-900">{option.risk} risk</span>
                          <span className="text-emerald-600">×{option.multiplier.toFixed(2)}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <aside className="flex h-full flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/10 p-5 text-sm text-primary-dark">
              <h3 className="text-base font-semibold text-primary-dark">How the projection works</h3>
              <p>
                Each stream starts with today&apos;s average inflow. We apply your focus hours (weighted by leverage) and the
                playbook multiplier to forecast next-month revenue. Soon you&apos;ll compare these projections to Plaid data.
              </p>
              <p>
                When Supabase credentials connect, WalletHabit will persist your playbook, surface reminders in the dashboard,
                and nudge outreach rituals through the Copilot assistant.
              </p>
            </aside>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <h2 className="text-xl font-semibold text-slate-900">Projected monthly mix</h2>
          <p className="text-sm text-slate-600">
            Compare today&apos;s baseline to your experimental forecast. As the debt, investing, and goals labs go live, this mix
            becomes the heartbeat of your money OS.
          </p>
          <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm font-semibold text-emerald-800">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-emerald-700/80">Total forecast</p>
              <p className="text-lg text-emerald-800">{currencyFormatter.format(monthlyTotal)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-emerald-700/80">Uplift vs baseline</p>
              <p className="text-lg text-emerald-800">
                {totalDelta >= 0 ? '+' : '−'}{currencyFormatter.format(Math.abs(totalDelta))}
              </p>
            </div>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Momentum outlook
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
              <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Income stream</th>
                  <th className="px-4 py-3 font-semibold">Baseline</th>
                  <th className="px-4 py-3 font-semibold">Projected</th>
                  <th className="px-4 py-3 font-semibold">Change</th>
                  <th className="px-4 py-3 font-semibold">Stability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {forecast.map((stream) => (
                  <tr key={stream.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-slate-900">{stream.name}</div>
                      <p className="mt-1 text-xs text-slate-500">{stream.description}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{currencyFormatter.format(stream.baseMonthly)}</td>
                    <td className="px-4 py-4 font-semibold text-emerald-700">{currencyFormatter.format(stream.projected)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={[
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                          stream.delta >= 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-600',
                        ].join(' ')}
                      >
                        {stream.delta >= 0 ? '+' : '−'}{currencyFormatter.format(Math.abs(stream.delta))}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{stream.stability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr,1.05fr]">
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <h3 className="text-lg font-semibold text-slate-900">Momentum signals to monitor</h3>
          <ul className="mt-2 space-y-3 text-sm text-slate-600">
            {momentumSignals.map((signal) => (
              <li key={signal} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                <p>{signal}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <h3 className="text-lg font-semibold text-slate-900">Readiness checklist</h3>
          <ul className="mt-2 space-y-3 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-slate-400" />
                <p>{item}</p>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-600">
            <p className="font-semibold uppercase tracking-wide text-slate-500">Tip</p>
            <p className="mt-2">
              Use Notion or Linear-style rituals to log outreach actions. Copilot will turn these into streaks once synced.
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Rollout milestones</h3>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Launch horizon — 4 weeks
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {rolloutMilestones.map((item) => (
              <div key={item.label} className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.timeframe}</p>
                <h4 className="text-base font-semibold text-slate-900">{item.label}</h4>
                <p className="text-xs text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

