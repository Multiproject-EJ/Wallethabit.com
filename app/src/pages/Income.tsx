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
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-brand">Income boost lab</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Design your resilient earnings mix</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          Model how additional focus hours and leverage playbooks change your monthly income. WalletHabit will soon sync
          real inflows so these projections can guide negotiation prep, outreach sprints, and celebration rituals.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand">
          <span className="inline-flex h-2 w-2 rounded-full bg-brand"></span>
          Scenario sandbox — persistence ready once Supabase connects
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.6fr,1.4fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Tune your focus investment</h2>
            <p className="text-sm text-slate-600">
              Allocate weekly hours for income experiments. The slider represents time reclaimed from meetings, tv, or
              low-leverage work. We&apos;ll store this target to guide future check-ins once profiles sync.
            </p>
            <div className="flex items-center gap-4">
              <input
                className="flex-1"
                type="range"
                min={2}
                max={18}
                step={1}
                value={focusHours}
                onChange={(event) => setFocusHours(Number(event.target.value))}
              />
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
                <span className="font-semibold text-slate-900">{focusHours} hrs/week</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Growth playbooks</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {growthPlaybooks.map((option) => {
                const isActive = option.id === playbook.id
                return (
                  <button
                    key={option.id}
                    onClick={() => setActivePlaybook(option.id)}
                    className={[
                      'flex h-full flex-col gap-2 rounded-2xl border p-4 text-left text-sm transition',
                      isActive
                        ? 'border-brand bg-brand/10 text-brand-dark shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-brand/40 hover:bg-white hover:text-slate-900',
                    ].join(' ')}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{option.label}</p>
                    <h4 className="text-base font-semibold text-slate-900">{option.headline}</h4>
                    <p className="text-xs text-slate-600">{option.narrative}</p>
                    <div className="mt-auto flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs">
                      <span className="font-semibold text-slate-900">{option.risk} risk</span>
                      <span className="font-semibold text-brand">×{option.multiplier.toFixed(2)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold text-brand-dark">How the projection works</h3>
          <p>
            Each stream starts with today&apos;s monthly average. We then apply your focus hours (weighted by leverage) and
            the playbook multiplier to forecast next-month revenue. You&apos;ll soon be able to compare forecasts against
            real Plaid inflows and celebrate streaks.
          </p>
          <p>
            When Supabase credentials are added, WalletHabit will persist your chosen playbook, surface reminders in the
            dashboard, and nudge outreach tasks through the Copilot assistant.
          </p>
        </aside>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Projected monthly mix</h2>
              <p className="text-sm text-slate-600">
                Compare today&apos;s baseline to your experimental forecast. As the debt payoff and goals labs go live,
                this mix will power a holistic money OS.
              </p>
            </div>
            <div className="rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-right text-sm font-semibold text-brand">
              <p>Total forecast: ${monthlyTotal.toLocaleString()}</p>
              <p className="text-xs text-brand-dark">
                {totalDelta >= 0 ? '+' : '−'}${Math.abs(totalDelta).toLocaleString()} versus baseline
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Income stream</th>
                  <th className="px-4 py-3">Baseline</th>
                  <th className="px-4 py-3">Projected</th>
                  <th className="px-4 py-3">Change</th>
                  <th className="px-4 py-3">Stability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {forecast.map((stream) => (
                  <tr key={stream.id}>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{stream.name}</div>
                      <p className="mt-1 text-xs text-slate-500">{stream.description}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      ${stream.baseMonthly.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-semibold text-brand">
                      ${stream.projected.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={['font-semibold', stream.delta >= 0 ? 'text-brand' : 'text-rose-500'].join(' ')}>
                        {stream.delta >= 0 ? '+' : '−'}${Math.abs(stream.delta).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {stream.stability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr,1.5fr]">
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Momentum signals to monitor</h3>
          <ul className="mt-2 space-y-3 text-sm text-slate-600">
            {momentumSignals.map((signal) => (
              <li key={signal} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{signal}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Readiness checklist</h3>
          <ul className="mt-2 space-y-3 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-slate-400"></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Rollout milestones</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {rolloutMilestones.map((item) => (
            <div key={item.label} className="flex h-full flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.timeframe}</p>
              <h4 className="text-base font-semibold text-slate-900">{item.label}</h4>
              <p className="text-xs text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

