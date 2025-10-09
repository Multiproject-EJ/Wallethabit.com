import { useEffect, useMemo, useState } from 'react'

import type { DemoProfile } from '../lib/demoData'
import { useDemoData } from '../lib/demoDataStore'

type RangeControl = { min: number; max: number; step: number }

type Persona = {
  id: string
  label: string
  description: string
  emergencyMonths: number
  lifeMultiplier: number
  disabilityIncomeRate: number
  familyFactor: number
}

type Playbook = { title: string; description: string }

type Milestone = { label: string; timeframe: string; description: string }

type SupportChannel = { label: string; description: string }

type RegionDefaults = {
  personaId: string
  annualIncome: number
  monthlyExpenses?: number
  coverageMonths: number
  emergencySavings: number
  lifeCoverage: number
  disabilityCoverage: number
}

type RegionConfig = {
  hero: { badge: string; title: string; description: string }
  coverageIntro: string
  defaults: RegionDefaults
  controls: {
    annualIncome: RangeControl
    monthlyExpenses: RangeControl
    emergencySavings: RangeControl
    lifeCoverage: RangeControl
    disabilityCoverage: RangeControl
  }
  personas: Persona[]
  playbooks: Playbook[]
  readinessChecklist: string[]
  guardrails: string[]
  signalBeacons: string[]
  supportChannels: SupportChannel[]
  rolloutMilestones: Milestone[]
  coverageIntelligence: string[]
}

const coverageMonthsControl = { min: 3, max: 18, step: 1 } as const

const clampToRange = (value: number, range: RangeControl) =>
  Math.min(range.max, Math.max(range.min, value))
