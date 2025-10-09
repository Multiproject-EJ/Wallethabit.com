import { useMemo, useState } from 'react'

const personas = [
  {
    id: 'foundation',
    label: 'Foundation builder',
    description: 'Single income, early career, wants a durable buffer while investments ramp.',
    emergencyMonths: 4,
    lifeMultiplier: 6,
    disabilityIncomeRate: 0.6,
    familyFactor: 0,
  },
  {
    id: 'family',
    label: 'Family guardian',
    description: 'Dual income household with kids and a mortgage — prioritises continuity.',
    emergencyMonths: 6,
    lifeMultiplier: 8,
    disabilityIncomeRate: 0.65,
    familyFactor: 150000,
  },
  {
    id: 'builder',
    label: 'Momentum investor',
    description: 'High savings rate, entrepreneurial income, and variable quarterly draws.',
    emergencyMonths: 8,
    lifeMultiplier: 7,
    disabilityIncomeRate: 0.55,
    familyFactor: 75000,
  },
  {
    id: 'legacy',
    label: 'Legacy planner',
    description: 'Approaching financial independence, coordinates estate and caregiving support.',
    emergencyMonths: 12,
    lifeMultiplier: 5,
    disabilityIncomeRate: 0.5,
    familyFactor: 200000,
  },
] as const

type PersonaId = (typeof personas)[number]['id']

type Persona = (typeof personas)[number]

const playbooks = [
  {
    title: 'Emergency runway sprints',
    description:
      'Automate transfers each payday into a high-yield bucket labelled "Safety Net" until your runway target is reached.',
  },
  {
    title: 'Insurance coverage sync',
    description:
      'Document employer disability + life benefits, then layer personal policies where gaps remain.',
  },
  {
    title: 'Crisis rehearsal',
    description:
      'Run quarterly check-ins to simulate job loss, illness, and caregiver support so the plan feels battle-tested.',
  },
]

const readinessChecklist = [
  'Upload policy PDFs and renewal reminders into the vault for quick reference.',
  'Track dependants and monthly obligations so Copilot can recommend coverage levels automatically.',
  'Connect bank accounts to monitor safety-net balances alongside investments.',
  'Draft a one-page emergency playbook with who to call, what to pause, and income levers to activate.',
]

const rolloutMilestones = [
  {
    label: 'Coverage schema',
    timeframe: 'Week 1',
    description: 'Design Supabase tables for emergency funds, insurance policies, and beneficiary metadata.',
  },
  {
    label: 'Bank sync tagging',
    timeframe: 'Week 2',
    description: 'Use Plaid imports to detect safety-net balances and alert when thresholds dip.',
  },
  {
    label: 'Copilot briefs',
    timeframe: 'Week 3',
    description: 'Feed Copilot with coverage gaps so it can propose playbooks and renewal nudges.',
  },
  {
    label: 'Advisor mode',
    timeframe: 'Week 4',
    description: 'Launch shareable summary reports for partners or advisors with version tracking.',
  },
]

const guardrails = [
  'Keep emergency reserves above 3× recurring monthly expenses before increasing investing risk.',
  'Cap total insurance premiums at <10% of gross income while gaps are shrinking.',
  'Review beneficiaries and policy riders every open enrolment or major life change.',
  'Align estate documents and digital vault permissions with the latest protection plan.',
]

const signalBeacons = [
  'Emergency fund balance trends above the target runway for three consecutive months.',
  'Insurance coverage gap shrinks below 10% of recommended levels.',
  'Copilot check-ins log annual policy reviews with action items resolved.',
  'Dependants have verified access instructions stored in the readiness vault.',
]

