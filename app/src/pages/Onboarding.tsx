import { useState } from 'react'
import { Link } from 'react-router-dom'

const steps = [
  {
    id: 'Step 1',
    title: 'Set your rhythm',
    description:
      'Pick your budgeting cadence, income style, and the habits you want WalletHabit to reinforce. Each choice updates the live preview on the right.',
    highlights: ['Weekly or monthly flow', 'Select two focus habits', 'Preview reminders instantly'],
  },
  {
    id: 'Step 2',
    title: 'Add your money picture',
    description:
      'Link or manually add accounts, list any debts, and log the goals you are chasing. Autosave keeps everything safe while you explore.',
    highlights: ['Checking, credit, savings', 'Debt payoff priorities', 'Goal tiles ready for launch'],
  },
  {
    id: 'Step 3',
    title: 'Lock in helpful nudges',
    description:
      'Choose when WalletHabit taps you on the shoulder, invite a partner if you have one, and confirm how you want wins to be celebrated.',
    highlights: ['Calendar + push reminders', 'Optional partner invite', 'Celebrations tailored to you'],
  },
]

const quickWins = [
  {
    label: '5 min',
    title: 'Capture essentials',
    description: 'Income, rent, and one goal. Enough data to unlock your Dashboard preview.',
  },
  {
    label: '10 min',
    title: 'Add accounts + debts',
    description: 'Connect or log balances to see the Update hub personalise action cards.',
  },
  {
    label: 'Later',
    title: 'Refine automations',
    description: 'Turn on calendar nudges, partner access, and premium auto-sync when ready.',
  },
]

const assurances = [
  'All forms autosave, so you never lose progress while exploring.',
  'You can revisit any step from the dashboard checklist once setup is complete.',
  'Upgrade prompts stay contextual — no upsell wall before you see value.',
]

export default function Onboarding() {
  const [setupComplete, setSetupComplete] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('setupComplete') === 'true'
  })

  const markSetupComplete = () => {
    localStorage.setItem('setupComplete', 'true')
    setSetupComplete(true)
  }

  const resetSetupState = () => {
    localStorage.removeItem('setupComplete')
    setSetupComplete(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-16 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-12 shadow-sm sm:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Start guide
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              A calm three-step setup that launches your money habits.
            </h1>
            <p className="text-lg text-navy/70">
              WalletHabit keeps the first run simple: dial in your rhythm, add the accounts that matter, and confirm the nudges
              that keep you showing up. No sprawling menu — just clear progress.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
              >
                Preview dashboard
              </Link>
              <Link
                to="/update"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-navy transition hover:border-primary/60 hover:text-primary"
              >
                Explore Update hub
              </Link>
              {setupComplete ? (
                <button
                  type="button"
                  onClick={resetSetupState}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/60 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-100/80"
                >
                  Reset setup state
                </button>
              ) : (
                <button
                  type="button"
                  onClick={markSetupComplete}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-3 text-sm font-semibold text-primary transition hover:border-primary/60 hover:bg-primary/10"
                >
                  Mark setup complete
                </button>
              )}
            </div>
            {setupComplete && (
              <p className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 px-4 py-2 text-sm font-semibold text-emerald-700">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                Setup finished — revisit anytime to adjust the flow.
              </p>
            )}
          </div>
          <div className="grid w-full max-w-md gap-4 rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-6 text-sm text-navy/80">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Setup checklist</h2>
            <p className="text-base text-navy/70">
              Complete each card once and WalletHabit keeps them in sync afterward.
            </p>
            <ul className="space-y-3 text-sm">
              {quickWins.map((item) => (
                <li key={item.title} className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-primary/80">
                    <span>{item.label}</span>
                    <span className="text-navy/60">Momentum</span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-navy">{item.title}</p>
                  <p className="mt-1 text-sm text-navy/70">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {steps.map((step) => (
          <article key={step.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary/80">{step.id}</span>
            <h3 className="text-xl font-semibold text-navy">{step.title}</h3>
            <p className="text-sm text-navy/70">{step.description}</p>
            <ul className="mt-2 space-y-2 text-sm text-navy/80">
              {step.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-navy">What to expect after setup</h2>
          <p className="text-sm text-navy/70">
            As soon as you hit finish, the dashboard highlights your habit score and cash pulse while the Update hub unlocks
            tailored action cards. Weekly digests and gentle nudges keep you returning just enough to stay on track.
          </p>
          <ul className="space-y-3 text-sm text-navy/80">
            {assurances.map((assurance) => (
              <li key={assurance} className="flex items-start gap-2">
                <span className="mt-1 text-primary">✓</span>
                <span>{assurance}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-primary/30 bg-gradient-to-br from-white via-primary/5 to-primary/10 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary/80">First week momentum</h3>
          <div className="space-y-4 text-sm text-navy/80">
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-primary/60">Day 1</p>
              <p className="mt-1 text-base font-semibold text-navy">Dashboard unlocks habit score</p>
              <p className="mt-1 text-sm text-navy/70">See your savings rate, current streak, and top goal next action.</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-primary/60">Day 3</p>
              <p className="mt-1 text-base font-semibold text-navy">Update hub suggests boosts</p>
              <p className="mt-1 text-sm text-navy/70">Log new transactions, tweak envelopes, or celebrate a win in one tap.</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-primary/60">Day 7</p>
              <p className="mt-1 text-base font-semibold text-navy">Weekly email recap</p>
              <p className="mt-1 text-sm text-navy/70">Celebrate wins and preview next focus before Monday arrives.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
