import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type OnboardingMode = 'demo' | 'build' | null

type GoalFocus =
  | 'control-spending'
  | 'pay-off-debt'
  | 'emergency-fund'
  | 'track-investments'
  | 'big-purchase'
  | 'prepare-taxes'

type ModuleKey =
  | 'budget'
  | 'debts'
  | 'savings'
  | 'investments'
  | 'income'
  | 'realEstate'
  | 'insurance'
  | 'taxes'
  | 'retirement'
  | 'aiAdvisor'

const moduleCatalog: Array<{
  key: ModuleKey
  label: string
  description: string
  recommendedFor?: GoalFocus[]
  premium?: boolean
}> = [
  {
    key: 'budget',
    label: 'Budget',
    description: 'Plan spending with real-time envelope tracking.',
    recommendedFor: ['control-spending', 'emergency-fund', 'big-purchase'],
  },
  {
    key: 'debts',
    label: 'Debts',
    description: 'Model snowball vs avalanche, track payoff forecasts.',
    recommendedFor: ['pay-off-debt'],
  },
  {
    key: 'savings',
    label: 'Savings',
    description: 'Create goals, automate transfers, celebrate milestones.',
    recommendedFor: ['emergency-fund', 'big-purchase'],
  },
  {
    key: 'investments',
    label: 'Investments',
    description: 'Monitor holdings and projected growth.',
    recommendedFor: ['track-investments', 'retirement'],
  },
  {
    key: 'income',
    label: 'Income / Side Hustles',
    description: 'Track paydays, gigs, and momentum boosts.',
    recommendedFor: ['control-spending', 'big-purchase'],
  },
  {
    key: 'realEstate',
    label: 'Real Estate',
    description: 'Track property values, mortgages, and rental yields.',
  },
  {
    key: 'insurance',
    label: 'Insurance',
    description: 'Spot coverage gaps and renewal reminders.',
  },
  {
    key: 'taxes',
    label: 'Taxes',
    description: 'Prepare filings, deductions, and estimated payments.',
    recommendedFor: ['prepare-taxes'],
  },
  {
    key: 'retirement',
    label: 'Retire',
    description: 'Project glide paths and safe-withdrawal coverage.',
  },
  {
    key: 'aiAdvisor',
    label: 'AI Advisor',
    description: 'Pro insights, smart nudges, and conversational planning.',
    premium: true,
  },
]

type ModuleToggle = {
  enabled: boolean
  pendingUpgrade: boolean
  recommended: boolean
}

type GoalSelection = {
  key: GoalFocus
  label: string
  description: string
}

type Account = {
  id: string
  name: string
  type: 'checking' | 'savings' | 'investment'
  balance: number
  currency: string
}

type Debt = {
  id: string
  name: string
  balance: number
  apr: number
  minPayment: number
}

type SavingsGoal = {
  id: string
  name: string
  target: number
  monthlyContribution: number
  etaMonths: number
}

type Holding = {
  symbol: string
  quantity: number
  price: number
}

type Investment = {
  id: string
  name: string
  balance: number
  holdings: Holding[]
}

type BudgetCategory = {
  id: string
  name: string
  planned: number
}

type DashboardWidget = {
  id: string
  label: string
  visible: boolean
}

type OnboardingState = {
  mode: OnboardingMode
  isDemo: boolean
  profile: {
    firstName: string
    country: string
    currency: string
    timezone: string
    dateFormat: string
    theme: 'light' | 'dark'
    accentColor: string
    onboardedAt?: string
  }
  goals: GoalFocus[]
  modules: Record<ModuleKey, ModuleToggle>
  accounts: Account[]
  income: {
    monthlyNet: number
    payday: string
    sideIncome: number
  }
  budget: {
    monthlyTakeHome: number
    template: '50-30-20' | 'essentials-first' | 'custom'
    categories: BudgetCategory[]
  }
  debts: Debt[]
  savingsGoals: SavingsGoal[]
  investments: Investment[]
  notifications: {
    monthlyReport: 'smart' | 'weekly' | 'off'
    overspendAlerts: boolean
    billReminders: boolean
    goalNudges: boolean
  }
  dashboard: {
    theme: 'light' | 'dark'
    accentColor: string
    widgets: DashboardWidget[]
  }
}

const STORAGE_KEY = 'walletHabit.onboardingState.v1'

const defaultWidgets: DashboardWidget[] = [
  { id: 'net-worth', label: 'Net worth line', visible: true },
  { id: 'cashflow', label: 'Cash-flow bar', visible: true },
  { id: 'budget', label: 'Budget bars', visible: true },
  { id: 'goals', label: 'Goals rings', visible: true },
  { id: 'debts', label: 'Debt payoff meter', visible: true },
  { id: 'insights', label: 'Insights feed', visible: true },
]

const goalOptions: GoalSelection[] = [
  {
    key: 'control-spending',
    label: 'Control spending',
    description: 'Keep spending aligned with what matters most.',
  },
  {
    key: 'pay-off-debt',
    label: 'Pay off debt',
    description: 'Accelerate payoff timelines and slash interest.',
  },
  {
    key: 'emergency-fund',
    label: 'Build emergency fund',
    description: 'Create a runway for curveballs and peace of mind.',
  },
  {
    key: 'track-investments',
    label: 'Track investments',
    description: 'Monitor growth and allocation drift effortlessly.',
  },
  {
    key: 'big-purchase',
    label: 'Plan a big purchase',
    description: 'Save toward a wedding, move, or dream trip.',
  },
  {
    key: 'prepare-taxes',
    label: 'Prepare taxes',
    description: 'Organise deductions and estimated payments.',
  },
]

const createDefaultModules = (): Record<ModuleKey, ModuleToggle> =>
  moduleCatalog.reduce((acc, module) => {
    acc[module.key] = {
      enabled: module.key === 'budget',
      pendingUpgrade: false,
      recommended: module.key === 'budget',
    }
    return acc
  }, {} as Record<ModuleKey, ModuleToggle>)

const createDefaultState = (): OnboardingState => ({
  mode: null,
  isDemo: false,
  profile: {
    firstName: '',
    country: 'United Kingdom',
    currency: 'GBP',
    timezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    accentColor: '#0f766e',
  },
  goals: [],
  modules: createDefaultModules(),
  accounts: [],
  income: {
    monthlyNet: 0,
    payday: '25th',
    sideIncome: 0,
  },
  budget: {
    monthlyTakeHome: 0,
    template: '50-30-20',
    categories: [],
  },
  debts: [],
  savingsGoals: [],
  investments: [],
  notifications: {
    monthlyReport: 'smart',
    overspendAlerts: true,
    billReminders: true,
    goalNudges: true,
  },
  dashboard: {
    theme: 'light',
    accentColor: '#0f766e',
    widgets: defaultWidgets.map((widget) => ({ ...widget })),
  },
})

