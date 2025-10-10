import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  type DemoBudgetEnvelope,
  type DemoGoal,
  type DemoProfile,
  type DemoState,
  DEMO_STORAGE_KEY,
  createDefaultDemoState,
  getNotificationDefaults,
} from './demoData'

const hydrateDemoState = (): DemoState => {
  const base = createDefaultDemoState()

  if (typeof window === 'undefined') {
    return base
  }

  const stored = window.localStorage.getItem(DEMO_STORAGE_KEY)
  if (!stored) {
    return base
  }

  try {
    const parsed = JSON.parse(stored) as Partial<DemoState>
    return mergeState(base, parsed)
  } catch (error) {
    console.warn('[WalletHabit] Failed to parse stored demo data. Resetting to defaults.', error)
    return base
  }
}

const mergeState = (defaults: DemoState, stored: Partial<DemoState>): DemoState => {
  const nextProfile: DemoProfile = {
    ...defaults.profile,
    ...stored.profile,
    notifications: {
      ...getNotificationDefaults(),
      ...(stored.profile?.notifications ?? {}),
    },
  }

  const nextEnvelopes: DemoBudgetEnvelope[] = defaults.budget.envelopes.map((envelope) => {
    const storedEnvelope = stored.budget?.envelopes?.find((item) => item.id === envelope.id)
    if (!storedEnvelope) {
      return envelope
    }

    return {
      ...envelope,
      ...storedEnvelope,
      baseline: envelope.baseline,
      planned: Math.max(storedEnvelope.planned ?? envelope.planned, envelope.spent),
      spent: storedEnvelope.spent ?? envelope.spent,
    }
  })

  const nextGoals: DemoGoal[] = defaults.goals.items.map((goal) => {
    const storedGoal = stored.goals?.items?.find((item) => item.id === goal.id)
    if (!storedGoal) {
      return goal
    }
    return {
      ...goal,
      ...storedGoal,
      trend: storedGoal.trend?.length ? storedGoal.trend : goal.trend,
    }
  })

  return {
    session: {
      ...defaults.session,
      ...stored.session,
    },
    profile: nextProfile,
    budget: {
      ...defaults.budget,
      ...stored.budget,
      envelopes: nextEnvelopes,
    },
    goals: {
      ...defaults.goals,
      ...stored.goals,
      items: nextGoals,
    },
  }
}

const DemoDataContext = createContext<DemoDataContextValue | undefined>(undefined)

export type DemoDataContextValue = {
  state: DemoState
  isAuthenticated: boolean
  signIn: () => void
  signOut: () => void
  setBudgetCadence: (cadence: DemoProfile['budgetCadence']) => void
  updatePlan: (planId: string) => void
  updateLocale: (localeId: string) => void
  updateFirstDayOfWeek: (value: DemoProfile['firstDayOfWeek']) => void
  updateRoundingMode: (mode: DemoProfile['roundingMode']) => void
  setFocusHabits: (habits: DemoProfile['focusHabits']) => void
  setReminderCadence: (cadence: DemoProfile['reminderCadence']) => void
  setCelebrationStyle: (style: DemoProfile['celebrationStyle']) => void
  toggleNotification: (id: string) => void
  updateMonthlyIncome: (income: number) => void
  updateEnvelopePlanned: (id: string, planned: number) => void
  resetEnvelopePlanned: (id: string) => void
  resetBudget: () => void
  resetDemoData: () => void
  updateLastActive: () => void
}

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => hydrateDemoState())
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state))
  }, [state, hasHydrated])

  const contextValue = useMemo<DemoDataContextValue>(() => {
    const updateState = (updater: (previous: DemoState) => DemoState) => {
      setState((previous) => updater(previous))
    }

    return {
      state,
      isAuthenticated: state.session.isAuthenticated,
      signIn: () => {
        updateState((previous) => ({
          ...previous,
          session: {
            ...previous.session,
            isAuthenticated: true,
            lastSignedInAt: new Date().toISOString(),
          },
          profile: {
            ...previous.profile,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      signOut: () => {
        updateState((previous) => ({
          ...previous,
          session: {
            ...previous.session,
            isAuthenticated: false,
          },
        }))
      },
      setBudgetCadence: (cadence: DemoProfile['budgetCadence']) => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            budgetCadence: cadence,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      updatePlan: (planId: string) => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            planId,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      updateLocale: (localeId: string) => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            localeId,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      updateFirstDayOfWeek: (value: DemoProfile['firstDayOfWeek']) => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            firstDayOfWeek: value,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      updateRoundingMode: (mode: DemoProfile['roundingMode']) => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            roundingMode: mode,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      setFocusHabits: (habits: DemoProfile['focusHabits']) => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            focusHabits: habits,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      setReminderCadence: (cadence: DemoProfile['reminderCadence']) => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            reminderCadence: cadence,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      setCelebrationStyle: (style: DemoProfile['celebrationStyle']) => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            celebrationStyle: style,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      toggleNotification: (id: string) => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            notifications: {
              ...previous.profile.notifications,
              [id]: !previous.profile.notifications[id],
            },
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
      updateMonthlyIncome: (income: number) => {
        updateState((previous) => ({
          ...previous,
          budget: {
            ...previous.budget,
            monthlyIncome: Math.max(0, Math.round(income)),
            lastReconciledAt: new Date().toISOString(),
          },
        }))
      },
      updateEnvelopePlanned: (id: string, planned: number) => {
        updateState((previous) => ({
          ...previous,
          budget: {
            ...previous.budget,
            envelopes: previous.budget.envelopes.map((envelope) =>
              envelope.id === id
                ? {
                    ...envelope,
                    planned: Math.max(planned, envelope.spent),
                  }
                : envelope,
            ),
            lastReconciledAt: new Date().toISOString(),
          },
        }))
      },
      resetEnvelopePlanned: (id: string) => {
        updateState((previous) => ({
          ...previous,
          budget: {
            ...previous.budget,
            envelopes: previous.budget.envelopes.map((envelope) =>
              envelope.id === id
                ? {
                    ...envelope,
                    planned: envelope.baseline,
                  }
                : envelope,
            ),
            lastReconciledAt: new Date().toISOString(),
          },
        }))
      },
      resetBudget: () => {
        updateState((previous) => ({
          ...previous,
          budget: {
            ...previous.budget,
            envelopes: previous.budget.envelopes.map((envelope) => ({
              ...envelope,
              planned: envelope.baseline,
            })),
            lastReconciledAt: new Date().toISOString(),
          },
        }))
      },
      resetDemoData: () => {
        setState(createDefaultDemoState())
      },
      updateLastActive: () => {
        updateState((previous) => ({
          ...previous,
          profile: {
            ...previous.profile,
            lastActiveAt: new Date().toISOString(),
          },
        }))
      },
    }
  }, [state])

  return <DemoDataContext.Provider value={contextValue}>{children}</DemoDataContext.Provider>
}

export const useDemoData = (): DemoDataContextValue => {
  const context = useContext(DemoDataContext)

  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider')
  }

  return context
}
