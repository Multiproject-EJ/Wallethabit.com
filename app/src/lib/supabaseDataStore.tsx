import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { PostgrestError, Session } from '@supabase/supabase-js'

import { hasSupabaseConfig, supabase } from './supabaseClient'

export type SupabaseModule = {
  id: string
  slug: string
  name: string
  description: string | null
  is_premium: boolean
}

export type SupabaseCustomerModule = {
  id: string
  unlocked_at: string
  unlocked_by: string | null
  module: SupabaseModule
}

export type SupabasePurchase = {
  id: string
  plan_tier: string
  provider: string
  status: string
  reference: string | null
  created_at: string
}

export type SupabaseProfile = {
  id: string
  full_name: string | null
  plan_tier: string
  status: string
  created_at: string
  updated_at: string
}

type SupabaseStatus = 'idle' | 'loading' | 'ready' | 'error'

type SupabaseContextValue = {
  isEnabled: boolean
  status: SupabaseStatus
  error: string | null
  session: Session | null
  profile: SupabaseProfile | null
  modules: SupabaseModule[]
  unlockedModules: SupabaseCustomerModule[]
  purchases: SupabasePurchase[]
  refresh: () => Promise<void>
  signInWithPassword: (payload: { email: string; password: string }) => Promise<{ error?: string }>
  signUpFreemium: (payload: {
    email: string
    password: string
    fullName: string
  }) => Promise<{ error?: string; needsConfirmation?: boolean }>
  signOut: () => Promise<{ error?: string }>
}

const disabledValue: SupabaseContextValue = {
  isEnabled: false,
  status: 'idle',
  error: null,
  session: null,
  profile: null,
  modules: [],
  unlockedModules: [],
  purchases: [],
  refresh: async () => {},
  signInWithPassword: async () => ({ error: 'Supabase is not configured.' }),
  signUpFreemium: async () => ({ error: 'Supabase is not configured.' }),
  signOut: async () => ({ error: 'Supabase is not configured.' }),
}

const SupabaseContext = createContext<SupabaseContextValue>(disabledValue)

const formatSupabaseError = (error: PostgrestError | Error | null | undefined): string | undefined => {
  if (!error) {
    return undefined
  }

  if ('message' in error && error.message) {
    return error.message
  }

  return 'Unexpected Supabase error.'
}

type SupabaseProviderProps = {
  children: ReactNode
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  if (!hasSupabaseConfig || !supabase) {
    return <SupabaseContext.Provider value={disabledValue}>{children}</SupabaseContext.Provider>
  }

  return <SupabaseRuntimeProvider>{children}</SupabaseRuntimeProvider>
}

type RuntimeContextState = {
  status: SupabaseStatus
  error: string | null
  session: Session | null
  profile: SupabaseProfile | null
  modules: SupabaseModule[]
  unlockedModules: SupabaseCustomerModule[]
  purchases: SupabasePurchase[]
}