const createDemoState = (): OnboardingState => {
  const base = createDefaultState()
  const modules = createDefaultModules()

  const enableModule = (key: ModuleKey, pendingUpgrade = false) => {
    modules[key] = {
      ...modules[key],
      enabled: true,
      pendingUpgrade,
      recommended: true,
    }
  }

  enableModule('budget')
  enableModule('debts')
  enableModule('savings')
  enableModule('investments')
  enableModule('income')
  enableModule('taxes')
  enableModule('retirement')
  enableModule('aiAdvisor', true)

  const monthlyNet = 5200
  const demoCategories = budgetTemplates['50-30-20'].map((category) => {
    if (category.id === 'needs') {
      return { ...category, planned: Math.round(monthlyNet * 0.5) }
    }
    if (category.id === 'wants') {
      return { ...category, planned: Math.round(monthlyNet * 0.3) }
    }
    return { ...category, planned: Math.round(monthlyNet * 0.2) }
  })

  return {
    ...base,
    mode: 'demo',
    isDemo: true,
    profile: {
      ...base.profile,
      firstName: 'Taylor',
      country: 'United States',
      currency: 'USD',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      theme: 'light',
      accentColor: '#14b8a6',
      onboardedAt: new Date().toISOString(),
    },
    goals: ['control-spending', 'emergency-fund', 'pay-off-debt'],
    modules,
    accounts: [
      {
        id: 'checking',
        name: 'Everyday Checking',
        type: 'checking',
        balance: 3250,
        currency: 'USD',
      },
      {
        id: 'savings',
        name: 'Safety Net Savings',
        type: 'savings',
        balance: 8500,
        currency: 'USD',
      },
      {
        id: 'invest',
        name: 'Future Focus Brokerage',
        type: 'investment',
        balance: 12000,
        currency: 'USD',
      },
    ],
    income: {
      monthlyNet,
      payday: '1st',
      sideIncome: 650,
    },
    budget: {
      monthlyTakeHome: monthlyNet,
      template: '50-30-20',
      categories: demoCategories,
    },
    debts: [
      {
        id: 'amex',
        name: 'Amex Gold',
        balance: 4200,
        apr: 19.9,
        minPayment: 160,
      },
      {
        id: 'student-loan',
        name: 'Student Loan',
        balance: 18500,
        apr: 4.5,
        minPayment: 210,
      },
    ],
    savingsGoals: [
      {
        id: 'emergency',
        name: 'Emergency fund',
        target: 15600,
        monthlyContribution: 520,
        etaMonths: 12,
      },
      {
        id: 'holiday',
        name: 'Holiday escape',
        target: 3000,
        monthlyContribution: 250,
        etaMonths: 12,
      },
    ],
    investments: [
      {
        id: 'brokerage',
        name: 'Future Focus Brokerage',
        balance: 12000,
        holdings: [
          { symbol: 'VOO', quantity: 20, price: 420 },
          { symbol: 'BTC', quantity: 0.25, price: 60000 },
        ],
      },
    ],
    notifications: {
      monthlyReport: 'smart',
      overspendAlerts: true,
      billReminders: true,
      goalNudges: true,
    },
    dashboard: {
      theme: 'light',
      accentColor: '#14b8a6',
      widgets: defaultWidgets.map((widget) => ({ ...widget, visible: true })),
    },
  }
}

const budgetTemplates: Record<OnboardingState['budget']['template'], BudgetCategory[]> = {
  '50-30-20': [
    { id: 'needs', name: 'Needs (50%)', planned: 0 },
    { id: 'wants', name: 'Wants (30%)', planned: 0 },
    { id: 'future', name: 'Future you (20%)', planned: 0 },
  ],
  'essentials-first': [
    { id: 'housing', name: 'Housing', planned: 0 },
    { id: 'groceries', name: 'Groceries', planned: 0 },
    { id: 'transport', name: 'Transport', planned: 0 },
    { id: 'utilities', name: 'Utilities', planned: 0 },
    { id: 'lifestyle', name: 'Lifestyle & fun', planned: 0 },
  ],
  custom: [
    { id: 'groceries', name: 'Groceries', planned: 0 },
    { id: 'dining', name: 'Dining out', planned: 0 },
    { id: 'transport', name: 'Transport', planned: 0 },
    { id: 'rent', name: 'Rent / mortgage', planned: 0 },
    { id: 'utilities', name: 'Utilities', planned: 0 },
    { id: 'subscriptions', name: 'Subscriptions', planned: 0 },
    { id: 'health', name: 'Health & wellness', planned: 0 },
    { id: 'fun', name: 'Fun & experiences', planned: 0 },
  ],
}

type StepId =
  | 'welcome'
  | 'basics'
  | 'focus'
  | 'modules'
  | 'accounts'
  | 'budget'
  | 'debts'
  | 'savings'
  | 'investments'
  | 'notifications'
  | 'layout'
  | 'review'
  | 'tour'

type Step = {
  id: StepId
  title: string
  description: string
  optional?: boolean
  guard?: (state: OnboardingState) => boolean
}

const stepDefinitions: Step[] = [
  {
    id: 'welcome',
    title: 'Welcome & mode',
    description: 'Choose how you want to explore WalletHabit.',
  },
  {
    id: 'basics',
    title: 'Basics',
    description: 'Personalise your profile so everything feels familiar.',
  },
  {
    id: 'focus',
    title: 'Your focus',
    description: 'Tell us what matters so we can surface the right tools.',
  },
  {
    id: 'modules',
    title: 'Pick your modules',
    description: 'Enable the labs that will power your plan.',
  },
  {
    id: 'accounts',
    title: 'Income & accounts',
    description: 'Seed the accounts and income that anchor your money map.',
  },
  {
    id: 'budget',
    title: 'Budget quick-start',
    description: 'Create a budget snapshot you can refine later.',
  },
  {
    id: 'debts',
    title: 'Debts',
    description: 'Add balances to unlock payoff projections.',
    optional: true,
    guard: (state) => state.modules.debts?.enabled ?? false,
  },
  {
    id: 'savings',
    title: 'Savings goals',
    description: 'Lock in goals that keep motivation high.',
    optional: true,
    guard: (state) => state.modules.savings?.enabled ?? false,
  },
  {
    id: 'investments',
    title: 'Investments',
    description: 'Capture the accounts powering long-term growth.',
    optional: true,
    guard: (state) => state.modules.investments?.enabled ?? false,
  },
  {
    id: 'notifications',
    title: 'Reminders & insights',
    description: 'Stay on track with the right nudges.',
  },
  {
    id: 'layout',
    title: 'Layout & theme',
    description: 'Design a dashboard that feels like home.',
  },
  {
    id: 'review',
    title: 'Review & commit',
    description: 'Double-check everything before you launch.',
  },
  {
    id: 'tour',
    title: 'First-run tour',
    description: 'Get a 90-second orientation of the dashboard.',
  },
]

