export type DemoProfile = {
  id: string
  email: string
  fullName: string
  initials: string
  planId: string
  region: 'uk' | 'us' | 'no'
  localeId: string
  currency: string
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
    id: 'demo-user-alex',
    email: 'alex@wallethabit.com',
    fullName: 'Alex Rivera',
    initials: 'AR',
    planId: 'foundation',
    region: 'uk',
    localeId: 'en-GB',
    currency: 'GBP',
    firstDayOfWeek: 'Monday',
    roundingMode: 'nearest-dollar',
    notifications: { ...notificationDefaults },
    createdAt: '2023-11-18T12:00:00.000Z',
    lastActiveAt: '2024-02-27T09:45:00.000Z',
  },
  budget: {
    monthlyIncome: 3600,
    lastReconciledAt: '2024-02-25T00:00:00.000Z',
    envelopes: [
      {
        id: 'rent',
        name: 'Rent',
        description: 'Flat in Shoreditch, due on the 1st each month',
        planned: 1450,
        baseline: 1450,
        spent: 1450,
        essentials: true,
      },
      {
        id: 'utilities',
        name: 'Utilities',
        description: 'Electric, water, broadband split across the 18th',
        planned: 185,
        baseline: 180,
        spent: 192,
        essentials: true,
      },
      {
        id: 'phone',
        name: 'Phone',
        description: 'iPhone plan and device insurance bundle',
        planned: 45,
        baseline: 45,
        spent: 47,
        essentials: true,
      },
      {
        id: 'subscriptions',
        name: 'Subscriptions',
        description: 'Netflix, Spotify, Figma, and a running app',
        planned: 38,
        baseline: 36,
        spent: 42,
        essentials: false,
      },
      {
        id: 'insurance',
        name: 'Insurance',
        description: 'Renter’s cover and phone protection paid mid-month',
        planned: 23,
        baseline: 23,
        spent: 23,
        essentials: true,
      },
      {
        id: 'groceries',
        name: 'Groceries',
        description: 'Weekly Tesco run and farmers market treats',
        planned: 260,
        baseline: 260,
        spent: 272,
      },
      {
        id: 'dining',
        name: 'Dining Out',
        description: 'Coffee with friends and Friday ramen',
        planned: 180,
        baseline: 180,
        spent: 194,
      },
      {
        id: 'transport',
        name: 'Transport',
        description: 'Oyster top-ups, ride shares, and occasional train trips',
        planned: 120,
        baseline: 120,
        spent: 108,
      },
      {
        id: 'entertainment',
        name: 'Entertainment',
        description: 'Cinema club, live gigs, and creative workshops',
        planned: 80,
        baseline: 80,
        spent: 88,
      },
      {
        id: 'shopping',
        name: 'Shopping',
        description: 'Wardrobe refresh and home studio upgrades',
        planned: 120,
        baseline: 120,
        spent: 134,
      },
      {
        id: 'health',
        name: 'Health',
        description: 'Pilates sessions and prescriptions',
        planned: 40,
        baseline: 40,
        spent: 36,
      },
      {
        id: 'travel',
        name: 'Travel',
        description: 'Saving for a Barcelona design conference',
        planned: 90,
        baseline: 90,
        spent: 102,
      },
    ],
  },
  goals: {
    lastCelebrationAt: '2024-02-10T00:00:00.000Z',
    items: [
      {
        id: 'emergency',
        name: 'Emergency fund',
        description: 'Build a £6k buffer covering three months of living costs.',
        target: 6000,
        saved: 3825,
        monthlyCommitment: 250,
        dueLabel: 'Oct 2024',
        priority: 'High',
        trend: [2100, 2350, 2600, 2900, 3125, 3450, 3825],
      },
      {
        id: 'holiday',
        name: 'Mallorca holiday',
        description: 'Flights, boutique stay, and tapas crawl for a summer recharge.',
        target: 1800,
        saved: 960,
        monthlyCommitment: 100,
        dueLabel: 'Jul 2024',
        priority: 'Medium',
        trend: [280, 360, 440, 560, 720, 860, 960],
      },
    ],
  },
})

export const getNotificationDefaults = () => ({ ...notificationDefaults })
