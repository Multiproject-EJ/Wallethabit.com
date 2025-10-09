export type DemoProfile = {
  id: string
  email: string
  fullName: string
  initials: string
  planId: string
  localeId: string
  firstDayOfWeek: 'Sunday' | 'Monday'
  roundingMode: 'exact' | 'nearest-dollar'
  notifications: Record<string, boolean>
  createdAt: string
  lastActiveAt: string
}

export type DemoBudgetEnvelope = {
  id: string
  name: string
  description: string
  planned: number
  spent: number
  baseline: number
  essentials?: boolean
}

export type DemoBudget = {
  monthlyIncome: number
  envelopes: DemoBudgetEnvelope[]
  lastReconciledAt: string
}

export type DemoGoal = {
  id: string
  name: string
  description: string
  target: number
  saved: number
  monthlyCommitment: number
  dueLabel: string
  priority: 'High' | 'Medium' | 'Low'
  trend: number[]
}

export type DemoGoals = {
  items: DemoGoal[]
  lastCelebrationAt: string
}

export type DemoSession = {
  isAuthenticated: boolean
  lastSignedInAt: string
}

export type DemoState = {
  session: DemoSession
  profile: DemoProfile
  budget: DemoBudget
  goals: DemoGoals
}

export const DEMO_STORAGE_KEY = 'walletHabit.demoState.v1'

const notificationDefaults: Record<string, boolean> = {
  'weekly-digest': true,
  'cashflow-alerts': true,
  'goal-celebrations': true,
  'product-updates': false,
}

export const createDefaultDemoState = (): DemoState => ({
  session: {
    isAuthenticated: true,
    lastSignedInAt: '2024-02-20T15:30:00.000Z',
  },
  profile: {
    id: 'demo-user-avery',
    email: 'avery@wallethabit.com',
    fullName: 'Avery Carter',
    initials: 'AC',
    planId: 'foundation',
    localeId: 'en-US',
    firstDayOfWeek: 'Sunday',
    roundingMode: 'nearest-dollar',
    notifications: { ...notificationDefaults },
    createdAt: '2023-11-18T12:00:00.000Z',
    lastActiveAt: '2024-02-27T09:45:00.000Z',
  },
  budget: {
    monthlyIncome: 4200,
    lastReconciledAt: '2024-02-25T00:00:00.000Z',
    envelopes: [
      {
        id: 'housing',
        name: 'Housing',
        description: 'Rent, utilities, insurance, internet',
        planned: 1400,
        baseline: 1400,
        spent: 1350,
        essentials: true,
      },
      {
        id: 'food',
        name: 'Groceries & Dining',
        description: 'Weekly groceries, occasional dinners out',
        planned: 520,
        baseline: 520,
        spent: 410,
        essentials: true,
      },
      {
        id: 'transport',
        name: 'Transportation',
        description: 'Gas, public transit, ride shares, maintenance',
        planned: 240,
        baseline: 240,
        spent: 180,
        essentials: true,
      },
      {
        id: 'wellness',
        name: 'Wellness',
        description: 'Gym, therapy, supplements, sports',
        planned: 160,
        baseline: 160,
        spent: 95,
      },
      {
        id: 'fun',
        name: 'Fun & Experiences',
        description: 'Streaming, hobbies, travel savings, gifting',
        planned: 220,
        baseline: 220,
        spent: 60,
      },
      {
        id: 'future',
        name: 'Future You',
        description: 'Emergency fund, investments, education',
        planned: 400,
        baseline: 400,
        spent: 150,
      },
    ],
  },
  goals: {
    lastCelebrationAt: '2024-02-10T00:00:00.000Z',
    items: [
      {
        id: 'emergency',
        name: 'Emergency cushion',
        description: 'Cover three months of core expenses in a high-yield savings account.',
        target: 10000,
        saved: 6800,
        monthlyCommitment: 400,
        dueLabel: 'Dec 2024',
        priority: 'High',
        trend: [3200, 3600, 4200, 5100, 5800, 6200, 6800],
      },
      {
        id: 'travel',
        name: 'Iceland adventure',
        description: 'Flights, lodging, and experiences for a two-week summer escape.',
        target: 4500,
        saved: 2100,
        monthlyCommitment: 250,
        dueLabel: 'Aug 2025',
        priority: 'Medium',
        trend: [400, 650, 800, 1200, 1500, 1900, 2100],
      },
      {
        id: 'studio',
        name: 'Creative studio upgrade',
        description: 'New desk setup, lighting, and acoustic panels for content creation.',
        target: 3200,
        saved: 1250,
        monthlyCommitment: 180,
        dueLabel: 'Mar 2025',
        priority: 'Low',
        trend: [0, 0, 120, 320, 620, 980, 1250],
      },
    ],
  },
})

export const getNotificationDefaults = () => ({ ...notificationDefaults })
