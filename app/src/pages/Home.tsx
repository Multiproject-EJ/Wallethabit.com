import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const cards = [
  {
    key: 'start-update',
    title: 'Get started or log updates',
    description:
      'Launch the guided setup when you are brand new or jump straight into the update hub to keep weekly rituals humming.',
    accent: 'from-primary/10 to-primary/5 shadow-primary/30',
    badge: 'Start or update',
    actions: [
      { label: 'Start setup', to: '/start', helper: 'Finish onboarding in focused steps.' },
      { label: 'Open update hub', to: '/update', helper: 'Log wins, receipts, and weekly tweaks.' },
    ],
  },
  {
    key: 'dashboard',
    title: 'Dashboard',
    description: 'Track habit scores, streaks, and the money picture that keeps your goals within reach.',
    to: '/dashboard',
    accent: 'from-emerald-100/60 to-emerald-50/40 shadow-emerald-200/60',
    badge: 'Open',
    cta: 'Jump in',
  },
  {
    key: 'modules',
    title: 'Modules library',
    description: 'Browse the guided workspaces for every money habit—from savings and debt to taxes and retirement planning.',
    accent: 'from-sky-100/60 to-sky-50/40 shadow-sky-200/60',
    badge: 'Workspace apps',
    cta: 'Browse modules',
  },
] as const

const moduleShortcuts = [
  { key: 'budget', title: 'Budget', description: 'Plan envelopes and cash flow.', icon: '📊', to: '/budget' },
  { key: 'debt', title: 'Debt', description: 'Track balances and payoff plans.', icon: '🧮', to: '/debt' },
  { key: 'goals', title: 'Goals', description: 'Set milestones for big dreams.', icon: '🎯', to: '/goals' },
  { key: 'income', title: 'Income', description: 'Map income streams with clarity.', icon: '💼', to: '/income' },
  { key: 'investing', title: 'Investing', description: 'Review allocations and performance.', icon: '📈', to: '/investing' },
  { key: 'retirement', title: 'Retirement', description: 'Stress test long-term plans.', icon: '🛫', to: '/retirement' },
  { key: 'taxes', title: 'Taxes', description: 'Prep documents and tax to-dos.', icon: '🧾', to: '/taxes' },
  { key: 'protection', title: 'Protection', description: 'Evaluate coverage and risk gaps.', icon: '🛡️', to: '/protection' },
  { key: 'estate', title: 'Estate', description: 'Keep estate wishes organized.', icon: '📜', to: '/estate' },
  { key: 'security', title: 'Security', description: 'Audit digital and identity safety.', icon: '🔐', to: '/security' },
  { key: 'integrations', title: 'Integrations', description: 'Connect the tools you already use.', icon: '🔗', to: '/integrations' },
  { key: 'assistant', title: 'AI Assistant', description: 'Chat through next best actions.', icon: '🤖', to: '/assistant' },
] as const

const communityHighlights = [
  {
    key: 'community',
    title: 'Community feedback hub',
    description:
      'Vote on new features, follow along as ideas climb the roadmap, and spotlight the improvements that keep you engaged.',
    to: '/community',
    badge: 'Feature voting',
  },
  {
    key: 'habits',
    title: 'Habits library with community stars',
    description:
      'Browse recommended rituals, see which ones earn the most stars, and add your vote to surface what really sticks.',
    to: '/habits',
    badge: 'Community stars',
  },
] as const

export default function Home() {
  const [isModulesOpen, setIsModulesOpen] = useState(false)

  useEffect(() => {
    if (!isModulesOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModulesOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModulesOpen])

  return (
    <div className="flex flex-1 flex-col gap-12 py-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">WalletHabit guides</p>
        <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">Pick where you want to dive in.</h1>
        <p className="max-w-2xl text-base text-navy/70">
          Each workspace is focused on momentum. Start in setup, revisit the dashboard for clarity, and lean on the update hub
          whenever you need a gentle nudge. Then swing by the community spaces to vote on the next big feature or add your
          stars to the habit rituals that keep everyone consistent.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const sharedContent = (
            <>
              <div
                className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${card.accent}`}
              />
              <div className="relative flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary/80">{card.title}</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy/60 transition group-hover:border-primary/40 group-hover:text-primary/80">
                    {card.badge ?? 'Open'}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-navy">{card.title}</h2>
                <p className="text-sm text-navy/70">{card.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-primary-dark">
                  {card.cta ?? 'Jump in'}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </div>
            </>
          )

          if (card.key === 'start-update' && 'actions' in card) {
            return (
              <div
                key={card.key}
                className={[
                  'group relative flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white/90 p-8 text-left transition-all duration-200',
                  'focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-primary/70',
                  'hover:-translate-y-1',
                ].join(' ')}
              >
                <div
                  className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${card.accent}`}
                />
                <div className="relative flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary/80">{card.title}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy/60 transition group-hover:border-primary/40 group-hover:text-primary/80">
                      {card.badge ?? 'Open'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-navy">{card.title}</h2>
                  <p className="text-sm text-navy/70">{card.description}</p>
                </div>

                <div className="relative mt-2 grid gap-3 sm:grid-cols-2">
                  {card.actions.map((action) => (
                    <Link
                      key={action.to}
                      to={action.to}
                      className="group/action flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white/90 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/70"
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover/action:text-primary-dark">
                        {action.label}
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                      {action.helper ? <p className="text-xs text-navy/60">{action.helper}</p> : null}
                    </Link>
                  ))}
                </div>
              </div>
            )
          }

          if (card.key === 'modules') {
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setIsModulesOpen(true)}
                className={[
                  'group relative flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-8 text-left transition-all duration-200',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary/70',
                  'hover:-translate-y-1',
                ].join(' ')}
              >
                {sharedContent}
              </button>
            )
          }

          return (
            <Link
              key={card.key}
              to={card.to}
              className={[
                'group relative flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-8 text-left transition-all duration-200',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary/70',
                'hover:-translate-y-1',
              ].join(' ')}
            >
              {sharedContent}
            </Link>
          )
        })}
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm sm:grid-cols-2">
        {communityHighlights.map((highlight) => (
          <Link
            key={highlight.key}
            to={highlight.to}
            className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 transition hover:-translate-y-1 hover:border-primary/40"
          >
            <span className="inline-flex w-max items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z" />
              </svg>
              {highlight.badge}
            </span>
            <h2 className="text-xl font-semibold text-navy transition group-hover:text-primary-dark">{highlight.title}</h2>
            <p className="text-sm text-navy/70">{highlight.description}</p>
            <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-primary-dark">
              Explore now
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        ))}
      </section>

      {isModulesOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4 py-10 backdrop-blur-sm"
          onClick={() => setIsModulesOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modules-library-heading"
            className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModulesOpen(false)}
              className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy/60 transition hover:text-primary"
              aria-label="Close modules library"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-2 pb-6 pr-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary/80">
                Modules library
              </span>
              <h2 id="modules-library-heading" className="text-3xl font-semibold text-navy">
                Jump straight into the workflow you need
              </h2>
              <p className="max-w-2xl text-sm text-navy/70">
                Pick any module to open a focused space—just like launching an app. Each workspace keeps the rituals, checklists,
                and metrics for that part of your money system right where you need them.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moduleShortcuts.map((module) => (
                <Link
                  key={module.key}
                  to={module.to}
                  onClick={() => setIsModulesOpen(false)}
                  className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">{module.icon}</span>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-navy transition group-hover:text-primary-dark">{module.title}</h3>
                    <p className="text-sm text-navy/70">{module.description}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-primary-dark">
                    Open module
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