const loadInitialState = (): { state: OnboardingState; stepIndex: number } => {
  if (typeof window === 'undefined') {
    return { state: createDefaultState(), stepIndex: 0 }
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { state: createDefaultState(), stepIndex: 0 }
    }

    const parsed = JSON.parse(stored) as { state?: OnboardingState; stepIndex?: number }
    const defaults = createDefaultState()
    const storedState = parsed.state ?? defaults

    const mergedModules = createDefaultModules()
    Object.entries(storedState.modules ?? {}).forEach(([key, value]) => {
      if (key in mergedModules) {
        const moduleKey = key as ModuleKey
        mergedModules[moduleKey] = {
          ...mergedModules[moduleKey],
          ...value,
        }
      }
    })

    return {
      state: {
        ...defaults,
        ...storedState,
        modules: mergedModules,
        accounts: (storedState.accounts ?? []).map((account) => ({ ...account })),
        debts: (storedState.debts ?? []).map((debt) => ({ ...debt })),
        savingsGoals: (storedState.savingsGoals ?? []).map((goal) => ({ ...goal })),
        investments: (storedState.investments ?? []).map((investment) => ({
          ...investment,
          holdings: (investment.holdings ?? []).map((holding) => ({ ...holding })),
        })),
        budget: {
          ...defaults.budget,
          ...storedState.budget,
          categories: (storedState.budget?.categories ?? []).map((category) => ({ ...category })),
        },
        dashboard: {
          ...defaults.dashboard,
          ...storedState.dashboard,
          widgets: (storedState.dashboard?.widgets ?? defaults.dashboard.widgets).map((widget) => ({ ...widget })),
        },
      },
      stepIndex: parsed.stepIndex ?? 0,
    }
  } catch (error) {
    console.warn('Failed to load onboarding state', error)
    return { state: createDefaultState(), stepIndex: 0 }
  }
}