const supportChannels = [
  {
    label: 'Benefits review session',
    description: 'Capture employer-provided coverage, elimination periods, and optional riders to close gaps.',
  },
  {
    label: 'Insurance marketplace pilot',
    description: 'Preview partner brokers with embedded quotes for term life, disability, and umbrella add-ons.',
  },
  {
    label: 'Estate toolkit',
    description: 'Assemble will templates, healthcare proxies, and secure document storage into one workflow.',
  },
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function calculateRecommendations({
  persona,
  annualIncome,
  monthlyExpenses,
  coverageMonths,
}: {
  persona: Persona
  annualIncome: number
  monthlyExpenses: number
  coverageMonths: number
}) {
  const adjustedMonths = Math.max(coverageMonths, persona.emergencyMonths)
  const emergencyTarget = monthlyExpenses * adjustedMonths
  const recommendedLife = persona.lifeMultiplier * annualIncome + persona.familyFactor
  const monthlyIncomeReplacement = persona.disabilityIncomeRate * annualIncome / 12

  return {
    emergencyTarget,
    recommendedLife,
    monthlyIncomeReplacement,
  }
}

export default function Protection() {
  const [personaId, setPersonaId] = useState<PersonaId>('family')
  const [annualIncome, setAnnualIncome] = useState(115000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(5200)
  const [coverageMonths, setCoverageMonths] = useState(6)
  const [emergencySavings, setEmergencySavings] = useState(18000)
  const [lifeCoverage, setLifeCoverage] = useState(400000)
  const [disabilityCoverage, setDisabilityCoverage] = useState(3500)

  const persona = useMemo(() => personas.find((item) => item.id === personaId) ?? personas[1], [personaId])

  const recommendations = useMemo(
    () => calculateRecommendations({ persona, annualIncome, monthlyExpenses, coverageMonths }),
    [persona, annualIncome, monthlyExpenses, coverageMonths],
  )

  const emergencyGap = Math.max(0, recommendations.emergencyTarget - emergencySavings)
  const lifeGap = Math.max(0, recommendations.recommendedLife - lifeCoverage)
  const disabilityGap = Math.max(0, recommendations.monthlyIncomeReplacement - disabilityCoverage)

  const emergencyProgress = recommendations.emergencyTarget === 0
    ? 0
    : Math.round((emergencySavings / recommendations.emergencyTarget) * 100)
  const lifeProgress = recommendations.recommendedLife === 0
    ? 0
    : Math.round((lifeCoverage / recommendations.recommendedLife) * 100)
  const disabilityProgress = recommendations.monthlyIncomeReplacement === 0
    ? 0
    : Math.round((disabilityCoverage / recommendations.monthlyIncomeReplacement) * 100)

  const clampPercent = (value: number) => Math.max(0, Math.min(100, value))
  const readinessScore = Math.round(
    (clampPercent(emergencyProgress) + clampPercent(lifeProgress) + clampPercent(disabilityProgress)) / 3,
  )

  let readinessStatus = 'Lay the groundwork'
  let readinessMessage =
    'Build the baseline systems: label your safety net accounts, document policies, and line up renewal reminders.'

  if (readinessScore >= 90) {
    readinessStatus = 'Storm ready'
    readinessMessage = 'You can absorb most surprises. Now reinforce automations so Copilot keeps your protection plan warm.'
  } else if (readinessScore >= 70) {
    readinessStatus = 'Momentum building'
    readinessMessage = 'Coverage is closing in. Schedule policy refreshes and direct bonuses into the safety net to lock it in.'
  } else if (readinessScore >= 50) {
    readinessStatus = 'In build mode'
    readinessMessage = 'Tighten emergency reserves and review employer benefits so life coverage can scale with confidence.'
  }

  const coverageMetrics = [
    {
      id: 'emergency',
      label: 'Emergency runway',
      current: emergencySavings,
      target: recommendations.emergencyTarget,
      gap: emergencyGap,
      percent: emergencyProgress,
      tone: 'from-primary/60 via-primary/40 to-primary/30',
      indicator: 'bg-primary-light',
      description: `Target ${coverageMonths} month runway · Persona baseline ${persona.emergencyMonths} months`,
    },
    {
      id: 'life',
      label: 'Life coverage need',
      current: lifeCoverage,
      target: recommendations.recommendedLife,
      gap: lifeGap,
      percent: lifeProgress,
      tone: 'from-coral/80 via-coral/60 to-coral/40',
      indicator: 'bg-coral',
      description: `${persona.lifeMultiplier}× income + family buffer ${currencyFormatter.format(persona.familyFactor)}`,
    },
    {
      id: 'disability',
      label: 'Monthly income replacement',
      current: disabilityCoverage,
      target: recommendations.monthlyIncomeReplacement,
      gap: disabilityGap,
      percent: disabilityProgress,
      tone: 'from-gold/70 via-gold/60 to-gold/40',
      indicator: 'bg-gold',
      description: `Aim for ${Math.round(persona.disabilityIncomeRate * 100)}% of take-home income`,
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-12 pb-20">
      <header className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-emerald-200/50 via-primary/20 to-navy/40 p-10 text-slate-900 shadow-lg">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-primary-light/60 blur-3xl" />
          <div className="absolute bottom-[-80px] right-[-60px] h-80 w-80 rounded-full bg-coral/50 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-dark/80">Protection lab</p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Build a resilient safety net before storms roll in
            </h1>
            <p className="max-w-3xl text-sm text-slate-800">
              Shape your emergency runway, layer the right coverage, and prep advisor-ready rituals. WalletHabit will soon sync
              real balances and policies so Copilot can pulse you before gaps open.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="flex flex-col gap-4 rounded-2xl border border-primary/40 bg-white/70 p-5 backdrop-blur">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary-dark">
                  <span className="h-2 w-2 rounded-full bg-primary-light" /> {persona.label}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-slate-700">
                  Runway target {coverageMonths} mo
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-slate-700">
                  Coverage sync in preview
                </span>
              </div>
              <p className="text-sm text-slate-700">{persona.description}</p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/40 bg-white/70 p-5 text-sm text-slate-700 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resilience status</p>
                  <div className="mt-2 flex items-end gap-3">
                    <p className="text-3xl font-semibold text-primary-dark">{readinessScore}%</p>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
                      {readinessStatus}
                    </span>
                  </div>
                </div>
                <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
                  Automations ship next
                </div>
              </div>
              <p className="text-xs text-slate-600">{readinessMessage}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-8 xl:grid-cols-[1.45fr,1fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Calibrate your safety net</h2>
            <p className="text-sm text-slate-600">
              Tune the persona, runway, and coverage sliders. WalletHabit will persist these soon so Copilot can monitor guardrails
              and cheer on every protection win.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Persona focus</p>
                <div className="flex flex-wrap gap-2">
                  {personas.map((item) => {
                    const isActive = item.id === personaId
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPersonaId(item.id)}
                        className={[
                          'rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                          isActive
                            ? 'border-primary/60 bg-gradient-to-r from-primary/20 via-white to-primary/10 text-primary-dark shadow-sm'
                            : 'border-slate-200/70 bg-white/70 text-slate-600 hover:border-primary/40 hover:text-primary-dark',
                        ].join(' ')}
                      >
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-sand p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Annual household income
                  </span>
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={40000}
                    max={220000}
                    step={5000}
                    value={annualIncome}
                    onChange={(event) => setAnnualIncome(Number(event.currentTarget.value))}
                  />
                  <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(annualIncome)}</span>
                </label>

                <label className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-sand p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Monthly core expenses
                  </span>
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={2500}
                    max={9000}
                    step={250}
                    value={monthlyExpenses}
                    onChange={(event) => setMonthlyExpenses(Number(event.currentTarget.value))}
                  />
                  <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(monthlyExpenses)}</span>
                </label>

                <label className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-sand p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Target runway (months)
                  </span>
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={3}
                    max={18}
                    step={1}
                    value={coverageMonths}
                    onChange={(event) => setCoverageMonths(Number(event.currentTarget.value))}
                  />
                  <span className="text-lg font-semibold text-slate-900">{coverageMonths} months</span>
                  <p className="text-xs text-slate-500">
                    Persona baseline: {persona.emergencyMonths} months · adjust to match your comfort zone.
                  </p>
                </label>

                <label className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-sand p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Emergency savings on hand
                  </span>
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={0}
                    max={90000}
                    step={1000}
                    value={emergencySavings}
                    onChange={(event) => setEmergencySavings(Number(event.currentTarget.value))}
                  />
                  <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(emergencySavings)}</span>
                </label>

                <label className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-sand p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Existing life coverage
                  </span>
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={0}
                    max={1500000}
                    step={25000}
                    value={lifeCoverage}
                    onChange={(event) => setLifeCoverage(Number(event.currentTarget.value))}
                  />
                  <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(lifeCoverage)}</span>
                </label>

                <label className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-sand p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Monthly disability benefit
                  </span>
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={0}
                    max={10000}
                    step={250}
                    value={disabilityCoverage}
                    onChange={(event) => setDisabilityCoverage(Number(event.currentTarget.value))}
                  />
                  <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(disabilityCoverage)}</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Coverage scoreboard</p>
              <div className="grid gap-4">
                {coverageMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm shadow-emerald-100/40"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{metric.label}</p>
                        <p className="text-xs text-slate-500">{metric.description}</p>
                      </div>
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                        {Math.max(metric.percent, 0)}%
                      </span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-slate-200/70">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${metric.tone}`}
                        style={{ width: `${Math.max(0, Math.min(100, metric.percent))}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-slate-700">
                        <span className={`h-2 w-2 rounded-full ${metric.indicator}`} />
                        {currencyFormatter.format(metric.current)} now
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-slate-700">
                        Target {currencyFormatter.format(metric.target)}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-slate-600">
                        Gap {currencyFormatter.format(metric.gap)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-5 rounded-3xl border border-primary/30 bg-gradient-to-br from-white/80 via-primary/5 to-white/60 p-6 text-sm text-slate-700 shadow-lg shadow-emerald-100/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Coverage intelligence</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
              Copilot briefs coming soon
            </span>
          </div>
          <p>
            WalletHabit keeps watch on runways, policies, and beneficiaries. When thresholds slip, your copilot will tee up
            quotes, savings boosts, or advisor nudges so the plan stays calm.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary-dark">
                1
              </span>
              <p>Sync emergency and premium transactions to trend against your runway targets in real time.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary-dark">
                2
              </span>
              <p>Surface open-enrolment reminders so employer benefits and personal policies stay dialled in.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary-dark">
                3
              </span>
              <p>Generate advisor-ready summaries that highlight coverage gaps, beneficiaries, and next steps.</p>
            </li>
          </ul>
        </aside>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100/40">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Coverage rituals</h2>
            <p className="mt-2 text-sm text-slate-600">
              Pair these rituals with automation once Supabase write-backs land. Momentum comes from small, consistent upgrades.
            </p>
          </div>
          <ul className="space-y-4">
            {playbooks.map((play) => (
              <li
                key={play.title}
                className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-sand to-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">{play.title}</p>
                <p className="mt-2 text-sm text-slate-600">{play.description}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100/40">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Readiness runway</h2>
            <p className="mt-2 text-sm text-slate-600">
              Use this checklist during onboarding so foundational protection steps are captured from day one.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <span className="mt-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-primary-dark shadow-sm">
                  ✓
                </span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.3fr,1fr]">
        <article className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100/40">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Rollout milestones</h2>
            <p className="mt-2 text-sm text-slate-600">
              Here&apos;s how the lab ships from schema to advisor mode once engineering cycles spin up.
            </p>
          </div>
          <ul className="space-y-4 text-sm text-slate-600">
            {rolloutMilestones.map((milestone) => (
              <li
                key={milestone.label}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-gradient-to-r from-white via-sand to-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{milestone.label}</p>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-dark">
                    {milestone.timeframe}
                  </span>
                </div>
                <p>{milestone.description}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100/40">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Guardrails & momentum signals</h2>
            <p className="mt-2 text-sm text-slate-600">
              Keep these cues visible so you know when to celebrate and when to reinforce the plan.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-slate-900">Guardrails</p>
              <ul className="space-y-2 text-sm text-slate-600">
                {guardrails.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-light" />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4">
              <p className="text-sm font-semibold text-slate-900">Momentum signals</p>
              <ul className="space-y-2 text-sm text-slate-600">
                {signalBeacons.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>

      <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-100/40">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-slate-900">Support partners</h2>
          <p className="text-sm text-slate-600">
            When customers need expert help, WalletHabit will surface curated partners and workflows right inside the lab.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {supportChannels.map((channel) => (
            <div
              key={channel.label}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-sand to-white p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-900">{channel.label}</p>
              <p className="text-sm text-slate-600">{channel.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