const regionConfigs: Record<DemoProfile['region'], RegionConfig> = {
  uk: {
    hero: {
      badge: 'Safety net studio',
      title: 'Keep your UK safety net storm-ready',
      description:
        'Balance Monzo pots, Chase Savings, and policy renewals so Alex Rivera can ride out surprises without panic.',
    },
    coverageIntro:
      'WalletHabit keeps watch over Monzo pots, Chase Savings, and renewal dates so your UK safety net never drifts offside.',
    defaults: {
      personaId: 'solo-creative',
      annualIncome: 62000,
      monthlyExpenses: 2650,
      coverageMonths: 6,
      emergencySavings: 4200,
      lifeCoverage: 150000,
      disabilityCoverage: 2200,
    },
    controls: {
      annualIncome: { min: 30000, max: 160000, step: 5000 },
      monthlyExpenses: { min: 1500, max: 6500, step: 50 },
      emergencySavings: { min: 0, max: 50000, step: 500 },
      lifeCoverage: { min: 0, max: 900000, step: 10000 },
      disabilityCoverage: { min: 0, max: 6000, step: 100 },
    },
    personas: [
      {
        id: 'solo-creative',
        label: 'Solo creative in London',
        description:
          'Single renter with freelance spikes. Prioritises rainy-day cash and income protection while debt trims down.',
        emergencyMonths: 6,
        lifeMultiplier: 3.5,
        disabilityIncomeRate: 0.55,
        familyFactor: 0,
      },
      {
        id: 'partnered-renters',
        label: 'Partnered renters',
        description:
          'Two incomes splitting rent in Zone 2. Focus on a 6–9 month runway and joint cover while saving for a deposit.',
        emergencyMonths: 7,
        lifeMultiplier: 5,
        disabilityIncomeRate: 0.6,
        familyFactor: 60000,
      },
      {
        id: 'young-family',
        label: 'Young family',
        description:
          'Parents juggling childcare and rent. Needs longer runway, family life insurance, and childcare back-up plans.',
        emergencyMonths: 9,
        lifeMultiplier: 8,
        disabilityIncomeRate: 0.65,
        familyFactor: 120000,
      },
      {
        id: 'independent-contractor',
        label: 'Independent contractor',
        description:
          'Limited company director with variable dividends. Builds a 9–12 month runway and bespoke income protection.',
        emergencyMonths: 10,
        lifeMultiplier: 6,
        disabilityIncomeRate: 0.5,
        familyFactor: 40000,
      },
    ],
    playbooks: [
      {
        title: 'Income protection check-in',
        description:
          'Compare statutory sick pay with employer and personal policies to spot cover gaps before renewals.',
      },
      {
        title: 'Freelance smoothing pot',
        description:
          'Sweep side-hustle profit into a labelled Monzo pot so rainy-day reserves refill automatically.',
      },
      {
        title: 'Policy renewal ritual',
        description:
          'Schedule a quarterly review to confirm renter\'s, phone, and contents cover still match your gear and rent.',
      },
    ],
    readinessChecklist: [
      'Tag Monzo and Chase pots that make up your safety net so Copilot can watch balances against runway goals.',
      'Document employer benefits, statutory sick pay, and personal policies inside the vault with renewal dates.',
      'Set reminders to review income protection and critical illness quotes before each freelance season.',
      'List emergency contacts and handoff instructions so someone can trigger rent and debt payments on your behalf.',
    ],
    guardrails: [
      'Keep rainy-day balances above 3× essential spend before adding new subscriptions.',
      'Cap total insurance premiums at under 8% of take-home pay while debts are clearing.',
      'Review beneficiaries on workplace pension, ISA, and insurance policies every April.',
      'Ensure tax set-aside pots stay separate from emergency funds to avoid last-minute scrambles.',
    ],
    signalBeacons: [
      'Rainy-day pots hold 6+ months of essential costs across Monzo and Chase.',
      'Income protection or sick pay coverage reaches at least 60% of take-home pay.',
      'Policy renewals logged with zero outstanding tasks in the vault.',
      'Emergency rehearsal checklist reviewed twice a year.',
    ],
    supportChannels: [
      {
        label: 'Independent protection broker',
        description:
          'Source income protection and critical illness quotes tailored to contractors and creatives.',
      },
      {
        label: 'Insurance renewal concierge',
        description: 'Keep renter\'s, phone, and contents policies aligned with your inventory automatically.',
      },
      {
        label: 'Emergency planning workshop',
        description: 'Draft handoff instructions and contact trees with a facilitator in one focused session.',
      },
    ],
    rolloutMilestones: [
      {
        label: 'Safety net schema',
        timeframe: 'Week 1',
        description: 'Model emergency pots, policies, and beneficiaries with UK-ready fields.',
      },
      {
        label: 'Bank feed tagging',
        timeframe: 'Week 2',
        description: 'Ingest Monzo and Chase transactions to trend rainy-day balances and premiums.',
      },
      {
        label: 'Copilot guardrails',
        timeframe: 'Week 3',
        description: 'Trigger alerts when pots dip below runway or renewals near their dates.',
      },
      {
        label: 'Advisor workspace',
        timeframe: 'Week 4',
        description: 'Share region-specific summaries with brokers or planners for reviews.',
      },
    ],
    coverageIntelligence: [
      'Track Monzo pots labelled "Safety Net" to warn when the runway slips below target.',
      'Pre-fill renewal dates so you get nudges 30 days before renter\'s or phone cover lapses.',
      'Surface side-hustle income streaks and suggest routing a slice to rainy-day reserves.',
    ],
  },
  us: {
    hero: {
      badge: 'Protection lab',
      title: 'Build a resilient safety net before storms roll in',
      description:
        'Shape emergency reserves, align employer benefits, and document policies so US households stay resilient while WalletHabit connects live data.',
    },
    coverageIntro:
      'WalletHabit keeps watch on runways, policies, and beneficiaries. When thresholds slip, your copilot will tee up quotes, savings boosts, or advisor nudges so the plan stays calm.',
    defaults: {
      personaId: 'foundation',
      annualIncome: 115000,
      monthlyExpenses: 5200,
      coverageMonths: 6,
      emergencySavings: 18000,
      lifeCoverage: 400000,
      disabilityCoverage: 3500,
    },
    controls: {
      annualIncome: { min: 40000, max: 220000, step: 5000 },
      monthlyExpenses: { min: 2500, max: 9000, step: 250 },
      emergencySavings: { min: 0, max: 90000, step: 1000 },
      lifeCoverage: { min: 0, max: 1500000, step: 25000 },
      disabilityCoverage: { min: 0, max: 10000, step: 250 },
    },
    personas: [
      {
        id: 'foundation',
        label: 'Foundation builder',
        description:
          'Single income, early career, wants a durable buffer while investments ramp.',
        emergencyMonths: 4,
        lifeMultiplier: 6,
        disabilityIncomeRate: 0.6,
        familyFactor: 0,
      },
      {
        id: 'family',
        label: 'Family guardian',
        description:
          'Dual income household with kids and a mortgage — prioritises continuity.',
        emergencyMonths: 6,
        lifeMultiplier: 8,
        disabilityIncomeRate: 0.65,
        familyFactor: 150000,
      },
      {
        id: 'builder',
        label: 'Momentum investor',
        description:
          'High savings rate, entrepreneurial income, and variable quarterly draws.',
        emergencyMonths: 8,
        lifeMultiplier: 7,
        disabilityIncomeRate: 0.55,
        familyFactor: 75000,
      },
      {
        id: 'legacy',
        label: 'Legacy planner',
        description:
          'Approaching financial independence, coordinates estate and caregiving support.',
        emergencyMonths: 12,
        lifeMultiplier: 5,
        disabilityIncomeRate: 0.5,
        familyFactor: 200000,
      },
    ],
    playbooks: [
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
    ],
    readinessChecklist: [
      'Upload policy PDFs and renewal reminders into the vault for quick reference.',
      'Track dependants and monthly obligations so Copilot can recommend coverage levels automatically.',
      'Connect bank accounts to monitor safety-net balances alongside investments.',
      'Draft a one-page emergency playbook with who to call, what to pause, and income levers to activate.',
    ],
    guardrails: [
      'Keep emergency reserves above 3× recurring monthly expenses before increasing investing risk.',
      'Cap total insurance premiums at <10% of gross income while gaps are shrinking.',
      'Review beneficiaries and policy riders every open enrolment or major life change.',
      'Align estate documents and digital vault permissions with the latest protection plan.',
    ],
    signalBeacons: [
      'Emergency fund balance trends above the target runway for three consecutive months.',
      'Insurance coverage gap shrinks below 10% of recommended levels.',
      'Copilot check-ins log annual policy reviews with action items resolved.',
      'Dependants have verified access instructions stored in the readiness vault.',
    ],
    supportChannels: [
      {
        label: 'Benefits review session',
        description:
          'Capture employer-provided coverage, elimination periods, and optional riders to close gaps.',
      },
      {
        label: 'Insurance marketplace pilot',
        description:
          'Preview partner brokers with embedded quotes for term life, disability, and umbrella add-ons.',
      },
      {
        label: 'Estate toolkit',
        description:
          'Assemble will templates, healthcare proxies, and secure document storage into one workflow.',
      },
    ],
    rolloutMilestones: [
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
    ],
    coverageIntelligence: [
      'Sync emergency and premium transactions to trend against your runway targets in real time.',
      'Surface open-enrolment reminders so employer benefits and personal policies stay dialled in.',
      'Generate advisor-ready summaries that highlight coverage gaps, beneficiaries, and next steps.',
    ],
  },
  no: {
    hero: {
      badge: 'Sikkerhetsnett lab',
      title: 'Hold trygghetsbufferen din klar i Norge',
      description:
        'Map NAV benefits alongside private cover and savings so Norwegian households can react fast to job changes or illness.',
    },
    coverageIntro:
      'WalletHabit tracks NAV coverage, private policies, and savings buckets so the safety net stays predictable even when income fluctuates.',
    defaults: {
      personaId: 'oslo-solo',
      annualIncome: 780000,
      monthlyExpenses: 38000,
      coverageMonths: 6,
      emergencySavings: 120000,
      lifeCoverage: 2000000,
      disabilityCoverage: 28000,
    },
    controls: {
      annualIncome: { min: 450000, max: 1500000, step: 25000 },
      monthlyExpenses: { min: 20000, max: 80000, step: 1000 },
      emergencySavings: { min: 0, max: 600000, step: 5000 },
      lifeCoverage: { min: 0, max: 6000000, step: 50000 },
      disabilityCoverage: { min: 0, max: 80000, step: 1000 },
    },
    personas: [
      {
        id: 'oslo-solo',
        label: 'Solo in Oslo',
        description:
          'Single knowledge worker renting in Oslo. Prioritises 6–9 month buffer and income protection to cover rent.',
        emergencyMonths: 6,
        lifeMultiplier: 3,
        disabilityIncomeRate: 0.55,
        familyFactor: 0,
      },
      {
        id: 'samboer',
        label: 'Samboer household',
        description:
          'Two incomes sharing rent and travel goals. Focus on joint buffer and life cover before buying property.',
        emergencyMonths: 7,
        lifeMultiplier: 5,
        disabilityIncomeRate: 0.6,
        familyFactor: 400000,
      },
      {
        id: 'barn-familie',
        label: 'Familie med barn',
        description:
          'Parents balancing barnehage, mortgage, and travel. Needs 9–12 month reserves and barneforsikring upgrades.',
        emergencyMonths: 10,
        lifeMultiplier: 8,
        disabilityIncomeRate: 0.65,
        familyFactor: 800000,
      },
      {
        id: 'frilanser',
        label: 'Frilanser',
        description:
          'Independent consultant with variable fakturaer. Builds 12 month runway and supplementary income insurance.',
        emergencyMonths: 12,
        lifeMultiplier: 6,
        disabilityIncomeRate: 0.5,
        familyFactor: 300000,
      },
    ],
    playbooks: [
      {
        title: 'NAV benefit audit',
        description:
          'Log NAV sick pay, employer top-ups, and private inntektssikring so you know how long wages would continue.',
      },
      {
        title: 'Buffer autopilot',
        description:
          'Automate transfers into høyrentekonto or BSU-style buckets each payday until the runway hits target.',
      },
      {
        title: 'Family paperwork sprint',
        description:
          'Review samboeravtale, testament, and insurance beneficiaries every spring so paperwork matches real life.',
      },
    ],
    readinessChecklist: [
      'Track emergency reserves across høyrentekonto, BSU, and brokerage so you can see true runway at a glance.',
      'Store NAV letters, insurance policies, and skattekort adjustments with expiry reminders.',
      'Confirm private disability coverage picks up where employer and NAV benefits taper off.',
      'Document who can access accounts, mortgages, and childcare payments if you are unavailable.',
    ],
    guardrails: [
      'Ring-fence tax and holiday accounts from the emergency buffer to keep liquidity predictable.',
      'Aim for 6–12 months of essential spend before locking savings into long-term funds.',
      'Review pensjonskonto and life insurance beneficiaries every January.',
      'Update skattekort when freelance revenue shifts so set-aside stays accurate.',
    ],
    signalBeacons: [
      'Runway covers at least 6 months of SIFO essentials across savings accounts.',
      'Supplemental income protection replaces 60%+ of take-home pay after NAV benefits.',
      'Insurance renewals logged with no overdue follow-ups.',
      'Crisis checklist rehearsed twice per year with partner or trusted contact.',
    ],
    supportChannels: [
      {
        label: 'NAV guidance session',
        description:
          'Explain NAV sick pay, arbeidsavklaringspenger, and parental benefits aligned to your work status.',
      },
      {
        label: 'Insurance broker (Norge)',
        description:
          'Compare income protection, uføreforsikring, and life cover tailored to consultants.',
      },
      {
        label: 'Juridisk partner',
        description:
          'Draft or refresh samboeravtale and testament templates with secure sharing.',
      },
    ],
    rolloutMilestones: [
      {
        label: 'Nordic safety net schema',
        timeframe: 'Week 1',
        description: 'Model NAV benefit fields, supplemental insurance, and savings buckets.',
      },
      {
        label: 'Bank + PSD2 feeds',
        timeframe: 'Week 2',
        description: 'Connect DNB, Sbanken, and Revolut to monitor runway balances automatically.',
      },
      {
        label: 'Guardrail automations',
        timeframe: 'Week 3',
        description: 'Send alerts when høyrentekonto dips or renewals near expiration.',
      },
      {
        label: 'Advisor/partner hub',
        timeframe: 'Week 4',
        description: 'Share bilingual summaries with brokers or advisors for quick reviews.',
      },
    ],
    coverageIntelligence: [
      'Flag NAV coverage end dates so you can top up with private insurance in time.',
      'Watch høyrentekonto balances and prompt top-ups if the runway drops below target.',
      'Highlight skattekort changes and suggest moving freelance profit into the buffer automatically.',
    ],
  },
}
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
  const monthlyIncomeReplacement = (persona.disabilityIncomeRate * annualIncome) / 12

  return {
    emergencyTarget,
    recommendedLife,
    monthlyIncomeReplacement,
  }
}

