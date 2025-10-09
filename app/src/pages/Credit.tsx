import { useMemo, useState } from 'react'

const scoreBands = [
  {
    label: 'Needs rebuild',
    range: '300-579',
    description: 'Repair focus — automate payments, shrink utilization, and dispute errors.',
  },
  {
    label: 'Fair footing',
    range: '580-669',
    description: 'Momentum building — keep balances low and age accounts before new credit.',
  },
  {
    label: 'Ready to leverage',
    range: '670-739',
    description: 'Solid track record — optimise mix and prep for premium rewards approvals.',
  },
  {
    label: 'Prime territory',
    range: '740-799',
    description: 'Preferred rates unlocked — monitor inquiries and preserve stellar payment history.',
  },
  {
    label: 'Elite tier',
    range: '800-850',
    description: 'Max leverage — focus on long-term average age and concierge-level relationship perks.',
  },
]

const mixProfiles = [
  {
    id: 'foundational',
    label: 'Foundational mix',
    revolving: 1,
    installment: 1,
    narrative: 'Starter blend of one cashback card plus a credit builder loan to establish history.',
    score: 72,
  },
  {
    id: 'balanced',
    label: 'Balanced mix',
    revolving: 2,
    installment: 1,
    narrative: 'Two primary cards and an auto/student loan with spotless payment history.',
    score: 90,
  },
  {
    id: 'builder',
    label: 'Leveraged mix',
    revolving: 3,
    installment: 2,
    narrative: 'Diverse mix with travel card, cashback card, and installment accounts managed responsibly.',
    score: 96,
  },
]

const actionPlans = [
  {
    id: 'stabilise',
    label: 'Stabilise essentials',
    focus: 'Repair mode',
    narrative:
      'Automate minimums, funnel cashflow toward high-utilization cards, and set up bureaus alerts to capture disputes fast.',
    timeline: '30-day sprint',
  },
  {
    id: 'optimise',
    label: 'Optimise utilisation',
    focus: 'Momentum mode',
    narrative:
      'Stack on-time payments, spread spend across cards to keep each under 9%, and negotiate higher limits for healthy ratios.',
    timeline: '60-day plan',
  },
  {
    id: 'elevate',
    label: 'Elevate to prime',
    focus: 'Growth mode',
    narrative:
      'Age accounts, product-change into premium cards, and route new inquiries only when they advance life or business goals.',
    timeline: '90-day horizon',
  },
]

const readinessChecklist = [
  'Confirm automated payments on every revolving and installment account to lock in on-time history.',
  'List each card limit and balance so utilisation can be monitored weekly.',
  'Pull bureau reports to validate there are no surprise derogatories before new applications.',
  'Draft a playbook for retention calls and product changes to avoid closing seasoned accounts.',
]

const rolloutMilestones = [
  {
    label: 'Credit profile schema',
    timeframe: 'Week 1',
    description: 'Model tradeline tables in Supabase for balances, limits, and payment histories.',
  },
  {
    label: 'Utilisation tracker',
    timeframe: 'Week 2',
    description: 'Persist utilisation targets and live ratios from Plaid imports for timely nudges.',
  },
  {
    label: 'Dispute workflow',
    timeframe: 'Week 3',
    description: 'Log disputes, bureau deadlines, and outcomes with reminders synced to Copilot.',
  },
  {
    label: 'Reward optimisation',
    timeframe: 'Week 4',
    description: 'Surface playbooks for rotating category cards and travel partners tied to spend habits.',
  },
]

const monitoringCadence = [
  'Weekly: check utilisation after payments post and update the card snapshot.',
  'Monthly: log bureau scores, flag changes over ±10 points, and annotate likely drivers.',
  'Quarterly: review product-change opportunities, retention offers, and limit increase requests.',
  'Annually: refresh insurance quotes, mortgage readiness, and travel goal alignment with credit strategy.',
]

type PlanId = (typeof actionPlans)[number]['id']
type MixId = (typeof mixProfiles)[number]['id']

