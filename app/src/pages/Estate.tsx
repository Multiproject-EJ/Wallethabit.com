import { useMemo, useState } from 'react'

type LegacyScenario = {
  id: string
  label: string
  description: string
  estateValue: number
  liquidityCoverage: number
  philanthropicIntent: number
  guardianshipConfidence: number
}

const scenarios: LegacyScenario[] = [
  {
    id: 'builders',
    label: 'Wealth builders',
    description:
      'Dual-career family compressing debt while growing equity comp and brokerage savings. Needs a simple trust with child safeguards.',
    estateValue: 2.4,
    liquidityCoverage: 8,
    philanthropicIntent: 2,
    guardianshipConfidence: 6,
  },
  {
    id: 'solo',
    label: 'Solo professional',
    description:
      'Tech lead with concentrated RSUs, aging parents, and charitable goals. Needs beneficiary updates and donor-advised giving workflow.',
    estateValue: 1.1,
    liquidityCoverage: 5,
    philanthropicIntent: 7,
    guardianshipConfidence: 9,
  },
  {
    id: 'founders',
    label: 'Founder couple',
    description:
      'LLC owners scaling a services firm. Needs operating agreements, key-person insurance, and tax-efficient succession plan.',
    estateValue: 4.8,
    liquidityCoverage: 6,
    philanthropicIntent: 4,
    guardianshipConfidence: 5,
  },
  {
    id: 'caregivers',
    label: 'Sandwich generation',
    description:
      'Caregivers supporting teens plus an elder parent. Needs health proxies, long-term care triggers, and trust funding roadmap.',
    estateValue: 1.9,
    liquidityCoverage: 4,
    philanthropicIntent: 3,
    guardianshipConfidence: 3,
  },
]

const trustStrategies = [
  {
    title: 'Revocable living trust',
    description:
      'Avoids probate, centralises asset titling, and makes successor trustee transitions seamless when incapacity or death occurs.',
  },
  {
    title: 'Will + guardianship package',
    description:
      'Outlines guardians, emergency plans, and asset distribution so minors and dependents are cared for without court delays.',
  },
  {
    title: 'Advanced directives stack',
    description:
      'Durable power of attorney, healthcare proxy, and HIPAA releases keep finances and medical wishes aligned if crises hit.',
  },
  {
    title: 'Philanthropic giving vehicles',
    description:
      'Donor-advised funds, charitable remainder trusts, or legacy scholarships align giving goals with tax-savvy distribution.',
  },
]

const rolloutMilestones = [
  {
    label: 'Legacy data model',
    timeframe: 'Week 1',
    description: 'Create Supabase tables for beneficiaries, trustees, healthcare agents, and estate documents.',
  },
  {
    label: 'Document checklist sync',
    timeframe: 'Week 2',
    description: 'Capture will, trust, insurance, and directive statuses with reminder automation.',
  },
  {
    label: 'Advisor workspace',
    timeframe: 'Week 3',
    description: 'Invite legal/financial pros with scoped access to collaborate on action items.',
  },
  {
    label: 'Copilot legacy nudges',
    timeframe: 'Week 4',
    description: 'AI reminders watch expiring documents, equity cliffs, and beneficiary gaps.',
  },
]

const readinessChecklist = [
  'Inventory titled assets, digital accounts, and insurance policies with owners + beneficiaries.',
  'Capture healthcare preferences, end-of-life wishes, and share the plan with trusted contacts.',
  'Schedule legal reviews every 18–24 months or after major life events to keep documents fresh.',
  'Note outstanding estate taxes, liquidity needs, and insurance to cover settlement costs.',
]

const guardianshipPlaybook = [
  {
    title: 'Emergency bridge plan',
    detail:
      'Fund a high-yield cash account or policy payout instructions that cover 12–18 months of living costs for dependents.',
  },
  {
    title: 'Succession timelines',
    detail:
      'Outline who steps in immediately, within 30 days, and at the 6-month mark for finances, caregiving, and business continuity.',
  },
  {
    title: 'Communication cadence',
    detail:
      'Set quarterly check-ins with guardians and trustees so expectations stay fresh and new needs surface early.',
  },
]