const formatCurrency = (value: number, currency: string) => {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Onboarding() {
  const [{ state, stepIndex }, setStateWithStep] = useState(loadInitialState)
  const [isFinishing, setIsFinishing] = useState(false)

  const steps = useMemo(
    () =>
      stepDefinitions.filter((step) =>
        step.guard ? step.guard(state) : true
      ),
    [state]
  )

  useEffect(() => {
    if (stepIndex > steps.length - 1) {
      setStateWithStep((prev) => ({ ...prev, stepIndex: Math.max(steps.length - 1, 0) }))
    }
  }, [stepIndex, steps.length])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, stepIndex }))
  }, [state, stepIndex])

  const currentStep = steps[stepIndex] ?? steps[0]

  const updateState = (updater: (current: OnboardingState) => OnboardingState) => {
    setStateWithStep((prev) => ({ ...prev, state: updater(prev.state) }))
  }

  const goToStep = (index: number) => {
    setStateWithStep((prev) => ({ ...prev, stepIndex: index }))
  }

  const startDemo = () => {
    const demoState = createDemoState()
    const filteredSteps = stepDefinitions.filter((step) => (step.guard ? step.guard(demoState) : true))
    const reviewIndex = filteredSteps.findIndex((step) => step.id === 'review')

    setStateWithStep({
      state: demoState,
      stepIndex: reviewIndex === -1 ? filteredSteps.length - 1 : reviewIndex,
    })
  }

  const startGuided = () => {
    setStateWithStep((prev) => {
      if (prev.state.isDemo) {
        const resetState = createDefaultState()
        resetState.mode = 'build'
        return { state: resetState, stepIndex: 0 }
      }

      return {
        ...prev,
        state: {
          ...prev.state,
          mode: 'build',
          isDemo: false,
        },
      }
    })
  }

  const handleNext = () => {
    if (!currentStep) return

    if (currentStep.id === 'welcome') {
      if (state.mode === 'demo') {
        updateState((prev) => ({
          ...prev,
          isDemo: true,
          profile: {
            ...prev.profile,
            onboardedAt: new Date().toISOString(),
          },
        }))
        const reviewIndex = steps.findIndex((step) => step.id === 'review')
        goToStep(reviewIndex === -1 ? stepIndex + 1 : reviewIndex)
        return
      }
    }

    if (currentStep.id === 'review') {
      setIsFinishing(true)
      updateState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          onboardedAt: new Date().toISOString(),
        },
      }))
      const tourIndex = steps.findIndex((step) => step.id === 'tour')
      goToStep(tourIndex === -1 ? stepIndex : tourIndex)
      setTimeout(() => setIsFinishing(false), 600)
      return
    }

    goToStep(Math.min(stepIndex + 1, steps.length - 1))
  }

  const handleBack = () => {
    goToStep(Math.max(stepIndex - 1, 0))
  }

  const resetOnboarding = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setStateWithStep({ state: createDefaultState(), stepIndex: 0 })
  }

  const handleGoalToggle = (goal: GoalFocus) => {
    updateState((prev) => {
      const nextGoals = prev.goals.includes(goal)
        ? prev.goals.filter((item) => item !== goal)
        : [...prev.goals, goal]

      const recommendedModules = new Set<ModuleKey>()
      nextGoals.forEach((goalKey) => {
        moduleCatalog.forEach((module) => {
          if (module.recommendedFor?.includes(goalKey)) {
            recommendedModules.add(module.key)
          }
        })
      })

      const nextModules = { ...prev.modules }
      recommendedModules.forEach((moduleKey) => {
        nextModules[moduleKey] = {
          ...nextModules[moduleKey],
          enabled: true,
          recommended: true,
        }
      })

      return {
        ...prev,
        goals: nextGoals,
        modules: nextModules,
      }
    })
  }

  const handleModuleToggle = (moduleKey: ModuleKey) => {
    updateState((prev) => {
      const module = moduleCatalog.find((item) => item.key === moduleKey)
      const current = prev.modules[moduleKey]
      const nextEnabled = !current.enabled
      const pendingUpgrade = module?.premium ? nextEnabled : false

      return {
        ...prev,
        modules: {
          ...prev.modules,
          [moduleKey]: {
            enabled: nextEnabled,
            pendingUpgrade,
            recommended: current.recommended,
          },
        },
      }
    })
  }

  const handleBudgetTemplateChange = (template: OnboardingState['budget']['template']) => {
    updateState((prev) => ({
      ...prev,
      budget: {
        ...prev.budget,
        template,
        categories: budgetTemplates[template].map((category) => ({ ...category })),
      },
    }))
  }

  const handleWidgetVisibilityToggle = (id: string) => {
    updateState((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        widgets: prev.dashboard.widgets.map((widget) =>
          widget.id === id ? { ...widget, visible: !widget.visible } : widget
        ),
      },
    }))
  }

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    updateState((prev) => {
      const widgets = [...prev.dashboard.widgets]
      const index = widgets.findIndex((widget) => widget.id === id)
      if (index === -1) return prev

      const nextIndex = direction === 'up' ? index - 1 : index + 1
      if (nextIndex < 0 || nextIndex >= widgets.length) {
        return prev
      }

      const [removed] = widgets.splice(index, 1)
      widgets.splice(nextIndex, 0, removed)

      return {
        ...prev,
        dashboard: {
          ...prev.dashboard,
          widgets,
        },
      }
    })
  }

  const renderStepContent = () => {
    if (!currentStep) return null

    switch (currentStep.id) {
      case 'welcome': {
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <article
              className={`flex flex-col gap-4 rounded-3xl border p-6 transition ${
                state.mode === 'demo'
                  ? 'border-brand bg-brand/5 shadow-md'
                  : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div>
                <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                  Fast tour
                </span>
                <h2 className="mt-4 text-2xl font-semibold">Explore with demo data</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Jump straight into a fully-populated dashboard. Tweak modules later when you are ready to bring in real data.
                </p>
              </div>
              <button
                type="button"
                onClick={startDemo}
                className="mt-auto inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                Load demo workspace
              </button>
              <p className="text-xs text-slate-500">
                We’ll prefill realistic accounts, a budget, goals, and insights so you can explore instantly.
              </p>
            </article>
            <article
              className={`flex flex-col gap-4 rounded-3xl border p-6 transition ${
                state.mode === 'build'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Guided setup
                </span>
                <h2 className="mt-4 text-2xl font-semibold">Build my plan</h2>
                <p className="mt-2 text-sm text-slate-600">
                  A step-by-step flow (about 4 minutes) to personalise currency, modules, accounts, and a starter budget.
                </p>
              </div>
              <button
                type="button"
                onClick={startGuided}
                className="mt-auto inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
              >
                Start guided setup
              </button>
              <p className="text-xs text-slate-500">
                Progress auto-saves, so you can pause anytime. Switching from demo resets everything to a fresh slate.
              </p>
            </article>
          </div>
        )
      }
      case 'basics': {
        return (
          <form className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">First name</span>
              <input
                type="text"
                value={state.profile.firstName}
                onChange={(event) =>
                  updateState((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, firstName: event.target.value },
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Alex"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Country / region</span>
              <select
                value={state.profile.country}
                onChange={(event) => {
                  const country = event.target.value
                  const defaults: Record<string, { currency: string; timezone: string; dateFormat: string }> = {
                    'United Kingdom': {
                      currency: 'GBP',
                      timezone: 'Europe/London',
                      dateFormat: 'DD/MM/YYYY',
                    },
                    'United States': {
                      currency: 'USD',
                      timezone: 'America/New_York',
                      dateFormat: 'MM/DD/YYYY',
                    },
                    Norway: {
                      currency: 'NOK',
                      timezone: 'Europe/Oslo',
                      dateFormat: 'DD.MM.YYYY',
                    },
                  }
                  const preset = defaults[country]
                  updateState((prev) => ({
                    ...prev,
                    profile: {
                      ...prev.profile,
                      country,
                      currency: preset?.currency ?? prev.profile.currency,
                      timezone: preset?.timezone ?? prev.profile.timezone,
                      dateFormat: preset?.dateFormat ?? prev.profile.dateFormat,
                    },
                  }))
                }}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Norway</option>
                <option>Other</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Currency</span>
              <input
                type="text"
                value={state.profile.currency}
                onChange={(event) =>
                  updateState((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, currency: event.target.value.toUpperCase() },
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm uppercase shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="GBP"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Timezone</span>
              <input
                type="text"
                value={state.profile.timezone}
                onChange={(event) =>
                  updateState((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, timezone: event.target.value },
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Europe/London"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Date format</span>
              <select
                value={state.profile.dateFormat}
                onChange={(event) =>
                  updateState((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, dateFormat: event.target.value },
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD.MM.YYYY">DD.MM.YYYY</option>
              </select>
            </label>
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-700">Theme</p>
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() =>
                      updateState((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, theme: 'light' },
                        dashboard: { ...prev.dashboard, theme: 'light' },
                      }))
                    }
                    className={`rounded-full px-4 py-2 transition ${
                      state.profile.theme === 'light'
                        ? 'bg-white text-slate-900 shadow'
                        : 'text-slate-500'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateState((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, theme: 'dark' },
                        dashboard: { ...prev.dashboard, theme: 'dark' },
                      }))
                    }
                    className={`rounded-full px-4 py-2 transition ${
                      state.profile.theme === 'dark'
                        ? 'bg-midnight text-white shadow'
                        : 'text-slate-500'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Accent colour</span>
                <input
                  type="color"
                  value={state.profile.accentColor}
                  onChange={(event) =>
                    updateState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, accentColor: event.target.value },
                      dashboard: { ...prev.dashboard, accentColor: event.target.value },
                    }))
                  }
                  className="h-12 w-24 cursor-pointer rounded-xl border border-slate-200"
                />
              </label>
            </div>
          </form>
        )
      }
      case 'focus': {
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {goalOptions.map((goal) => {
              const isSelected = state.goals.includes(goal.key)
              return (
                <button
                  type="button"
                  key={goal.key}
                  onClick={() => handleGoalToggle(goal.key)}
                  className={`flex h-full flex-col gap-2 rounded-3xl border p-6 text-left transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  <span className="text-sm font-semibold uppercase tracking-wide text-primary">{goal.label}</span>
                  <p className="text-sm text-slate-600">{goal.description}</p>
                  {isSelected ? (
                    <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <span aria-hidden>✓</span> Selected
                    </span>
                  ) : (
                    <span className="mt-auto text-xs font-medium text-slate-500">Tap to focus</span>
                  )}
                </button>
              )
            })}
          </div>
        )
      }
      case 'modules': {
        return (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {moduleCatalog.map((module) => {
              const moduleState = state.modules[module.key]
              const isRecommended = moduleState?.recommended
              return (
                <article
                  key={module.key}
                  className={`flex flex-col gap-4 rounded-3xl border p-6 shadow-sm transition ${
                    moduleState?.enabled ? 'border-primary bg-white shadow-md' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{module.label}</h3>
                      <p className="mt-1 text-sm text-slate-600">{module.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs font-semibold">
                      {isRecommended && (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">Recommended</span>
                      )}
                      {module.premium && (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-600">Premium</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {moduleState?.enabled ? 'Enabled' : 'Hidden for now'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleModuleToggle(module.key)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full border transition ${
                        moduleState?.enabled
                          ? 'border-primary bg-primary/20'
                          : 'border-slate-200 bg-slate-100'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 rounded-full bg-white shadow transition ${
                          moduleState?.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                      <span className="sr-only">Toggle {module.label}</span>
                    </button>
                  </div>
                  {moduleState?.pendingUpgrade && (
                    <p className="text-xs text-amber-600">
                      Trial starts today. Upgrade after 7 days if you love it — we will remind you gently.
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        )
      }
      case 'accounts': {
        return (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Monthly income</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Net salary (monthly)</span>
                    <input
                      type="number"
                      min={0}
                      value={state.income.monthlyNet || ''}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          income: {
                            ...prev.income,
                            monthlyNet: Number(event.target.value) || 0,
                          },
                        }))
                      }
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="3200"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Side income (optional)</span>
                    <input
                      type="number"
                      min={0}
                      value={state.income.sideIncome || ''}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          income: {
                            ...prev.income,
                            sideIncome: Number(event.target.value) || 0,
                          },
                        }))
                      }
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="450"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Typical payday</span>
                    <input
                      type="text"
                      value={state.income.payday}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          income: { ...prev.income, payday: event.target.value },
                        }))
                      }
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="25th"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Accounts</h3>
                    <p className="text-sm text-slate-600">Seed at least a current and savings account.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateState((prev) => ({
                        ...prev,
                        accounts: [
                          ...prev.accounts,
                          {
                            id: `account-${prev.accounts.length + 1}`,
                            name: prev.accounts.length === 0 ? 'Current account' : 'Savings account',
                            type: prev.accounts.length === 0 ? 'checking' : 'savings',
                            balance: 0,
                            currency: prev.profile.currency,
                          },
                        ],
                      }))
                    }
                    className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                  >
                    + Add account
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  {state.accounts.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No accounts yet. Add one to keep the dashboard charts honest.
                    </p>
                  )}
                  {state.accounts.map((account, index) => (
                    <div key={account.id} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-4">
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-xs font-semibold uppercase text-slate-500">Account name</span>
                        <input
                          type="text"
                          value={account.name}
                          onChange={(event) =>
                            updateState((prev) => ({
                              ...prev,
                              accounts: prev.accounts.map((item, idx) =>
                                idx === index ? { ...item, name: event.target.value } : item
                              ),
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase text-slate-500">Type</span>
                        <select
                          value={account.type}
                          onChange={(event) =>
                            updateState((prev) => ({
                              ...prev,
                              accounts: prev.accounts.map((item, idx) =>
                                idx === index
                                  ? { ...item, type: event.target.value as Account['type'] }
                                  : item
                              ),
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="checking">Current / checking</option>
                          <option value="savings">Savings</option>
                          <option value="investment">Investment</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase text-slate-500">Balance</span>
                        <input
                          type="number"
                          value={account.balance || ''}
                          onChange={(event) =>
                            updateState((prev) => ({
                              ...prev,
                              accounts: prev.accounts.map((item, idx) =>
                                idx === index
                                  ? { ...item, balance: Number(event.target.value) || 0 }
                                  : item
                              ),
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Import options</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <strong className="text-slate-800">Manual (fast):</strong> Add balances now. You can connect banks later for live sync.
                </li>
                <li>
                  <strong className="text-slate-800">CSV import:</strong> Drop in statements when you are ready to backfill history.
                </li>
                <li>
                  <strong className="text-slate-800">Bank connect:</strong> Premium Plaid sync with a 7-day trial when toggled on.
                </li>
              </ul>
            </aside>
          </div>
        )
      }
      case 'budget': {
        const totalIncome = state.income.monthlyNet + state.income.sideIncome
        const categories = state.budget.categories.length
          ? state.budget.categories
          : budgetTemplates[state.budget.template]
        const autoFilledCategories = categories.map((category) => {
          if (category.planned > 0 || totalIncome === 0) return category
          if (state.budget.template === '50-30-20') {
            const weights: Record<string, number> = {
              needs: 0.5,
              wants: 0.3,
              future: 0.2,
            }
            return {
              ...category,
              planned: Math.round(totalIncome * (weights[category.id] ?? 0)),
            }
          }
          if (state.budget.template === 'essentials-first') {
            const defaults = {
              housing: totalIncome * 0.35,
              groceries: totalIncome * 0.12,
              transport: totalIncome * 0.08,
              utilities: totalIncome * 0.08,
              lifestyle: totalIncome * 0.15,
            }
            return {
              ...category,
              planned: Math.round(defaults[category.id as keyof typeof defaults] ?? totalIncome * 0.05),
            }
          }
          return category
        })

        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Monthly take-home</h3>
                <p className="text-sm text-slate-600">
                  Prefilled from income. Adjust if you want to budget a different amount.
                </p>
              </div>
              <input
                type="number"
                value={state.budget.monthlyTakeHome || totalIncome || ''}
                min={0}
                onChange={(event) =>
                  updateState((prev) => ({
                    ...prev,
                    budget: {
                      ...prev.budget,
                      monthlyTakeHome: Number(event.target.value) || 0,
                    },
                  }))
                }
                className="w-40 rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  { value: '50-30-20', label: '50 / 30 / 20' },
                  { value: 'essentials-first', label: 'Essentials-first' },
                  { value: 'custom', label: 'Custom' },
                ] as const
              ).map((template) => (
                <button
                  key={template.value}
                  type="button"
                  onClick={() => handleBudgetTemplateChange(template.value)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    state.budget.template === template.value
                      ? 'bg-primary text-white shadow'
                      : 'border border-slate-200 bg-white text-slate-600 shadow-sm'
                  }`}
                >
                  {template.label}
                </button>
              ))}
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Planned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {autoFilledCategories.map((category, index) => (
                    <tr key={category.id}>
                      <td className="px-4 py-3 font-medium text-slate-700">{category.name}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={category.planned || ''}
                          onChange={(event) =>
                            updateState((prev) => ({
                              ...prev,
                              budget: {
                                ...prev.budget,
                                categories: autoFilledCategories.map((item, idx) =>
                                  idx === index
                                    ? { ...item, planned: Number(event.target.value) || 0 }
                                    : item
                                ),
                              },
                            }))
                          }
                          className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500">
              Preview bars update live once your accounts stream in transactions.
            </p>
          </div>
        )
      }
      case 'debts': {
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Add at least one debt to unlock payoff projections. You can always add more later from the Debt lab.
            </p>
            <button
              type="button"
              onClick={() =>
                updateState((prev) => ({
                  ...prev,
                  debts: [
                    ...prev.debts,
                    {
                      id: `debt-${prev.debts.length + 1}`,
                      name: prev.debts.length === 0 ? 'Amex credit card' : 'Student loan',
                      balance: prev.debts.length === 0 ? 3400 : 12400,
                      apr: prev.debts.length === 0 ? 19.9 : 4.5,
                      minPayment: prev.debts.length === 0 ? 95 : 210,
                    },
                  ],
                }))
              }
              className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
            >
              + Add debt
            </button>
            <div className="space-y-4">
              {state.debts.length === 0 && (
                <p className="text-sm text-slate-500">No debts yet. Add one or skip for now.</p>
              )}
              {state.debts.map((debt, index) => (
                <div key={debt.id} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">Name</span>
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          debts: prev.debts.map((item, idx) =>
                            idx === index ? { ...item, name: event.target.value } : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">Balance</span>
                    <input
                      type="number"
                      value={debt.balance || ''}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          debts: prev.debts.map((item, idx) =>
                            idx === index
                              ? { ...item, balance: Number(event.target.value) || 0 }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">APR (%)</span>
                    <input
                      type="number"
                      value={debt.apr || ''}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          debts: prev.debts.map((item, idx) =>
                            idx === index ? { ...item, apr: Number(event.target.value) || 0 } : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">Min payment</span>
                    <input
                      type="number"
                      value={debt.minPayment || ''}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          debts: prev.debts.map((item, idx) =>
                            idx === index
                              ? { ...item, minPayment: Number(event.target.value) || 0 }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      }
      case 'savings': {
        const totalExpenses = state.budget.categories.reduce((total, category) => total + (category.planned || 0), 0)
        const emergencyTarget = Math.round((totalExpenses || state.income.monthlyNet) * 3)
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Emergency fund</h3>
                <p className="text-sm text-slate-600">
                  We recommend {formatCurrency(emergencyTarget, state.profile.currency)} for a 3-month runway.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateState((prev) => ({
                    ...prev,
                    savingsGoals: [
                      ...prev.savingsGoals,
                      {
                        id: `goal-${prev.savingsGoals.length + 1}`,
                        name: 'Emergency fund',
                        target: emergencyTarget,
                        monthlyContribution: Math.round((totalExpenses || state.income.monthlyNet) * 0.2),
                        etaMonths: Math.max(1, Math.round(emergencyTarget / Math.max(200, prev.income.monthlyNet / 5 || 1))),
                      },
                    ],
                  }))
                }
                className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
              >
                + Add emergency goal
              </button>
            </div>
            <div className="space-y-4">
              {state.savingsGoals.length === 0 && (
                <p className="text-sm text-slate-500">No goals yet. Add one or skip for now.</p>
              )}
              {state.savingsGoals.map((goal, index) => (
                <div key={goal.id} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">Name</span>
                    <input
                      type="text"
                      value={goal.name}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          savingsGoals: prev.savingsGoals.map((item, idx) =>
                            idx === index ? { ...item, name: event.target.value } : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">Target</span>
                    <input
                      type="number"
                      value={goal.target || ''}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          savingsGoals: prev.savingsGoals.map((item, idx) =>
                            idx === index
                              ? { ...item, target: Number(event.target.value) || 0 }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">Monthly contribution</span>
                    <input
                      type="number"
                      value={goal.monthlyContribution || ''}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          savingsGoals: prev.savingsGoals.map((item, idx) =>
                            idx === index
                              ? { ...item, monthlyContribution: Number(event.target.value) || 0 }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">ETA (months)</span>
                    <input
                      type="number"
                      value={goal.etaMonths || ''}
                      onChange={(event) =>
                        updateState((prev) => ({
                          ...prev,
                          savingsGoals: prev.savingsGoals.map((item, idx) =>
                            idx === index
                              ? { ...item, etaMonths: Number(event.target.value) || 0 }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                updateState((prev) => ({
                  ...prev,
                  savingsGoals: [
                    ...prev.savingsGoals,
                    {
                      id: `goal-${prev.savingsGoals.length + 1}`,
                      name: 'Holiday fund',
                      target: 2500,
                      monthlyContribution: 210,
                      etaMonths: 12,
                    },
                  ],
                }))
              }
              className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
            >
              + Add another goal
            </button>
          </div>
        )
      }
      case 'investments': {
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Add balances or skip for now. Live quotes become available when you toggle on the AI advisor or premium data.
            </p>
            <button
              type="button"
              onClick={() =>
                updateState((prev) => ({
                  ...prev,
                  investments: [
                    ...prev.investments,
                    {
                      id: `investment-${prev.investments.length + 1}`,
                      name: prev.investments.length === 0 ? 'Brokerage' : 'Crypto wallet',
                      balance: prev.investments.length === 0 ? 8200 : 1600,
                      holdings:
                        prev.investments.length === 0
                          ? [
                              { symbol: 'VOO', quantity: 12, price: 410 },
                              { symbol: 'MSFT', quantity: 5, price: 325 },
                            ]
                          : [
                              { symbol: 'BTC', quantity: 0.08, price: 52000 },
                            ],
                    },
                  ],
                }))
              }
              className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
            >
              + Add investment
            </button>
            <div className="space-y-4">
              {state.investments.length === 0 && (
                <p className="text-sm text-slate-500">No investments added yet.</p>
              )}
              {state.investments.map((investment, index) => (
                <div key={investment.id} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase text-slate-500">Account name</span>
                      <input
                        type="text"
                        value={investment.name}
                        onChange={(event) =>
                          updateState((prev) => ({
                            ...prev,
                            investments: prev.investments.map((item, idx) =>
                              idx === index ? { ...item, name: event.target.value } : item
                            ),
                          }))
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase text-slate-500">Balance</span>
                      <input
                        type="number"
                        value={investment.balance || ''}
                        onChange={(event) =>
                          updateState((prev) => ({
                            ...prev,
                            investments: prev.investments.map((item, idx) =>
                              idx === index
                                ? { ...item, balance: Number(event.target.value) || 0 }
                                : item
                            ),
                          }))
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </label>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Holdings</h4>
                    {investment.holdings.map((holding, holdingIndex) => (
                      <div key={`${investment.id}-holding-${holdingIndex}`} className="grid gap-3 md:grid-cols-3">
                        <input
                          type="text"
                          value={holding.symbol}
                          onChange={(event) =>
                            updateState((prev) => ({
                              ...prev,
                              investments: prev.investments.map((item, idx) => {
                                if (idx !== index) return item
                                const holdings = item.holdings.map((entry, entryIndex) =>
                                  entryIndex === holdingIndex
                                    ? { ...entry, symbol: event.target.value.toUpperCase() }
                                    : entry
                                )
                                return { ...item, holdings }
                              }),
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm uppercase shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="VOO"
                        />
                        <input
                          type="number"
                          value={holding.quantity}
                          onChange={(event) =>
                            updateState((prev) => ({
                              ...prev,
                              investments: prev.investments.map((item, idx) => {
                                if (idx !== index) return item
                                const holdings = item.holdings.map((entry, entryIndex) =>
                                  entryIndex === holdingIndex
                                    ? { ...entry, quantity: Number(event.target.value) || 0 }
                                    : entry
                                )
                                return { ...item, holdings }
                              }),
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="10"
                        />
                        <input
                          type="number"
                          value={holding.price}
                          onChange={(event) =>
                            updateState((prev) => ({
                              ...prev,
                              investments: prev.investments.map((item, idx) => {
                                if (idx !== index) return item
                                const holdings = item.holdings.map((entry, entryIndex) =>
                                  entryIndex === holdingIndex
                                    ? { ...entry, price: Number(event.target.value) || 0 }
                                    : entry
                                )
                                return { ...item, holdings }
                              }),
                            }))
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="410"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateState((prev) => ({
                          ...prev,
                          investments: prev.investments.map((item, idx) =>
                            idx === index
                              ? {
                                  ...item,
                                  holdings: [
                                    ...item.holdings,
                                    { symbol: 'NEW', quantity: 1, price: 100 },
                                  ],
                                }
                              : item
                          ),
                        }))
                      }
                      className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                    >
                      + Add holding
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
      case 'notifications': {
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Stay in the loop</h3>
              <p className="mt-2 text-sm text-slate-600">
                Pick how often we nudge you. Smart mode adapts based on activity, overspending, and upcoming bills.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {(
                  [
                    { value: 'smart', label: 'Smart (recommended)' },
                    { value: 'weekly', label: 'Weekly digest' },
                    { value: 'off', label: 'No emails' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      updateState((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, monthlyReport: option.value },
                      }))
                    }
                    className={`rounded-3xl border p-4 text-left text-sm transition ${
                      state.notifications.monthlyReport === option.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-slate-200 bg-white shadow-sm'
                    }`}
                  >
                    <span className="font-semibold text-slate-800">{option.label}</span>
                    <p className="mt-1 text-xs text-slate-500">
                      {option.value === 'smart'
                        ? 'AI-curated nudges when something needs attention.'
                        : option.value === 'weekly'
                        ? 'A digest every Monday morning with highlights.'
                        : 'Silence the inbox — notifications stay inside the app.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Overspend alerts</p>
                  <p className="text-xs text-slate-500">Smart pings when envelopes go red.</p>
                </div>
                <input
                  type="checkbox"
                  checked={state.notifications.overspendAlerts}
                  onChange={(event) =>
                    updateState((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, overspendAlerts: event.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Bill reminders</p>
                  <p className="text-xs text-slate-500">We’ll nudge you 3 days before due dates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={state.notifications.billReminders}
                  onChange={(event) =>
                    updateState((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, billReminders: event.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Goal nudges</p>
                  <p className="text-xs text-slate-500">Cheer you on when you are close to a milestone.</p>
                </div>
                <input
                  type="checkbox"
                  checked={state.notifications.goalNudges}
                  onChange={(event) =>
                    updateState((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, goalNudges: event.target.checked },
                    }))
                  }
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>
        )
      }
      case 'layout': {
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Theme & accent</h3>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    updateState((prev) => ({
                      ...prev,
                      dashboard: { ...prev.dashboard, theme: 'light' },
                      profile: { ...prev.profile, theme: 'light' },
                    }))
                  }
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    state.dashboard.theme === 'light'
                      ? 'bg-white text-slate-900 shadow'
                      : 'border border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateState((prev) => ({
                      ...prev,
                      dashboard: { ...prev.dashboard, theme: 'dark' },
                      profile: { ...prev.profile, theme: 'dark' },
                    }))
                  }
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    state.dashboard.theme === 'dark'
                      ? 'bg-midnight text-white shadow'
                      : 'border border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  Dark
                </button>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  Accent
                  <input
                    type="color"
                    value={state.dashboard.accentColor}
                    onChange={(event) =>
                      updateState((prev) => ({
                        ...prev,
                        dashboard: { ...prev.dashboard, accentColor: event.target.value },
                        profile: { ...prev.profile, accentColor: event.target.value },
                      }))
                    }
                    className="h-10 w-16 cursor-pointer rounded border border-slate-200"
                  />
                </label>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Dashboard widgets</h3>
                  <p className="text-sm text-slate-600">Toggle visibility or reorder cards.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateState((prev) => ({
                      ...prev,
                      dashboard: { ...prev.dashboard, widgets: defaultWidgets.map((widget) => ({ ...widget })) },
                    }))
                  }
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Reset order
                </button>
              </div>
              <ul className="mt-4 space-y-3">
                {state.dashboard.widgets.map((widget, index) => (
                  <li
                    key={widget.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white font-semibold text-slate-500 shadow-sm">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">{widget.label}</p>
                        <p className="text-xs text-slate-500">{widget.visible ? 'Visible' : 'Hidden'} on launch</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleWidgetVisibilityToggle(widget.id)}
                        className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
                      >
                        {widget.visible ? 'Hide' : 'Show'}
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveWidget(widget.id, 'up')}
                          disabled={index === 0}
                          className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveWidget(widget.id, 'down')}
                          disabled={index === state.dashboard.widgets.length - 1}
                          className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      }
      case 'review': {
        const totalBudget = state.budget.categories.reduce((total, category) => total + (category.planned || 0), 0)
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2 text-sm text-slate-600">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile</h4>
                  <p>
                    {state.profile.firstName || 'You'} • {state.profile.country} • {state.profile.currency}
                  </p>
                  <p>Timezone: {state.profile.timezone}</p>
                  <p>Date format: {state.profile.dateFormat}</p>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Modules enabled</h4>
                  <p>
                    {Object.entries(state.modules)
                      .filter(([, details]) => details.enabled)
                      .map(([key]) => moduleCatalog.find((module) => module.key === key)?.label ?? key)
                      .join(', ') || 'Budget (default)'}
                  </p>
                  {Object.values(state.modules).some((module) => module.pendingUpgrade) && (
                    <p className="text-xs text-amber-600">Premium trials will gently remind you before billing.</p>
                  )}
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Accounts</h4>
                  <p>
                    {state.accounts.length > 0
                      ? state.accounts
                          .map((account) => `${account.name} (${formatCurrency(account.balance, state.profile.currency)})`)
                          .join(', ')
                      : 'Add at least one account to keep charts alive.'}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Budget snapshot</h4>
                  <p>{formatCurrency(totalBudget || state.budget.monthlyTakeHome, state.profile.currency)} planned this month.</p>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Goals & ETAs</h4>
                  <p>
                    {state.savingsGoals.length > 0
                      ? state.savingsGoals
                          .map((goal) => `${goal.name} (${goal.etaMonths} mo)`)
                          .join(', ')
                      : 'Goals ready when you are — add one to unlock celebrations.'}
                  </p>
                </div>
                {state.debts.length > 0 && (
                  <div className="space-y-2 text-sm text-slate-600">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Debts</h4>
                    <p>
                      {state.debts
                        .map((debt) => `${debt.name} (${formatCurrency(debt.balance, state.profile.currency)})`)
                        .join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
              <p className="font-semibold">Tiny disclaimer</p>
              <p className="mt-1">WalletHabit offers guidance, not financial advice. Always personalise before acting.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
              >
                {isFinishing ? 'Finishing…' : 'Finish & go to dashboard'}
              </button>
              {!state.isDemo && (
                <button
                  type="button"
                  onClick={startDemo}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-brand/60 hover:text-brand"
                >
                  Load with demo data instead
                </button>
              )}
            </div>
          </div>
        )
      }
      case 'tour': {
        const tourStops = [
          {
            title: 'Quick Add (+)',
            description: 'Fastest way to log anything — transactions, transfers, and notes.'
          },
          {
            title: 'Budget bars',
            description: 'Colour tells you if you are on track. Tap to edit envelopes instantly.'
          },
          {
            title: 'Debt meter & goal rings',
            description: 'Watch payoff timelines shrink and savings progress climb.'
          },
          {
            title: 'Insights',
            description: 'Your coach lives here. Expect gentle nudges and bright spots.'
          },
          {
            title: 'Modules menu',
            description: 'Add more power (investments, taxes, AI) whenever you are ready.'
          },
        ]

        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">90-second orientation</h3>
              <p className="mt-2 text-sm text-slate-600">
                We will point out what matters now so you can explore with confidence. Tooltips appear the first time you land on the dashboard.
              </p>
              <ol className="mt-6 space-y-4 text-sm text-slate-600">
                {tourStops.map((stop, index) => (
                  <li key={stop.title} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white font-semibold text-slate-500 shadow-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">{stop.title}</p>
                      <p className="text-xs text-slate-500">{stop.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-brand/40 bg-brand/5 p-5 text-sm text-brand">
              <p>Ready to explore? Keep the momentum going by logging a transaction right away.</p>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        )
      }
      default:
        return null
    }
  }

  const progress = ((stepIndex + 1) / steps.length) * 100
  const showBack = stepIndex > 0 && currentStep?.id !== 'review'
  const showNext = currentStep?.id !== 'review' && currentStep?.id !== 'tour'

  return (
    <div className="flex flex-1 flex-col gap-8 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Setup guide</p>
          <h1 className="text-3xl font-bold text-slate-900">Website-wide onboarding</h1>
          <p className="mt-1 text-sm text-slate-600">
            Progress auto-saves. Resume anytime and pick up where you left off.
          </p>
        </div>
        <button
          type="button"
          onClick={resetOnboarding}
          className="rounded-full border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand/60 hover:text-brand"
        >
          Reset guide
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {stepIndex + 1}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Step {stepIndex + 1} of {steps.length}
                {currentStep?.optional ? ' • Optional' : ''}
              </p>
              <h2 className="text-xl font-semibold text-slate-900">{currentStep?.title}</h2>
              <p className="text-sm text-slate-600">{currentStep?.description}</p>
            </div>
          </div>
          <div className="hidden min-w-[200px] flex-col gap-2 text-xs text-slate-500 sm:flex">
            <div className="flex justify-between">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="mt-6">
          {renderStepContent()}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            ✓
          </span>
          Progress saves on every step. On return, we resume automatically.
        </div>
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand/60 hover:text-brand"
            >
              Back
            </button>
          )}
          {showNext && (
            <button
              type="button"
              onClick={() => {
                if (currentStep?.id === 'welcome' && state.mode !== 'build') {
                  handleNext()
                } else {
                  if (state.mode === 'demo' && currentStep?.id !== 'tour') {
                    handleNext()
                  } else {
                    handleNext()
                  }
                }
              }}
              disabled={currentStep?.id === 'welcome' && !state.mode}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