export default function Credit() {
  const [utilisation, setUtilisation] = useState(28)
  const [onTimeRate, setOnTimeRate] = useState(97)
  const [averageAge, setAverageAge] = useState(6)
  const [inquiries, setInquiries] = useState(2)
  const [activePlan, setActivePlan] = useState<PlanId>('optimise')
  const [mixProfile, setMixProfile] = useState<MixId>('balanced')

  const mixScore = useMemo(
    () => mixProfiles.find((item) => item.id === mixProfile)?.score ?? mixProfiles[0].score,
    [mixProfile],
  )

  const scoreEstimate = useMemo(() => {
    const paymentHistoryScore = onTimeRate
    const utilisationScore = Math.max(0, 100 - utilisation * 1.1)
    const ageScore = Math.min(100, (averageAge / 12) * 100)
    const inquiryScore = Math.max(40, 100 - inquiries * 12)

    const weighted =
      paymentHistoryScore * 0.35 +
      utilisationScore * 0.3 +
      ageScore * 0.15 +
      mixScore * 0.1 +
      inquiryScore * 0.1

    return Math.round(300 + (weighted / 100) * 550)
  }, [averageAge, inquiries, mixScore, onTimeRate, utilisation])

  const selectedPlan = useMemo(
    () => actionPlans.find((plan) => plan.id === activePlan) ?? actionPlans[0],
    [activePlan],
  )

  const scoreBand = useMemo(() => {
    if (scoreEstimate >= 800) return scoreBands[4]
    if (scoreEstimate >= 740) return scoreBands[3]
    if (scoreEstimate >= 670) return scoreBands[2]
    if (scoreEstimate >= 580) return scoreBands[1]
    return scoreBands[0]
  }, [scoreEstimate])

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-brand">Credit health lab</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Build a resilient credit foundation</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          Model how payment history, utilisation, account age, and new inquiries influence your score trajectory. WalletHabit
          will soon sync tradelines and reminders so this lab evolves into a personalised maintenance cockpit.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand">
          <span className="inline-flex h-2 w-2 rounded-full bg-brand"></span>
          Scenario sandbox — Supabase persistence ships next
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.4fr,1.6fr]">
        <article className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Estimated score</p>
              <p className="mt-2 text-5xl font-bold text-slate-900">{scoreEstimate}</p>
              <p className="mt-2 text-sm text-slate-600">{scoreBand.description}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-right text-xs text-slate-500">
              <p className="font-semibold text-slate-900">Band: {scoreBand.label}</p>
              <p>Range {scoreBand.range}</p>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-700">Payment history</span>
              <span className="font-semibold text-slate-900">{onTimeRate}% on-time</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-700">Utilisation</span>
              <span className="font-semibold text-slate-900">{utilisation}%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-700">Average account age</span>
              <span className="font-semibold text-slate-900">{averageAge} yrs</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-700">Recent inquiries</span>
              <span className="font-semibold text-slate-900">{inquiries}</span>
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-slate-900">Tune your credit levers</h2>
            <p className="text-sm text-slate-600">
              Adjust the current state of your profile to see how it shifts the projected score. These inputs will be stored per
              profile once Supabase is wired up so progress tracking stays in sync across devices.
            </p>
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-700">On-time payment rate</span>
              <input
                type="range"
                min={70}
                max={100}
                step={1}
                value={onTimeRate}
                onChange={(event) => setOnTimeRate(Number(event.target.value))}
              />
              <span className="text-xs text-slate-500">{onTimeRate}% of payments reported on time</span>
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-700">Total utilisation</span>
              <input
                type="range"
                min={1}
                max={95}
                step={1}
                value={utilisation}
                onChange={(event) => setUtilisation(Number(event.target.value))}
              />
              <span className="text-xs text-slate-500">Balances ÷ limits. Aim for &lt; 9% before statement cuts.</span>
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-700">Average account age</span>
              <input
                type="range"
                min={0}
                max={18}
                step={1}
                value={averageAge}
                onChange={(event) => setAverageAge(Number(event.target.value))}
              />
              <span className="text-xs text-slate-500">Seasoning across open tradelines in years.</span>
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-700">Hard inquiries (last 12 months)</span>
              <input
                type="range"
                min={0}
                max={8}
                step={1}
                value={inquiries}
                onChange={(event) => setInquiries(Number(event.target.value))}
              />
              <span className="text-xs text-slate-500">Plan applications around major goals to protect your mix.</span>
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Credit mix focus</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {mixProfiles.map((profile) => {
                const isActive = profile.id === mixProfile
                return (
                  <button
                    key={profile.id}
                    onClick={() => setMixProfile(profile.id)}
                    className={[
                      'flex h-full flex-col gap-2 rounded-2xl border p-4 text-left text-sm transition',
                      isActive
                        ? 'border-brand bg-brand/10 text-brand-dark shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-brand/40 hover:bg-white hover:text-slate-900',
                    ].join(' ')}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{profile.label}</p>
                    <p className="text-xs text-slate-500">
                      {profile.revolving} revolving · {profile.installment} installment
                    </p>
                    <p className="text-xs text-slate-600">{profile.narrative}</p>
                    <div className="mt-auto inline-flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs">
                      <span className="font-semibold text-slate-900">Mix score</span>
                      <span className="font-semibold text-brand">{profile.score}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr,1.4fr]">
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Action plan spotlight</h2>
          <p className="text-sm text-slate-600">
            Choose the plan that mirrors your current goals. WalletHabit Copilot will eventually use this selection to stage
            weekly check-ins, dispute reminders, and celebratory unlocks when milestones are hit.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {actionPlans.map((plan) => {
              const isActive = plan.id === activePlan
              return (
                <button
                  key={plan.id}
                  onClick={() => setActivePlan(plan.id)}
                  className={[
                    'flex h-full flex-col gap-3 rounded-2xl border p-4 text-left text-sm transition',
                    isActive
                      ? 'border-brand bg-brand/10 text-brand-dark shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-brand/40 hover:bg-white hover:text-slate-900',
                  ].join(' ')}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{plan.focus}</p>
                  <h3 className="text-base font-semibold text-slate-900">{plan.label}</h3>
                  <p className="text-xs text-slate-600">{plan.narrative}</p>
                  <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold">
                    <span className="inline-flex h-2 w-2 rounded-full bg-brand"></span>
                    {plan.timeline}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Current focus:</p>
            <p className="mt-1 text-slate-600">{selectedPlan.narrative}</p>
          </div>
        </article>

        <aside className="flex flex-col gap-4 rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold text-brand-dark">Monitoring cadence</h3>
          <ul className="space-y-3">
            {monitoringCadence.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Readiness checklist</h2>
          <ul className="mt-2 space-y-3 text-sm text-slate-600">
            {readinessChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Rollout milestones</h2>
          <ul className="mt-2 space-y-3 text-sm text-slate-600">
            {rolloutMilestones.map((milestone) => (
              <li key={milestone.label} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand"></span>
                <div>
                  <p className="font-semibold text-slate-900">{milestone.label}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{milestone.timeframe}</p>
                  <p className="mt-1 text-sm text-slate-600">{milestone.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