function formatCurrencyMillions(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`
}

export default function Estate() {
  const [scenario, setScenario] = useState<LegacyScenario>(scenarios[0])
  const [estateValue, setEstateValue] = useState(scenario.estateValue)
  const [liquidityCoverage, setLiquidityCoverage] = useState(scenario.liquidityCoverage)
  const [philanthropicIntent, setPhilanthropicIntent] = useState(scenario.philanthropicIntent)
  const [guardianshipConfidence, setGuardianshipConfidence] = useState(scenario.guardianshipConfidence)

  const readinessScore = useMemo(() => {
    const estateWeight = Math.min(estateValue / 5, 1)
    const liquidityWeight = Math.min(liquidityCoverage / 10, 1)
    const givingWeight = philanthropicIntent / 10
    const guardianWeight = guardianshipConfidence / 10
    return Math.round((estateWeight * 0.3 + liquidityWeight * 0.3 + givingWeight * 0.2 + guardianWeight * 0.2) * 100)
  }, [estateValue, liquidityCoverage, philanthropicIntent, guardianshipConfidence])

  const liquidityGap = useMemo(() => {
    const targetMonths = 12
    const gap = targetMonths - liquidityCoverage
    if (gap <= 0) {
      return 'Liquidity runway exceeds 12 months. Consider low-volatility investments for excess reserves.'
    }
    if (gap < 4) {
      return `Add ${gap.toFixed(0)} more months of liquid coverage to comfortably fund estate settlement costs.`
    }
    return 'Prioritise building liquidity reserves (HSA, HYSA, permanent insurance cash value) to cover estate taxes and support dependents.'
  }, [liquidityCoverage])

  const philanthropicSummary = useMemo(() => {
    if (philanthropicIntent >= 7) {
      return 'Lean toward donor-advised or charitable remainder strategies to align tax timing with gifting goals.'
    }
    if (philanthropicIntent >= 4) {
      return 'Document beneficiary percentages and note causes to spotlight in annual family meetings.'
    }
    return 'Keep bequests simple with updated will clauses and transfer-on-death designations for priority accounts.'
  }, [philanthropicIntent])

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
          Estate planning lab preview
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Legacy readiness, choreographed with clarity.</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          Map guardians, trusts, liquidity, and philanthropic goals before engaging legal pros. WalletHabit keeps every detail organised so your legacy stays aligned with your values.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[1.5fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Persona blueprints</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{scenario.label}</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {scenarios.map((option) => (
              <button
                key={option.id}
                className={`flex h-full flex-col rounded-2xl border p-4 text-left transition ${
                  option.id === scenario.id
                    ? 'border-brand/60 bg-brand/5 text-brand'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand/30 hover:bg-brand/5'
                }`}
                onClick={() => {
                  setScenario(option)
                  setEstateValue(option.estateValue)
                  setLiquidityCoverage(option.liquidityCoverage)
                  setPhilanthropicIntent(option.philanthropicIntent)
                  setGuardianshipConfidence(option.guardianshipConfidence)
                }}
              >
                <span className="text-sm font-semibold">{option.label}</span>
                <p className="mt-2 text-xs leading-relaxed text-current">{option.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-semibold uppercase tracking-wide text-current">
                  <span>Estate {formatCurrencyMillions(option.estateValue)}</span>
                  <span>Liquidity {option.liquidityCoverage} mo</span>
                  <span>Giving {option.philanthropicIntent}/10</span>
                  <span>Guardians {option.guardianshipConfidence}/10</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold">Strategy snapshot</h3>
          <p className="mt-2 leading-relaxed">
            Align estate documents, beneficiaries, and liquidity buffers before onboarding legal partners. Each persona blueprint highlights where to focus next so conversations stay actionable.
          </p>
          <div className="mt-4 grid gap-3 text-xs text-brand-dark/80">
            <p>
              <strong>Readiness score:</strong> <span className="text-brand-dark">{readinessScore}/100</span>
            </p>
            <p>
              <strong>Liquidity note:</strong> {liquidityGap}
            </p>
            <p>
              <strong>Giving outlook:</strong> {philanthropicSummary}
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Plan inputs</h2>
          <p className="mt-2 text-sm text-slate-600">
            Tune the assumptions below to see how readiness shifts. WalletHabit will sync these to Supabase once live so your estate team can collaborate asynchronously.
          </p>
          <div className="mt-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Estate value</span>
                <span>{formatCurrencyMillions(estateValue)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0.5}
                max={10}
                step={0.1}
                value={estateValue}
                onChange={(event) => setEstateValue(parseFloat(event.target.value))}
              />
              <p className="mt-1 text-xs text-slate-500">Includes real estate, brokerage, retirement, and business equity.</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Liquidity coverage</span>
                <span>{liquidityCoverage.toFixed(0)} months</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0}
                max={18}
                step={1}
                value={liquidityCoverage}
                onChange={(event) => setLiquidityCoverage(parseInt(event.target.value, 10))}
              />
              <p className="mt-1 text-xs text-slate-500">Cash reserves and insurance payouts ready for settlement costs.</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Philanthropic intent</span>
                <span>{philanthropicIntent}/10</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0}
                max={10}
                step={1}
                value={philanthropicIntent}
                onChange={(event) => setPhilanthropicIntent(parseInt(event.target.value, 10))}
              />
              <p className="mt-1 text-xs text-slate-500">Score how important structured giving is to your plan.</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Guardianship confidence</span>
                <span>{guardianshipConfidence}/10</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0}
                max={10}
                step={1}
                value={guardianshipConfidence}
                onChange={(event) => setGuardianshipConfidence(parseInt(event.target.value, 10))}
              />
              <p className="mt-1 text-xs text-slate-500">Reflects conversation progress with guardians, trustees, and agents.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-5 text-sm text-slate-700">
            <p>
              <strong>Impact preview:</strong> Updating these sliders will soon trigger Copilot nudges, attorney preparation packets, and Supabase-backed reminders.
            </p>
            <p>
              <strong>Next iteration:</strong> Attach secure document uploads and timeline tracking so everyone knows what is signed, notarised, and outstanding.
            </p>
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Trust strategies</h3>
          <p className="text-sm text-slate-600">
            Mix and match the playbooks below to draft a legacy plan before meeting your attorney.
          </p>
          <div className="mt-2 space-y-3">
            {trustStrategies.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.title}</p>
                <p className="mt-2 text-sm text-slate-700">{item.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Readiness checklist</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Guardianship playbook</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            {guardianshipPlaybook.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.title}</p>
                <p className="mt-2 text-sm text-slate-700">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Rollout milestones</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rolloutMilestones.map((step) => (
            <article key={step.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{step.timeframe}</p>
              <h4 className="mt-2 text-base font-semibold text-slate-900">{step.label}</h4>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
