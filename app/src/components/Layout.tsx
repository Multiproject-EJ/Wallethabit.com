import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import DemoUserBadge from './DemoUserBadge'
import FloatingActionButton from './FloatingActionButton'
import PwaPromptHub from './PwaPromptHub'
import { useDemoData } from '../lib/demoDataStore'
import { useSupabaseApp } from '../lib/supabaseDataStore'

type InternalNavItem = {
  type: 'internal'
  to: string
  label: string
  end?: boolean
  accent?: boolean
  icon?: ReactNode
  ariaLabel?: string
}

type ExternalNavItem = {
  type: 'external'
  href: string
  label: string
  accent?: boolean
}

type NavItem = InternalNavItem | ExternalNavItem

const baseNavItems: NavItem[] = [
  { type: 'external', href: '/app/', label: 'Launch app' },
  { type: 'external', href: 'https://www.SavePixie.com', label: 'SavePixie' },
  { type: 'internal', to: '/status', label: 'Status' },
  { type: 'internal', to: '/pwa', label: 'PWA' },
  { type: 'internal', to: '/dev-blocks', label: 'Dev Blocks' },
  { type: 'internal', to: '/habits', label: 'Habits', accent: true },
  {
    type: 'internal',
    to: '/mobile',
    label: 'Mobile',
    ariaLabel: 'Mobile module',
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x={7} y={3} width={10} height={18} rx={2.5} ry={2.5} />
        <line x1={10} y1={17} x2={14} y2={17} />
        <circle cx={12} cy={7} r={0.9} fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

type ModuleKey =
  | 'mobile'
  | 'budget'
  | 'debts'
  | 'savings'
  | 'investments'
  | 'income'
  | 'subscriptions'
  | 'bills'
  | 'realEstate'
  | 'insurance'
  | 'taxes'
  | 'retirement'
  | 'aiAdvisor'

type ModuleInfo = {
  key: ModuleKey
  label: string
  description: string
  premium?: boolean
}

const moduleCatalog: ModuleInfo[] = [
  {
    key: 'mobile',
    label: 'Mobile ritual module',
    description: 'App-like experience tuned for thumb-friendly habits and sharing.',
  },
  {
    key: 'budget',
    label: 'Budget planner',
    description: 'Plan spending with real-time envelope tracking.',
  },
  {
    key: 'debts',
    label: 'Debt payoff lab',
    description: 'Model snowball vs avalanche, track payoff forecasts.',
  },
  {
    key: 'savings',
    label: 'Savings tracker',
    description: 'Create goals, automate transfers, and celebrate milestones.',
  },
  {
    key: 'investments',
    label: 'Investments hub',
    description: 'Monitor holdings, projected growth, and allocation drift.',
  },
  {
    key: 'income',
    label: 'Income & side hustles',
    description: 'Track paydays, gigs, and momentum boosts.',
  },
  {
    key: 'subscriptions',
    label: 'Subscription tracker',
    description: 'Monitor renewals, reminders, and recurring spend.',
  },
  {
    key: 'bills',
    label: 'Bills tracker',
    description: 'Organise utilities, policies, and due dates.',
  },
  {
    key: 'realEstate',
    label: 'Real estate',
    description: 'Track property values, mortgages, and rental yields.',
  },
  {
    key: 'insurance',
    label: 'Insurance vault',
    description: 'Spot coverage gaps and renewal reminders.',
  },
  {
    key: 'taxes',
    label: 'Taxes workspace',
    description: 'Prepare filings, deductions, and estimated payments.',
  },
  {
    key: 'retirement',
    label: 'Retirement studio',
    description: 'Project glide paths and safe-withdrawal coverage.',
  },
  {
    key: 'aiAdvisor',
    label: 'AI advisor',
    description: 'Pro insights, smart nudges, and conversational planning.',
    premium: true,
  },
]

const myModuleKeys = new Set<ModuleKey>(['savings', 'mobile'])

export default function Layout() {
  const {
    state: { profile },
    isAuthenticated,
  } = useDemoData()
  const { session } = useSupabaseApp()

  const isLoggedIn = isAuthenticated || Boolean(session)

  const navItems = useMemo<NavItem[]>(() => {
    if (!isLoggedIn) {
      return []
    }

    const dashboardNav: NavItem = {
      type: 'internal',
      to: '/dashboard',
      label: 'Dashboard',
      end: true,
    }

    return [dashboardNav, ...baseNavItems]
  }, [isLoggedIn])

  const skin = profile.skin ?? 'classic'
  const isUltimate = skin === 'ultimate-budget'

  const [isModulesOpen, setModulesOpen] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobileModulesOpen, setMobileModulesOpen] = useState(false)
  const modulesButtonRef = useRef<HTMLButtonElement | null>(null)
  const modulesPanelRef = useRef<HTMLDivElement | null>(null)
  const mobileMenuId = 'mobile-navigation-panel'
  const [isUnderConstructionVisible, setUnderConstructionVisible] = useState(true)
  const constructionStorageKey = 'wallethabit-under-construction-dismissed'

  const handleDismissUnderConstruction = () => {
    setUnderConstructionVisible(false)
    try {
      window.localStorage.setItem(constructionStorageKey, 'true')
    } catch (error) {
      console.error('Unable to write to local storage', error)
    }
  }

  const moduleGroups = useMemo(() => {
    const myModules = moduleCatalog.filter((module) => myModuleKeys.has(module.key))
    const allModules = moduleCatalog.filter((module) => !myModuleKeys.has(module.key))
    return { myModules, allModules }
  }, [])

  const accentActiveClass = isUltimate
    ? 'bg-[#d9cbb8] text-[#3f2a1e] font-semibold shadow-[0_12px_30px_rgba(63,42,30,0.18)]'
    : 'bg-gold text-navy font-semibold shadow-[0_10px_30px_rgba(31,42,68,0.22)]'

  const accentIdleClass = isUltimate
    ? 'bg-[#efe2cc] text-[#3f2a1e] font-semibold shadow-sm hover:bg-[#e3d3b9] hover:text-[#34271c]'
    : 'bg-gold/80 text-navy font-semibold shadow-sm hover:bg-gold hover:text-navy/90'

  const navActiveClass = isUltimate
    ? 'bg-[#e5ecdf] text-[#5c7751] border-[#8aa27b] shadow-sm'
    : 'bg-primary/10 text-primary border-primary/30 shadow-sm'

  const navHoverClass = isUltimate
    ? 'hover:text-[#4f6745] hover:bg-[#f3e7d4]'
    : 'hover:text-primary-dark hover:bg-white/60'

  const focusRingClass = isUltimate
    ? 'focus-visible:outline-[#8aa27b]'
    : 'focus-visible:outline-primary'

  useEffect(() => {
    if (!isLoggedIn) {
      setModulesOpen(false)
      setMobileMenuOpen(false)
      setMobileModulesOpen(false)
    }
  }, [isLoggedIn])

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(constructionStorageKey)
      if (storedValue === 'true') {
        setUnderConstructionVisible(false)
      }
    } catch (error) {
      console.error('Unable to access local storage', error)
    }
  }, [])

  useEffect(() => {
    if (!isUnderConstructionVisible) {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isUnderConstructionVisible])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setMobileModulesOpen(false)
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isModulesOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        modulesPanelRef.current?.contains(target) ||
        modulesButtonRef.current?.contains(target)
      ) {
        return
      }
      setModulesOpen(false)
    }

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Node
      if (
        modulesPanelRef.current?.contains(target) ||
        modulesButtonRef.current?.contains(target)
      ) {
        return
      }
      setModulesOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModulesOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModulesOpen])

  return (
    <div
      className={`min-h-screen transition-colors ${
        isUltimate ? 'bg-[#f4efe6] text-[#3f2a1e]' : 'bg-sand text-navy'
      }`}
    >
      {isUnderConstructionVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="under-construction-title"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 text-center text-white shadow-[0_30px_80px_rgba(15,23,42,0.5)] backdrop-blur-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-9 w-9 text-white/80"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 18v-4a2 2 0 0 0-2-2h-1" />
                <path d="M7 6H5a2 2 0 0 0-2 2v4" />
                <rect width="14" height="12" x="7" y="6" rx="2" />
                <path d="m7 10 4 0" />
                <path d="m15 13 2 0" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <h2 id="under-construction-title" className="text-2xl font-semibold tracking-tight">
              We’re laying the foundation
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              WalletHabit is still under construction.
            </p>
            <button
              type="button"
              onClick={handleDismissUnderConstruction}
              className="mt-6 text-xs font-semibold text-white/30 transition-colors hover:text-white/55 focus-visible:text-white/55 focus-visible:outline-none"
            >
              <span aria-hidden="true">•</span>
              <span className="sr-only">Continue</span>
            </button>
          </div>
        </div>
      )}

      <header
        className={`border-b backdrop-blur transition-colors ${
          isUltimate ? 'border-[#e0d1bd] bg-[#fdf8f0]/90' : 'border-sand-darker/60 bg-white/80'
        }`}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 py-4">
            <div className="flex flex-1 items-center gap-3">
              <NavLink
                to="/"
                end
                className={`flex-shrink-0 text-lg font-semibold tracking-tight transition-colors ${
                  isUltimate ? 'text-[#3f2a1e]' : 'text-navy'
                }`}
              >
                Wallet
                <span className={isUltimate ? 'text-[#5c7751]' : 'text-primary-light'}>Habit</span>
              </NavLink>
              {isLoggedIn && (
                <nav
                  className={`hidden flex-1 flex-wrap items-center gap-1 text-sm font-medium transition-colors sm:flex ${
                    isUltimate ? 'text-[#5b4a39]' : 'text-navy/80'
                  }`}
                >
                  {navItems.map((item) => {
                    if (item.type === 'internal') {
                      const { to, label, end, accent, icon, ariaLabel } = item
                      return (
                        <NavLink
                          key={to}
                          to={to}
                          end={end}
                          aria-label={ariaLabel ?? (icon ? label : undefined)}
                          className={({ isActive }) =>
                            [
                              'rounded-full px-3 py-2 transition-colors border border-transparent',
                              icon ? 'flex items-center justify-center' : '',
                              accent && !isLoggedIn
                                ? isActive
                                  ? accentActiveClass
                                  : accentIdleClass
                                : isActive && !(to === '/' && !isLoggedIn)
                                ? navActiveClass
                                : navHoverClass,
                            ].join(' ')
                          }
                        >
                          {icon ? (
                            <>
                              <span className="sr-only">{label}</span>
                              {icon}
                            </>
                          ) : (
                            label
                          )}
                        </NavLink>
                      )
                    }

                    const { href, label } = item
                    return (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={`rounded-full px-3 py-2 transition-colors border border-transparent ${navHoverClass} ${focusRingClass}`}
                      >
                        {label}
                      </a>
                    )
                    })}
                  <div
                    className="relative"
                    onMouseEnter={() => setModulesOpen(true)}
                    onMouseLeave={() => setModulesOpen(false)}
                  >
                    <button
                      ref={modulesButtonRef}
                      type="button"
                      id="modules-menu-button"
                      aria-haspopup="true"
                      aria-expanded={isModulesOpen}
                      onClick={() => setModulesOpen((open) => !open)}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setModulesOpen(true)
                        }
                      }}
                      className={[
                        'flex items-center gap-2 rounded-full px-3 py-2 text-left transition-colors border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                        isModulesOpen ? navActiveClass : navHoverClass,
                        focusRingClass,
                      ].join(' ')}
                    >
                      Modules
                      <span
                        aria-hidden="true"
                        className={`text-[0.65rem] font-semibold transition-transform ${
                          isModulesOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    <div
                      ref={modulesPanelRef}
                      role="menu"
                      aria-labelledby="modules-menu-button"
                      className={[
                        'absolute left-0 top-full z-30 mt-3 w-[min(28rem,calc(100vw-3rem))] rounded-3xl border p-6 transition-all duration-150 ease-out',
                        isModulesOpen
                          ? 'pointer-events-auto translate-y-0 opacity-100'
                          : 'pointer-events-none -translate-y-1 opacity-0',
                        isUltimate
                          ? 'border-[#e0d1bd] bg-[#fef9f3] text-[#3f2a1e] shadow-[0_24px_60px_rgba(63,42,30,0.18)]'
                          : 'border-sand-darker/50 bg-white text-navy shadow-[0_22px_60px_rgba(31,42,68,0.18)]',
                      ].join(' ')}
                    >
                      <div className="space-y-5">
                        <section>
                          <p
                            className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                              isUltimate ? 'text-[#7a6048]' : 'text-navy/60'
                            }`}
                          >
                            My modules
                          </p>
                          <ul className="mt-3 space-y-2">
                            {moduleGroups.myModules.map((module) => (
                              <li key={module.key}>
                                <div
                                  className={[
                                    'rounded-2xl px-4 py-3 transition-colors',
                                    isUltimate
                                      ? 'bg-[#efe2cc] text-[#3f2a1e] shadow-sm'
                                      : 'bg-primary/10 text-navy shadow-sm',
                                  ].join(' ')}
                                >
                                  <div className="flex flex-col gap-1 sm:grid sm:grid-cols-[160px_1fr] sm:items-start sm:gap-3">
                                    <span className="text-sm font-semibold">{module.label}</span>
                                    <p
                                      className={`text-sm leading-relaxed ${
                                        isUltimate ? 'text-[#5b4a39]' : 'text-navy/70'
                                      }`}
                                    >
                                      {module.description}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </section>
                        <div
                          className={`h-px w-full ${
                            isUltimate ? 'bg-[#e6d9c4]' : 'bg-sand-darker/40'
                          }`}
                        />
                        <section>
                          <p
                            className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                              isUltimate ? 'text-[#7a6048]' : 'text-navy/60'
                            }`}
                          >
                            All modules
                          </p>
                          <ul className="mt-3 space-y-2">
                            {moduleGroups.allModules.map((module) => (
                              <li key={module.key}>
                                <div
                                  className={[
                                    'rounded-2xl px-4 py-3 transition-colors',
                                    isUltimate
                                      ? 'hover:bg-[#f3e7d4]'
                                      : 'hover:bg-primary/5',
                                  ].join(' ')}
                                >
                                  <div className="flex flex-col gap-1 sm:grid sm:grid-cols-[160px_1fr] sm:items-start sm:gap-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold">{module.label}</span>
                                      {module.premium && (
                                        <span
                                          className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
                                            isUltimate
                                              ? 'bg-[#efe2cc] text-[#6b4e36]'
                                              : 'bg-primary/10 text-primary-dark'
                                          }`}
                                        >
                                          Premium
                                        </span>
                                      )}
                                    </div>
                                    <p
                                      className={`text-sm leading-relaxed ${
                                        isUltimate ? 'text-[#5b4a39]' : 'text-navy/70'
                                      }`}
                                    >
                                      {module.description}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </section>
                      </div>
                    </div>
                  </div>
                </nav>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn && (
                <button
                  type="button"
                  aria-controls={mobileMenuId}
                  aria-expanded={isMobileMenuOpen}
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className={[
                    'flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:hidden',
                    isMobileMenuOpen ? navActiveClass : navHoverClass,
                    focusRingClass,
                  ].join(' ')}
                >
                  <span>{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
                  <span aria-hidden="true" className="text-lg leading-none">
                    {isMobileMenuOpen ? '✕' : '☰'}
                  </span>
                </button>
              )}
              <div className="min-w-0 flex-1 sm:flex-none">
                <DemoUserBadge />
              </div>
            </div>
          </div>
          {isLoggedIn && (
            <div
              id={mobileMenuId}
              aria-hidden={!isMobileMenuOpen}
              className={[
                'sm:hidden overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out',
                isMobileMenuOpen
                  ? 'max-h-[80vh] opacity-100'
                  : 'pointer-events-none max-h-0 opacity-0',
              ].join(' ')}
            >
              <div
                className={[
                  'mt-2 rounded-3xl border px-4 py-4 shadow-sm',
                  isUltimate
                    ? 'border-[#e0d1bd] bg-[#fef9f3] text-[#5b4a39]'
                    : 'border-sand-darker/60 bg-white text-navy/80',
                ].join(' ')}
              >
                <nav className="flex flex-col gap-2 text-base font-medium">
                  {navItems.map((item) => {
                    if (item.type === 'internal') {
                      const { to, label, end, accent } = item
                      return (
                        <NavLink
                          key={`mobile-${to}`}
                          to={to}
                          end={end}
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setMobileModulesOpen(false)
                          }}
                          className={({ isActive }) =>
                            [
                              'block rounded-full px-4 py-2 text-base transition-colors border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                              accent && !isLoggedIn
                                ? isActive
                                  ? accentActiveClass
                                  : accentIdleClass
                                : isActive && !(to === '/' && !isLoggedIn)
                                ? navActiveClass
                                : navHoverClass,
                              focusRingClass,
                            ].join(' ')
                          }
                        >
                          {label}
                        </NavLink>
                      )
                    }

                    const { href, label } = item
                    return (
                      <a
                        key={`mobile-${href}`}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setMobileModulesOpen(false)
                        }}
                        className={`block rounded-full px-4 py-2 text-base transition-colors border border-transparent ${navHoverClass} ${focusRingClass}`}
                      >
                        {label}
                      </a>
                    )
                  })}
                  {isLoggedIn && (
                    <div>
                      <button
                        type="button"
                        aria-expanded={isMobileModulesOpen}
                        onClick={() => setMobileModulesOpen((open) => !open)}
                        className={[
                          'flex w-full items-center justify-between gap-2 rounded-2xl border border-transparent px-4 py-3 text-left text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                          isMobileModulesOpen ? navActiveClass : navHoverClass,
                          focusRingClass,
                        ].join(' ')}
                      >
                        <span>Modules</span>
                        <span
                          aria-hidden="true"
                          className={`text-xs font-semibold transition-transform ${
                            isMobileModulesOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                      <div
                        className={[
                          'overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out',
                          isMobileModulesOpen
                            ? 'mt-3 max-h-[60vh] opacity-100'
                            : 'max-h-0 opacity-0 pointer-events-none',
                        ].join(' ')}
                      >
                        <div className="space-y-5 pb-1">
                          <section>
                            <p
                              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                                isUltimate ? 'text-[#7a6048]' : 'text-navy/60'
                              }`}
                            >
                              My modules
                            </p>
                            <ul className="mt-3 space-y-2">
                              {moduleGroups.myModules.map((module) => (
                                <li key={`mobile-my-${module.key}`}>
                                  <div
                                    className={[
                                      'rounded-2xl px-4 py-3 transition-colors',
                                      isUltimate
                                        ? 'bg-[#efe2cc] text-[#3f2a1e] shadow-sm'
                                        : 'bg-primary/10 text-navy shadow-sm',
                                    ].join(' ')}
                                  >
                                    <div className="flex flex-col gap-1">
                                      <span className="text-sm font-semibold">{module.label}</span>
                                      <p
                                        className={`text-sm leading-relaxed ${
                                          isUltimate ? 'text-[#5b4a39]' : 'text-navy/70'
                                        }`}
                                      >
                                        {module.description}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </section>
                          <div
                            className={`h-px w-full ${
                              isUltimate ? 'bg-[#e6d9c4]' : 'bg-sand-darker/40'
                            }`}
                          />
                          <section>
                            <p
                              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                                isUltimate ? 'text-[#7a6048]' : 'text-navy/60'
                              }`}
                            >
                              All modules
                            </p>
                            <ul className="mt-3 space-y-2">
                              {moduleGroups.allModules.map((module) => (
                                <li key={`mobile-all-${module.key}`}>
                                  <div
                                    className={[
                                      'rounded-2xl px-4 py-3 transition-colors',
                                      isUltimate
                                        ? 'hover:bg-[#f3e7d4]'
                                        : 'hover:bg-primary/5',
                                    ].join(' ')}
                                  >
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">{module.label}</span>
                                        {module.premium && (
                                          <span
                                            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
                                              isUltimate
                                                ? 'bg-[#efe2cc] text-[#6b4e36]'
                                                : 'bg-primary/10 text-primary-dark'
                                            }`}
                                          >
                                            Premium
                                          </span>
                                        )}
                                      </div>
                                      <p
                                        className={`text-sm leading-relaxed ${
                                          isUltimate ? 'text-[#5b4a39]' : 'text-navy/70'
                                        }`}
                                      >
                                        {module.description}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </section>
                        </div>
                      </div>
                    </div>
                  )}
                </nav>
            </div>
          </div>
          )}
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl flex-1 flex-col px-6 py-12">
        <PwaPromptHub />
        <Outlet />
      </main>

      <footer
        className={`border-t transition-colors ${
          isUltimate ? 'border-[#e0d1bd] bg-[#fdf8f0]/95' : 'border-sand-darker/60 bg-white/80'
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm transition-colors sm:flex-row sm:items-center sm:justify-between ${
            isUltimate ? 'text-[#5b4a39]' : 'text-navy/70'
          }`}
        >
          <p>© {new Date().getFullYear()} WalletHabit.com. All rights reserved.</p>
          <a
            className={`transition-colors ${
              isUltimate ? 'hover:text-[#4f6745]' : 'hover:text-primary-dark'
            }`}
            href="mailto:hello@wallethabit.com"
          >
            hello@wallethabit.com
          </a>
        </div>
      </footer>

      <FloatingActionButton />
    </div>
  )
}