export default function Protection() {
  const {
    state: { profile, budget },
  } = useDemoData()

  const regionPreset = useMemo(() => regionConfigs[profile.region] ?? regionConfigs.uk, [profile.region])

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(profile.localeId, {
        style: 'currency',
        currency: profile.currency,
        maximumFractionDigits: 0,
      }),
    [profile.currency, profile.localeId],
  )

  const defaultMonthlyExpenses = useMemo(
    () => Math.round(budget.envelopes.reduce((sum, envelope) => sum + envelope.spent, 0)),
    [budget.envelopes],
  )

  const [personaId, setPersonaId] = useState(regionPreset.defaults.personaId)
  const [annualIncome, setAnnualIncome] = useState(
    clampToRange(regionPreset.defaults.annualIncome, regionPreset.controls.annualIncome),
  )
  const [monthlyExpenses, setMonthlyExpenses] = useState(
    clampToRange(
      regionPreset.defaults.monthlyExpenses ?? defaultMonthlyExpenses,
      regionPreset.controls.monthlyExpenses,
    ),
  )
  const [coverageMonths, setCoverageMonths] = useState(
    Math.min(coverageMonthsControl.max, Math.max(coverageMonthsControl.min, regionPreset.defaults.coverageMonths)),
  )
  const [emergencySavings, setEmergencySavings] = useState(
    clampToRange(regionPreset.defaults.emergencySavings, regionPreset.controls.emergencySavings),
  )
  const [lifeCoverage, setLifeCoverage] = useState(
    clampToRange(regionPreset.defaults.lifeCoverage, regionPreset.controls.lifeCoverage),
  )
  const [disabilityCoverage, setDisabilityCoverage] = useState(
    clampToRange(regionPreset.defaults.disabilityCoverage, regionPreset.controls.disabilityCoverage),
  )

  useEffect(() => {
    setPersonaId(regionPreset.defaults.personaId)
    setAnnualIncome(clampToRange(regionPreset.defaults.annualIncome, regionPreset.controls.annualIncome))
    setMonthlyExpenses(
      clampToRange(
        regionPreset.defaults.monthlyExpenses ?? defaultMonthlyExpenses,
        regionPreset.controls.monthlyExpenses,
      ),
    )
    setCoverageMonths(
      Math.min(coverageMonthsControl.max, Math.max(coverageMonthsControl.min, regionPreset.defaults.coverageMonths)),
    )
    setEmergencySavings(
      clampToRange(regionPreset.defaults.emergencySavings, regionPreset.controls.emergencySavings),
    )
    setLifeCoverage(clampToRange(regionPreset.defaults.lifeCoverage, regionPreset.controls.lifeCoverage))
    setDisabilityCoverage(
      clampToRange(regionPreset.defaults.disabilityCoverage, regionPreset.controls.disabilityCoverage),
    )
  }, [defaultMonthlyExpenses, regionPreset])

  const persona = useMemo(
    () => regionPreset.personas.find((item) => item.id === personaId) ?? regionPreset.personas[0],
    [personaId, regionPreset],
  )

  const recommendations = useMemo(
    () =>
      calculateRecommendations({
        persona,
        annualIncome,
        monthlyExpenses,
        coverageMonths,
      }),
    [persona, annualIncome, monthlyExpenses, coverageMonths],
  )

  const emergencyGap = Math.max(0, recommendations.emergencyTarget - emergencySavings)
  const lifeGap = Math.max(0, recommendations.recommendedLife - lifeCoverage)
  const disabilityGap = Math.max(0, recommendations.monthlyIncomeReplacement - disabilityCoverage)

  const emergencyProgress = recommendations.emergencyTarget === 0
    ? 0
    : Math.round((emergencySavings / recommendations.emergencyTarget) * 100)
  const lifeProgress = recommendations.recommendedLife === 0 ? 0 : Math.round((lifeCoverage / recommendations.recommendedLife) * 100)
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

  const lifeDescription = persona.familyFactor
    ? `${persona.lifeMultiplier}× income + ${currencyFormatter.format(persona.familyFactor)} family buffer`
    : `${persona.lifeMultiplier}× income baseline`

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
      description: lifeDescription,
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
      description: `Aim for ${Math.round(persona.disabilityIncomeRate * 100)}% of take-home pay`,
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
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-dark/80">
              {regionPreset.hero.badge}
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              {regionPreset.hero.title}
            </h1>
            <p className="max-w-3xl text-sm text-slate-800">{regionPreset.hero.description}</p>
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
                  {regionPreset.personas.map((item) => {
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
                    min={regionPreset.controls.annualIncome.min}
                    max={regionPreset.controls.annualIncome.max}
                    step={regionPreset.controls.annualIncome.step}
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
                    min={regionPreset.controls.monthlyExpenses.min}
                    max={regionPreset.controls.monthlyExpenses.max}
                    step={regionPreset.controls.monthlyExpenses.step}
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
                    min={coverageMonthsControl.min}
                    max={coverageMonthsControl.max}
                    step={coverageMonthsControl.step}
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
                    min={regionPreset.controls.emergencySavings.min}
                    max={regionPreset.controls.emergencySavings.max}
                    step={regionPreset.controls.emergencySavings.step}
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
                    min={regionPreset.controls.lifeCoverage.min}
                    max={regionPreset.controls.lifeCoverage.max}
                    step={regionPreset.controls.lifeCoverage.step}
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
                    min={regionPreset.controls.disabilityCoverage.min}
                    max={regionPreset.controls.disabilityCoverage.max}
                    step={regionPreset.controls.disabilityCoverage.step}
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
          <p>{regionPreset.coverageIntro}</p>
          <ul className="space-y-3">
            {regionPreset.coverageIntelligence.map((item, index) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary-dark">
                  {index + 1}
                </span>
                <p>{item}</p>
              </li>
            ))}
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
            {regionPreset.playbooks.map((play) => (
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
            {regionPreset.readinessChecklist.map((item) => (
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
            {regionPreset.rolloutMilestones.map((milestone) => (
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
                {regionPreset.guardrails.map((item) => (
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
                {regionPreset.signalBeacons.map((item) => (
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
          {regionPreset.supportChannels.map((channel) => (
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
