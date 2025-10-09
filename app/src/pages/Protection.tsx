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

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              New • Protection lab preview
            </span>
            <h1 className="text-4xl font-bold text-slate-900">Build a resilient safety net before storms roll in.</h1>
            <p className="text-sm text-slate-600">
              Stress-test your coverage with custom personas, runway sliders, and advisor-ready checklists. Supabase will soon
              persist these assumptions so Copilot can watch for gaps in real time.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/40 bg-brand/10 px-5 py-4 text-sm text-brand-dark">
            <p className="font-semibold">Why this matters</p>
            <p className="mt-2">
              Protection planning keeps momentum intact when life gets unpredictable. This lab stages emergency fund tracking,
              insurance gap analysis, and estate coordination workflows ahead of full data sync.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Persona focus</p>
              <div className="flex flex-wrap gap-2">
                {personas.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPersonaId(item.id)}
                    className={[
                      'rounded-full border px-4 py-2 text-sm font-medium transition',
                      personaId === item.id
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-slate-200 text-slate-600 hover:border-brand/40 hover:text-brand',
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-600">{persona.description}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Annual household income</span>
                <input
                  type="range"
                  min={40000}
                  max={220000}
                  step={5000}
                  value={annualIncome}
                  onChange={(event) => setAnnualIncome(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(annualIncome)}</span>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Monthly core expenses</span>
                <input
                  type="range"
                  min={2500}
                  max={9000}
                  step={250}
                  value={monthlyExpenses}
                  onChange={(event) => setMonthlyExpenses(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(monthlyExpenses)}</span>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Target runway (months)</span>
                <input
                  type="range"
                  min={3}
                  max={18}
                  step={1}
                  value={coverageMonths}
                  onChange={(event) => setCoverageMonths(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{coverageMonths} months</span>
                <p className="text-xs text-slate-500">
                  Persona baseline: {persona.emergencyMonths} months · Adjust to match your comfort zone.
                </p>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Emergency savings on hand</span>
                <input
                  type="range"
                  min={0}
                  max={90000}
                  step={1000}
                  value={emergencySavings}
                  onChange={(event) => setEmergencySavings(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(emergencySavings)}</span>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Existing life coverage</span>
                <input
                  type="range"
                  min={0}
                  max={1500000}
                  step={25000}
                  value={lifeCoverage}
                  onChange={(event) => setLifeCoverage(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(lifeCoverage)}</span>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Monthly disability benefit</span>
                <input
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

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Emergency runway target</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {currencyFormatter.format(recommendations.emergencyTarget)}
                </p>
                <p className="mt-1 text-xs text-slate-500">Gap: {currencyFormatter.format(emergencyGap)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Life coverage need</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {currencyFormatter.format(recommendations.recommendedLife)}
                </p>
                <p className="mt-1 text-xs text-slate-500">Gap: {currencyFormatter.format(lifeGap)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Monthly income replacement</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {currencyFormatter.format(recommendations.monthlyIncomeReplacement)}
                </p>
                <p className="mt-1 text-xs text-slate-500">Gap: {currencyFormatter.format(disabilityGap)}</p>
              </div>
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-sm text-slate-600">
          <h2 className="text-lg font-semibold text-slate-900">Coverage gap insights</h2>
          <p>
            WalletHabit will watch your runways, policies, and beneficiaries. When gaps appear, Copilot will tee up quotes,
            savings boosts, or policy riders to keep your plan resilient.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>Sync emergency fund + premium transactions to trend against your runway targets.</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>Surface open enrolment reminders so you never miss better employer coverage.</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
              <p>Share advisor-ready snapshots that summarise net worth protection in minutes.</p>
            </li>
          </ul>
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Coverage playbooks</h2>
          <p className="mt-2 text-sm text-slate-600">
            Quick-start rituals keep momentum high. Pair these with automations once Supabase data writes go live.
          </p>
          <ul className="mt-4 space-y-3">
            {playbooks.map((play) => (
              <li key={play.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{play.title}</p>
                <p className="mt-1 text-sm text-slate-600">{play.description}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Readiness checklist</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use this list during onboarding so foundational protection steps are tracked from day one.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-xs font-semibold text-brand">
                  ✓
                </span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Rollout milestones</h2>
          <p className="mt-2 text-sm text-slate-600">
            Shipping order once engineering cycles spin up. Each milestone unlocks richer automations.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {rolloutMilestones.map((milestone) => (
              <li key={milestone.label} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <div>
                  <p className="font-semibold text-slate-900">{milestone.label}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{milestone.timeframe}</p>
                  <p className="mt-1 text-sm">{milestone.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Guardrails & signals</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-900">Guardrails</p>
              <ul className="mt-2 space-y-2">
                {guardrails.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Momentum signals</p>
              <ul className="mt-2 space-y-2">
                {signalBeacons.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></span>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Support channels</h2>
        <p className="mt-2 text-sm text-slate-600">
          When customers need expert help, WalletHabit will surface curated partners and workflows.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {supportChannels.map((channel) => (
            <div key={channel.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{channel.label}</p>
              <p className="mt-1 text-sm text-slate-600">{channel.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
