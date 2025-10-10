import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const cards = [
  {
    key: 'setup',
    title: 'Setup',
    description: 'Dial in your rhythm, add accounts, and finish the starter checklist to unlock the full experience.',
    to: '/start',
    accent: 'from-primary/10 to-primary/5 shadow-primary/30',
  },
  {
    key: 'dashboard',
    title: 'Dashboard',
    description: 'Track habit scores, streaks, and the money picture that keeps your goals within reach.',
    to: '/dashboard',
    accent: 'from-emerald-100/60 to-emerald-50/40 shadow-emerald-200/60',
  },
  {
    key: 'update',
    title: 'Update hub',
    description: 'Log wins, tweak envelopes, and review nudges that keep your momentum growing week to week.',
    to: '/update',
    accent: 'from-amber-100/60 to-amber-50/40 shadow-amber-200/60',
  },
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
  const [isSetupComplete, setIsSetupComplete] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('setupComplete') === 'true'
  })

  useEffect(() => {
    const handleStorage = () => {
      setIsSetupComplete(localStorage.getItem('setupComplete') === 'true')
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

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
          const isSetupCard = card.key === 'setup'
          const completed = isSetupCard && isSetupComplete

          return (
            <Link
              key={card.key}
              to={card.to}
              className={[
                'group relative flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-8 transition-all duration-200',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary/70',
                completed ? 'opacity-70' : 'hover:-translate-y-1',
              ].join(' ')}
            >
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${card.accent}`}
              />
              <div className="relative flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary/80">{card.title}</span>
                  {completed ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy/60 transition group-hover:border-primary/40 group-hover:text-primary/80">
                      Open
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-navy">{card.title}</h2>
                <p className="text-sm text-navy/70">{card.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-primary-dark">
                  {completed ? 'Review space' : 'Jump in'}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </div>
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
    </div>
  )
}
