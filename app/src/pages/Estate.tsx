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

  const readinessInsight = useMemo(() => {
    if (readinessScore >= 85) {
      return {
        status: 'Legacy in motion',
        message: 'Keep automations humming and prep advisor-ready summaries so every document stays fresh.',
      }
    }
    if (readinessScore >= 65) {
      return {
        status: 'Momentum building',
        message: 'You have the core pieces forming. Lock in liquidity moves and share vault invites with your trusted circle.',
      }
    }
    return {
      status: 'Lay the groundwork',
      message: 'Anchor the basics — confirm beneficiaries, draft directives, and map liquidity so the legacy engine can activate.',
    }
  }, [readinessScore])

  const liquidityInsight = useMemo(() => {
    const runwayPercent = Math.round(Math.min(1, liquidityCoverage / 12) * 100)

    if (liquidityCoverage >= 12) {
      return {
        label: 'Runway ready',
        detail: 'Liquidity extends beyond 12 months. Consider low-volatility buckets for excess reserves.',
        percent: runwayPercent,
      }
    }
    if (liquidityCoverage >= 8) {
      return {
        label: 'Closing the gap',
        detail: 'You are a few moves from a full year of liquidity. Route upcoming bonuses or RSUs to finish the cushion.',
        percent: runwayPercent,
      }
    }
    return {
      label: 'Build the cushion',
      detail: 'Prioritise liquid reserves (HYSA, policy cash value) to cover estate settlement and support dependents.',
      percent: runwayPercent,
    }
  }, [liquidityCoverage])

  const philanthropicInsight = useMemo(() => {
    const givingPercent = Math.round((philanthropicIntent / 10) * 100)

    if (philanthropicIntent >= 7) {
      return {
        label: 'Giving strategist',
        detail: 'Lean toward donor-advised or charitable remainder strategies to sync taxes with your impact plan.',
        percent: givingPercent,
      }
    }
    if (philanthropicIntent >= 4) {
      return {
        label: 'Cause curator',
        detail: 'Document beneficiary percentages and highlight causes for annual family meetings or advisor syncs.',
        percent: givingPercent,
      }
    }
    return {
      label: 'Keep it simple',
      detail: 'Updated will clauses and transfer-on-death designations keep distributions aligned without complexity.',
      percent: givingPercent,
    }
  }, [philanthropicIntent])

  const guardianshipInsight = useMemo(() => {
    const guardianPercent = Math.round((guardianshipConfidence / 10) * 100)

    if (guardianshipConfidence >= 8) {
      return {
        label: 'Trusted circle aligned',
        detail: 'Reinforce annual briefings and share your secure vault so every guardian knows the playbook.',
        percent: guardianPercent,
      }
    }
    if (guardianshipConfidence >= 5) {
      return {
        label: 'Great baseline',
        detail: 'Clarify who handles finances versus caregiving and capture contact trees for quick activation.',
        percent: guardianPercent,
      }
    }
    return {
      label: 'Design the roster',
      detail: 'Short-list guardians and successor trustees, then draft expectations together to reduce decision fatigue later.',
      percent: guardianPercent,
    }
  }, [guardianshipConfidence])

  const liquidityProgress = Math.min(100, Math.round((liquidityCoverage / 12) * 100))
  const philanthropicProgress = Math.min(100, Math.round((philanthropicIntent / 10) * 100))
  const guardianshipProgress = Math.min(100, Math.round((guardianshipConfidence / 10) * 100))

  return (
    <div className="flex flex-1 flex-col gap-12 pb-20">
      <header className="relative overflow-hidden rounded-[32px] border border-emerald-200/40 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-800 px-10 py-12 text-white shadow-[0_24px_80px_-32px_rgba(15,118,110,0.55)]">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -left-28 -top-32 h-72 w-72 rounded-full bg-primary-light/40 blur-3xl" />
          <div className="absolute bottom-[-60px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute -right-28 top-12 h-72 w-72 rounded-full bg-coral/40 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
              Estate lab
            </span>
            <h1 className="text-3xl font-semibold sm:text-4xl">Legacy readiness, choreographed with clarity.</h1>
            <p className="max-w-3xl text-sm text-emerald-50/80">
              Map guardians, trusts, liquidity, and philanthropic goals before engaging legal pros. WalletHabit keeps every detail organised so your legacy stays aligned with your values and Copilot can surface the next best move.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="flex flex-col gap-5 rounded-3xl border border-white/20 bg-white/10 p-6 text-sm backdrop-blur-lg">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-emerald-100/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-white">
                  <span className="h-2 w-2 rounded-full bg-primary-light" /> {scenario.label}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-emerald-50">
                  Estate {formatCurrencyMillions(estateValue)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-emerald-50">
                  Liquidity {liquidityCoverage.toFixed(0)} mo
                </span>
              </div>
              <p className="text-base leading-relaxed text-emerald-50/90">{scenario.description}</p>
            </div>

            <div className="flex flex-col justify-between gap-5 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100/80">Readiness pulse</p>
                  <div className="mt-3 flex items-end gap-3">
                    <span className="text-4xl font-semibold text-white">{readinessScore}%</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-50">
                      {readinessInsight.status}
                    </span>
                  </div>
                </div>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-50">
                  Automations ship soon
                </span>
              </div>
              <p className="text-xs leading-relaxed text-emerald-50/80">{readinessInsight.message}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100/70">Estate outlook</p>
              <p className="mt-2 text-xl font-semibold text-white">{formatCurrencyMillions(estateValue)}</p>
              <p className="mt-1 text-xs text-emerald-50/80">Projected estate value including property, investments, and business equity.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100/70">Liquidity runway</p>
              <p className="mt-2 text-xl font-semibold text-white">{liquidityCoverage.toFixed(0)} months</p>
              <p className="mt-1 text-xs text-emerald-50/80">Aim for 12 months of accessible funds to cover estate settlement.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100/70">Giving energy</p>
              <p className="mt-2 text-xl font-semibold text-white">{philanthropicIntent}/10</p>
              <p className="mt-1 text-xs text-emerald-50/80">Document charitable priorities so automations can honour your intent.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100/70">Guardian confidence</p>
              <p className="mt-2 text-xl font-semibold text-white">{guardianshipConfidence}/10</p>
              <p className="mt-1 text-xs text-emerald-50/80">Share vault access and contact cadences to keep the team aligned.</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-8 xl:grid-cols-[1.45fr,1fr]">
        <article className="flex flex-col gap-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-7 shadow-uplift">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Persona blueprints</h2>
            <p className="text-sm text-slate-600">
              Select the scenario that mirrors your household. WalletHabit will soon sync these profiles so Copilot can pre-build planning packets for attorneys and advisors.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {scenarios.map((option) => {
              const isActive = option.id === scenario.id
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`flex h-full flex-col justify-between gap-4 rounded-3xl border p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                    isActive
                      ? 'border-brand/60 bg-gradient-to-br from-brand/10 via-white to-brand/5 text-brand-dark shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand/40 hover:bg-brand/5'
                  }`}
                  onClick={() => {
                    setScenario(option)
                    setEstateValue(option.estateValue)
                    setLiquidityCoverage(option.liquidityCoverage)
                    setPhilanthropicIntent(option.philanthropicIntent)
                    setGuardianshipConfidence(option.guardianshipConfidence)
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold uppercase tracking-wide">{option.label}</span>
                    <p className="text-xs leading-relaxed text-current/80">{option.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10px] font-semibold uppercase tracking-wide text-current/70">
                    <span>Estate {formatCurrencyMillions(option.estateValue)}</span>
                    <span>Liquidity {option.liquidityCoverage} mo</span>
                    <span>Giving {option.philanthropicIntent}/10</span>
                    <span>Guardians {option.guardianshipConfidence}/10</span>
                  </div>
                </button>
              )
            })}
          </div>
        </article>

        <aside className="flex flex-col gap-5 rounded-[28px] border border-emerald-100 bg-sand/80 p-7 text-sm text-slate-700 shadow-inner">
          <h3 className="text-base font-semibold text-slate-900">Legacy momentum dashboard</h3>
          <div className="rounded-2xl border border-emerald-200/80 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Readiness score</span>
              <span className="text-2xl font-semibold text-primary-dark">{readinessScore}%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
              <div className="h-full rounded-full bg-primary-light" style={{ width: `${readinessScore}%` }} />
            </div>
            <p className="mt-3 text-xs text-slate-500">{readinessInsight.message}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200/70 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{liquidityInsight.label}</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-semibold text-primary-dark">{liquidityCoverage.toFixed(0)} mo</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary-dark">{liquidityInsight.percent}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-primary/10">
                <div className="h-full rounded-full bg-primary-light" style={{ width: `${liquidityProgress}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{liquidityInsight.detail}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/70 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{philanthropicInsight.label}</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-semibold text-primary-dark">{philanthropicIntent}/10</span>
                <span className="rounded-full bg-coral/10 px-3 py-1 text-[11px] font-semibold text-coral">{philanthropicInsight.percent}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-coral/10">
                <div className="h-full rounded-full bg-coral" style={{ width: `${philanthropicProgress}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{philanthropicInsight.detail}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/70 bg-white p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{guardianshipInsight.label}</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-semibold text-primary-dark">{guardianshipConfidence}/10</span>
                <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold">{guardianshipInsight.percent}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gold/10">
                <div className="h-full rounded-full bg-gold" style={{ width: `${guardianshipProgress}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{guardianshipInsight.detail}</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.6fr,1fr]">
        <article className="flex flex-col gap-8 rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-uplift">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Plan tuning controls</h3>
            <p className="text-sm text-slate-600">
              Adjust the sliders to preview how readiness shifts. These inputs will soon sync to Supabase so your estate team collaborates asynchronously with live assumptions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-sand p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Estate value</span>
              <input
                className="w-full accent-brand"
                type="range"
                min={0.5}
                max={10}
                step={0.1}
                value={estateValue}
                onChange={(event) => setEstateValue(parseFloat(event.target.value))}
              />
              <span className="text-lg font-semibold text-slate-900">{formatCurrencyMillions(estateValue)}</span>
              <p className="text-xs text-slate-500">Includes real estate, brokerage, retirement, and business equity.</p>
            </label>

            <label className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-sand p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Liquidity coverage</span>
              <input
                className="w-full accent-brand"
                type="range"
                min={0}
                max={18}
                step={1}
                value={liquidityCoverage}
                onChange={(event) => setLiquidityCoverage(parseInt(event.target.value, 10))}
              />
              <span className="text-lg font-semibold text-slate-900">{liquidityCoverage.toFixed(0)} months</span>
              <p className="text-xs text-slate-500">Cash reserves and insurance payouts ready for settlement costs.</p>
            </label>

            <label className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-sand p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Philanthropic intent</span>
              <input
                className="w-full accent-brand"
                type="range"
                min={0}
                max={10}
                step={1}
                value={philanthropicIntent}
                onChange={(event) => setPhilanthropicIntent(parseInt(event.target.value, 10))}
              />
              <span className="text-lg font-semibold text-slate-900">{philanthropicIntent}/10</span>
              <p className="text-xs text-slate-500">Score how important structured giving is to your plan.</p>
            </label>

            <label className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-sand p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Guardianship confidence</span>
              <input
                className="w-full accent-brand"
                type="range"
                min={0}
                max={10}
                step={1}
                value={guardianshipConfidence}
                onChange={(event) => setGuardianshipConfidence(parseInt(event.target.value, 10))}
              />
              <span className="text-lg font-semibold text-slate-900">{guardianshipConfidence}/10</span>
              <p className="text-xs text-slate-500">Reflects conversation progress with guardians, trustees, and agents.</p>
            </label>
          </div>

          <div className="rounded-3xl border border-dashed border-brand/40 bg-brand/5 p-6 text-sm text-slate-700">
            <p>
              <strong>Impact preview:</strong> Updating these sliders will soon trigger Copilot nudges, attorney preparation packets, and Supabase-backed reminders.
            </p>
            <p className="mt-3">
              <strong>Next iteration:</strong> Attach secure document uploads and timeline tracking so everyone knows what is signed, notarised, and outstanding.
            </p>
          </div>
        </article>

        <aside className="flex flex-col gap-5 rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-uplift">
          <h3 className="text-base font-semibold text-slate-900">Trust strategies</h3>
          <p className="text-sm text-slate-600">
            Mix and match the playbooks below to draft a legacy plan before meeting your attorney.
          </p>
          <div className="mt-2 space-y-3">
            {trustStrategies.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-sand p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.title}</p>
                <p className="mt-2 text-sm text-slate-700">{item.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="flex flex-col gap-5 rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-uplift">
          <h3 className="text-lg font-semibold text-slate-900">Readiness checklist</h3>
          <ul className="space-y-4 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>
        <article className="flex flex-col gap-5 rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-uplift">
          <h3 className="text-lg font-semibold text-slate-900">Guardianship playbook</h3>
          <div className="space-y-4 text-sm text-slate-600">
            {guardianshipPlaybook.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-sand p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.title}</p>
                <p className="mt-2 text-sm text-slate-700">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-uplift">
        <h3 className="text-lg font-semibold text-slate-900">Rollout roadmap</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {rolloutMilestones.map((step) => (
            <article key={step.label} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-sand p-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{step.timeframe}</span>
              <h4 className="text-base font-semibold text-slate-900">{step.label}</h4>
              <p className="text-sm text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