function SupabaseRuntimeProvider({ children }: SupabaseProviderProps) {
  const [state, setState] = useState<RuntimeContextState>({
    status: 'loading',
    error: null,
    session: null,
    profile: null,
    modules: [],
    unlockedModules: [],
    purchases: [],
  })

  const modulesLoadedRef = useRef(false)

  const setPartialState = useCallback((partial: Partial<RuntimeContextState>) => {
    setState((previous) => ({ ...previous, ...partial }))
  }, [])

  const fetchModules = useCallback(async (): Promise<SupabaseModule[]> => {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('is_premium', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    modulesLoadedRef.current = true
    setPartialState({ modules: data ?? [] })
    return data ?? []
  }, [setPartialState])

  const bootstrapFreemiumAccount = useCallback(
    async (userId: string, fullNameHint: string | null | undefined) => {
      const fullName = fullNameHint?.trim() || 'WalletHabit member'

      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: userId,
          full_name: fullName,
          plan_tier: 'freemium',
          status: 'active',
        },
        { onConflict: 'id' },
      )

      if (profileError) {
        throw profileError
      }

      const { data: purchaseProbe, error: purchaseProbeError } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (purchaseProbeError) {
        throw purchaseProbeError
      }

      if (!purchaseProbe?.length) {
        const { error: purchaseInsertError } = await supabase.from('purchases').insert({
          user_id: userId,
          plan_tier: 'freemium',
          provider: 'freemium',
          status: 'active',
          reference: `freemium-${Date.now()}`,
        })

        if (purchaseInsertError) {
          throw purchaseInsertError
        }
      }

      const { data: unlockedProbe, error: unlockedProbeError } = await supabase
        .from('customer_modules')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (unlockedProbeError) {
        throw unlockedProbeError
      }

      if (!unlockedProbe?.length) {
        const moduleCatalog = modulesLoadedRef.current ? state.modules : await fetchModules()
        const freemiumModules = moduleCatalog.filter((module) => !module.is_premium)

        if (freemiumModules.length) {
          const { error: moduleInsertError } = await supabase.from('customer_modules').upsert(
            freemiumModules.map((module) => ({
              user_id: userId,
              module_id: module.id,
              unlocked_by: 'freemium-plan',
            })),
            { onConflict: 'user_id,module_id' },
          )

          if (moduleInsertError) {
            throw moduleInsertError
          }
        }
      }
    },
    [fetchModules, state.modules],
  )

  const loadAccount = useCallback(
    async (userId: string, fullNameHint: string | null | undefined, allowBootstrap: boolean) => {
      setPartialState({ status: 'loading', error: null })

      const [profileResult, purchasesResult, unlockedResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase
          .from('purchases')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('customer_modules')
          .select('id, unlocked_at, unlocked_by, module:modules(*)')
          .eq('user_id', userId)
          .order('unlocked_at', { ascending: false }),
      ])

      const firstError = profileResult.error || purchasesResult.error || unlockedResult.error

      if (firstError) {
        setPartialState({ status: 'error', error: formatSupabaseError(firstError) ?? null })
        return
      }

      const profile = profileResult.data ?? null
      const purchases = purchasesResult.data ?? []
      const unlockedModules = unlockedResult.data ?? []

      if (allowBootstrap && (!profile || purchases.length === 0 || unlockedModules.length === 0)) {
        try {
          await bootstrapFreemiumAccount(userId, fullNameHint)
        } catch (error) {
          setPartialState({ status: 'error', error: formatSupabaseError(error as PostgrestError) ?? null })
          return
        }

        await loadAccount(userId, fullNameHint, false)
        return
      }

      setPartialState({
        status: 'ready',
        error: null,
        profile,
        purchases,
        unlockedModules,
      })
    },
    [bootstrapFreemiumAccount, setPartialState],
  )

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return
      }

      if (error) {
        setPartialState({ status: 'error', error: formatSupabaseError(error) ?? null })
        return
      }

      setPartialState({ session: data.session ?? null, status: data.session ? 'loading' : 'idle' })
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return
      }

      setPartialState({ session, status: session ? 'loading' : 'idle', profile: null, purchases: [], unlockedModules: [] })
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [setPartialState])

  useEffect(() => {
    if (modulesLoadedRef.current || state.modules.length > 0) {
      return
    }

    fetchModules().catch((error) => {
      setPartialState({ status: 'error', error: formatSupabaseError(error) ?? null })
    })
  }, [fetchModules, setPartialState, state.modules.length])

  useEffect(() => {
    if (!state.session) {
      setPartialState({ profile: null, purchases: [], unlockedModules: [] })
      return
    }

    const userId = state.session.user.id
    const fullNameHint = (state.session.user.user_metadata?.full_name as string | null | undefined) ??
      state.session.user.email ??
      undefined

    loadAccount(userId, fullNameHint ?? null, true).catch((error) => {
      setPartialState({ status: 'error', error: formatSupabaseError(error as PostgrestError) ?? null })
    })
  }, [loadAccount, setPartialState, state.session])

  const refresh = useCallback(async () => {
    if (!state.session) {
      return
    }

    await loadAccount(state.session.user.id, state.session.user.user_metadata?.full_name ?? null, false)
  }, [loadAccount, state.session])

  const signInWithPassword = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        return { error: error.message }
      }

      return {}
    },
    [],
  )

  const signUpFreemium = useCallback(
    async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })

      if (error) {
        return { error: error.message }
      }

      const session = data.session ?? null
      const userId = session?.user?.id ?? data.user?.id ?? null

      if (!userId) {
        return {
          needsConfirmation: true,
        }
      }

      try {
        await bootstrapFreemiumAccount(userId, fullName)
        await loadAccount(userId, fullName, false)
      } catch (bootstrapError) {
        return { error: formatSupabaseError(bootstrapError as PostgrestError) }
      }

      return {}
    },
    [bootstrapFreemiumAccount, loadAccount],
  )

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: error.message }
    }

    setPartialState({ status: 'idle', profile: null, purchases: [], unlockedModules: [] })
    return {}
  }, [setPartialState])

  const value = useMemo<SupabaseContextValue>(
    () => ({
      isEnabled: true,
      status: state.status,
      error: state.error,
      session: state.session,
      profile: state.profile,
      modules: state.modules,
      unlockedModules: state.unlockedModules,
      purchases: state.purchases,
      refresh,
      signInWithPassword,
      signUpFreemium,
      signOut,
    }),
    [refresh, signInWithPassword, signOut, signUpFreemium, state],
  )

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

export function useSupabaseApp() {
  return useContext(SupabaseContext)
}

