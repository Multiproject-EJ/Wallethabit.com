import { useEffect, useMemo, useState } from 'react'

type FilingProfile = {
  id: string
  label: string
  description: string
  standardDeduction: number
  marginalRate: number
  defaultWithholdingRate: number
  qbiEligible: boolean
  preTaxLimit: number
  hsaLimit: number
  defaultIncome: number
  defaultPreTax: number
  defaultHsa: number
  defaultExpenses: number
  defaultRothConversion: number
}

const filingProfiles: FilingProfile[] = [
  {
    id: 'w2',
    label: 'W-2 strategist',
    description: 'Salaried pro maximising employer plans, needs clarity on deferral space and Roth trade-offs.',
    standardDeduction: 13850,
    marginalRate: 0.22,
    defaultWithholdingRate: 0.19,
    qbiEligible: false,
    preTaxLimit: 22500,
    hsaLimit: 3850,
    defaultIncome: 115000,
    defaultPreTax: 15500,
    defaultHsa: 2200,
    defaultExpenses: 1200,
    defaultRothConversion: 0,
  },
  {
    id: 'family',
    label: 'Dual-income household',
    description: 'Married planners coordinating two paychecks, catch-up space, and dependent care deductions.',
    standardDeduction: 27700,
    marginalRate: 0.24,
    defaultWithholdingRate: 0.21,
    qbiEligible: false,
    preTaxLimit: 45000,
    hsaLimit: 7750,
    defaultIncome: 192000,
    defaultPreTax: 32000,
    defaultHsa: 5200,
    defaultExpenses: 3200,
    defaultRothConversion: 0,
  },
  {
    id: 'founder',
    label: 'Founder with pass-through',
    description: 'LLC/S-corp owner balancing salary, distributions, QBI, and quarterly estimates.',
    standardDeduction: 13850,
    marginalRate: 0.32,
    defaultWithholdingRate: 0.1,
    qbiEligible: true,
    preTaxLimit: 66000,
    hsaLimit: 7750,
    defaultIncome: 230000,
    defaultPreTax: 42000,
    defaultHsa: 6100,
    defaultExpenses: 42000,
    defaultRothConversion: 9000,
  },
  {
    id: 'fi',
    label: 'Coast FI calibrator',
    description: 'Work-optional planner filling Roth conversions while staying under key tax cliffs.',
    standardDeduction: 27700,
    marginalRate: 0.22,
    defaultWithholdingRate: 0.05,
    qbiEligible: false,
    preTaxLimit: 30000,
    hsaLimit: 0,
    defaultIncome: 98000,
    defaultPreTax: 8000,
    defaultHsa: 0,
    defaultExpenses: 500,
    defaultRothConversion: 22000,
  },
]

const strategyPlays = [
  {
    title: 'Maximise tax-advantaged buckets first',
    description:
      'Prioritise 401(k)/403(b), HSA, and backdoor Roth windows before shifting to taxable brokerage so each dollar compounds tax-free longer.',
  },
  {
    title: 'Sync withholding + estimated payments',
    description:
      'Use payroll elections or quarterly vouchers to keep the safe harbour target covered and avoid surprises at filing time.',
  },
  {
    title: 'Blend Roth conversions with bracket management',
    description:
      'Fill available lower brackets with conversions now so future withdrawals face smaller tax drag once RMDs arrive.',
  },
]

const readinessChecklist = [
  'Upload prior-year returns so Copilot can benchmark marginal rates and credit eligibility.',
  'Track employer and personal plan limits with reminders before calendar year-end.',
  'Model Roth vs. pre-tax trade-offs for each plan and document why this year’s mix wins.',
  'Record estimated tax payments and withholding so quarterly dashboards stay in sync.',
]

const rolloutMilestones = [
  {
    label: 'Supabase tax profile schema',
    timeframe: 'Week 1',
    description: 'Create tables for filing status, plan limits, contributions, conversions, and quarterly payments.',
  },
  {
    label: 'Data ingestion + Plaid tags',
    timeframe: 'Week 2',
    description: 'Tag paychecks, benefits, and transfers from bank imports to auto-fill contribution trackers.',
  },
  {
    label: 'Copilot tax concierge',
    timeframe: 'Week 3',
    description: 'Feed Copilot with marginal rate data so it can draft withholding nudges and Roth conversion memos.',
  },
  {
    label: 'Advisor export mode',
    timeframe: 'Week 4',
    description: 'Generate CPA-ready summaries highlighting year-to-date contributions, safe harbour status, and next plays.',
  },
]

const guardrails = [
  'Avoid overfunding pre-tax buckets if the marginal rate is below 12% — Roth space could be more valuable.',
  'Set aside 25–30% of pass-through profit for taxes before distributions hit personal accounts.',
  'Throttle Roth conversions if they nudge MAGI over ACA or education credit cliffs.',
  'Revisit withholding after every raise, bonus, or distribution change to prevent underpayment penalties.',
]

const copilotPrompts = [
  'Draft a note explaining this year’s tax savings and how we’ll redeploy the freed-up cash flow.',
  'Monitor payroll feeds for missed employer matches or HSA contributions and surface alerts.',
  'Prep quarterly reminder scripts with payment amounts, due dates, and IRS submission links.',
  'Summarise Roth conversion opportunities if markets dip 5%+ this quarter.',
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function calculateTaxScenario({
  profile,
  annualIncome,
  preTaxContributions,
  hsaContribution,
  businessExpenses,
  rothConversion,
}: {
  profile: FilingProfile
  annualIncome: number
  preTaxContributions: number
  hsaContribution: number
  businessExpenses: number
  rothConversion: number
}) {
  const adjustedIncome = Math.max(0, annualIncome - businessExpenses)
  const qbiBase = profile.qbiEligible ? Math.max(0, adjustedIncome - preTaxContributions - hsaContribution) : 0
  const qbiDeduction = profile.qbiEligible ? Math.min(qbiBase * 0.2, 70000) : 0
  const taxableIncome = Math.max(
    0,
    adjustedIncome - profile.standardDeduction - preTaxContributions - hsaContribution - qbiDeduction + rothConversion,
  )
  const estimatedTax = taxableIncome * profile.marginalRate
  const annualTaxSavings = (preTaxContributions + hsaContribution + qbiDeduction) * profile.marginalRate
  const effectiveRate = adjustedIncome === 0 ? 0 : estimatedTax / adjustedIncome
  const withheld = profile.defaultWithholdingRate * annualIncome
  const cashDelta = withheld - estimatedTax
  const quarterlyEstimate = profile.qbiEligible ? estimatedTax / 4 : Math.max(0, -cashDelta) / 4

  return {
    adjustedIncome,
    taxableIncome,
    estimatedTax,
    annualTaxSavings,
    effectiveRate,
    cashDelta,
    quarterlyEstimate,
    qbiDeduction,
  }
}

export default function Taxes() {
  const [profileId, setProfileId] = useState<FilingProfile['id']>('founder')
  const profile = useMemo(() => filingProfiles.find((item) => item.id === profileId) ?? filingProfiles[0], [profileId])

  const [annualIncome, setAnnualIncome] = useState(profile.defaultIncome)
  const [preTaxContributions, setPreTaxContributions] = useState(profile.defaultPreTax)
  const [hsaContribution, setHsaContribution] = useState(profile.defaultHsa)
  const [businessExpenses, setBusinessExpenses] = useState(profile.defaultExpenses)
  const [rothConversion, setRothConversion] = useState(profile.defaultRothConversion)

  useEffect(() => {
    setAnnualIncome(profile.defaultIncome)
    setPreTaxContributions(profile.defaultPreTax)
    setHsaContribution(profile.defaultHsa)
    setBusinessExpenses(profile.defaultExpenses)
    setRothConversion(profile.defaultRothConversion)
  }, [profile])

  const scenario = useMemo(
    () =>
      calculateTaxScenario({
        profile,
        annualIncome,
        preTaxContributions,
        hsaContribution,
        businessExpenses,
        rothConversion,
      }),
    [profile, annualIncome, preTaxContributions, hsaContribution, businessExpenses, rothConversion],
  )

  const preTaxRemaining = Math.max(0, profile.preTaxLimit - preTaxContributions)
  const hsaRemaining = Math.max(0, profile.hsaLimit - hsaContribution)

  const opportunitySignals = [
    `Pre-tax space remaining: ${currencyFormatter.format(preTaxRemaining)} (${(preTaxRemaining / profile.preTaxLimit * 100).toFixed(0)}% of capacity).`,
    profile.hsaLimit
      ? `HSA headroom: ${currencyFormatter.format(hsaRemaining)} — contribute before ${profile.hsaLimit > 0 ? 'December 31st' : 'year end'}.`
      : 'No HSA eligibility this year — focus on Roth or brokerage buckets.',
    scenario.qbiDeduction
      ? `Qualified business income deduction captured: ${currencyFormatter.format(scenario.qbiDeduction)}.`
      : profile.qbiEligible
        ? 'QBI deduction currently unused — document expenses and reasonable salary splits.'
        : 'QBI deduction not available for this profile.',
    scenario.cashDelta >= 0
      ? `Projected refund cushion: ${currencyFormatter.format(scenario.cashDelta)} based on current withholding.`
      : `Additional payments needed: ${currencyFormatter.format(Math.abs(scenario.cashDelta))} to hit safe harbour.`,
  ]

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              New • Tax strategy lab preview
            </span>
            <h1 className="text-4xl font-bold text-slate-900">Dial in your tax game plan before year-end deadlines hit.</h1>
            <p className="text-sm text-slate-600">
              Explore how contribution mixes, business deductions, and Roth conversions shift your taxable income. Supabase-backed persistence will soon track each lever automatically.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/40 bg-brand/10 px-5 py-4 text-sm text-brand-dark">
            <p className="font-semibold">Why this matters</p>
            <p className="mt-2">
              Tax efficiency unlocks extra cash flow you can redirect to goals, protection, and investing. This lab sets the stage for automated insights across withholding, deductions, and conversion planning.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Select a filing profile</p>
              <div className="flex flex-wrap gap-2">
                {filingProfiles.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProfileId(item.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      item.id === profile.id
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-slate-300 text-slate-600 hover:border-brand/50 hover:text-brand'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-600">{profile.description}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Total annual income</span>
                <input
                  type="range"
                  min={40000}
                  max={350000}
                  step={5000}
                  value={annualIncome}
                  onChange={(event) => setAnnualIncome(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(annualIncome)}</span>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Pre-tax contributions</span>
                <input
                  type="range"
                  min={0}
                  max={profile.preTaxLimit}
                  step={1000}
                  value={preTaxContributions}
                  onChange={(event) => setPreTaxContributions(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(preTaxContributions)}</span>
                <p className="text-xs text-slate-500">Limit: {currencyFormatter.format(profile.preTaxLimit)}</p>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">HSA or cafeteria plan contributions</span>
                <input
                  type="range"
                  min={0}
                  max={profile.hsaLimit || 10000}
                  step={250}
                  value={hsaContribution}
                  onChange={(event) => setHsaContribution(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(hsaContribution)}</span>
                {profile.hsaLimit > 0 ? (
                  <p className="text-xs text-slate-500">Limit: {currencyFormatter.format(profile.hsaLimit)}</p>
                ) : (
                  <p className="text-xs text-slate-500">Not HSA eligible — model FSA/other deductions here.</p>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Business deductions / adjustments</span>
                <input
                  type="range"
                  min={0}
                  max={90000}
                  step={1000}
                  value={businessExpenses}
                  onChange={(event) => setBusinessExpenses(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(businessExpenses)}</span>
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">Roth conversion amount</span>
                <input
                  type="range"
                  min={0}
                  max={60000}
                  step={1000}
                  value={rothConversion}
                  onChange={(event) => setRothConversion(Number(event.currentTarget.value))}
                />
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(rothConversion)}</span>
                <p className="text-xs text-slate-500">Use to fill lower tax brackets deliberately.</p>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Taxable income</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{currencyFormatter.format(scenario.taxableIncome)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Estimated tax bill</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{currencyFormatter.format(scenario.estimatedTax)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Annual tax savings</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{currencyFormatter.format(scenario.annualTaxSavings)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Effective tax rate</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{(scenario.effectiveRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold text-brand-dark">Opportunity heatmap</h3>
          <ul className="space-y-3">
            {opportunitySignals.map((signal) => (
              <li key={signal} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{signal}</p>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-dashed border-brand/50 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-wide text-brand">Quarterly planning</p>
            <p className="mt-1 text-base font-semibold text-brand-dark">
              {currencyFormatter.format(scenario.quarterlyEstimate)} per quarter
            </p>
            <p className="mt-1 text-xs text-brand-dark/80">
              Keep this earmarked to hit safe harbour thresholds. Copilot will nudge 2 weeks before each deadline once Supabase persistence lands.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {strategyPlays.map((play) => (
          <article key={play.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{play.title}</h3>
            <p className="text-sm text-slate-600">{play.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Readiness checklist</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>
        <aside className="rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold text-brand-dark">Copilot prompts</h3>
          <ul className="mt-3 space-y-3">
            {copilotPrompts.map((prompt) => (
              <li key={prompt} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{prompt}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Rollout milestones</h3>
          <ul className="mt-4 space-y-4 text-sm text-slate-600">
            {rolloutMilestones.map((milestone) => (
              <li key={milestone.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{milestone.timeframe}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{milestone.label}</p>
                <p className="mt-1 text-sm text-slate-600">{milestone.description}</p>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Guardrails + watchouts</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {guardrails.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
