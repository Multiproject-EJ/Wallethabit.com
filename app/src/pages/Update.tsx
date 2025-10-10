import { Link } from 'react-router-dom'

const moduleGroups = [
  {
    title: 'Cash',
    description: 'Keep spending aligned with your rhythm.',
    modules: [
      { name: 'Log transaction', status: '2 new receipts', cta: 'Add now' },
      { name: 'Reconcile envelopes', status: '£78 to categorise', cta: 'Review envelopes' },
    ],
  },
  {
    title: 'Goals',
    description: 'Celebrate milestones and adjust commitments.',
    modules: [
      { name: 'Emergency fund', status: '75% funded · boost?', cta: 'Update transfer' },
      { name: 'Mallorca holiday', status: 'Plan on track', cta: 'Log win' },
    ],
  },
  {
    title: 'Debts & income',
    description: 'Shrink balances and grow inflows.',
    modules: [
      { name: 'Credit card payoff', status: '£120 extra clears 2 weeks sooner', cta: 'Adjust snowball' },
      { name: 'Side hustle', status: 'Invoice ready to send', cta: 'Mark paid' },
    ],
  },
]

const premiumUpsells = [
  {
    name: 'Auto-sync',
    detail: 'Connect banks and let WalletHabit reconcile daily.',
  },
  {
    name: 'AI copilot',
    detail: 'Personalised prompts and planning sessions in chat.',
  },
]

const quickFilters = ['All', 'Cash', 'Goals', 'Debts', 'Income', 'Insights']

export default function UpdateHub() {
  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm sm:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Update hub
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
              Every action card in one calm grid.
            </h1>
            <p className="text-lg text-navy/70">
              When you are ready to make a change, land here. Modules match your focus habits and stay lightweight so you can log
              updates without leaving flow.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                to="/dashboard"
                className="rounded-full bg-primary px-5 py-2.5 text-white shadow-sm transition hover:bg-primary-dark"
              >
                Back to dashboard
              </Link>
              <button
                type="button"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-navy transition hover:border-primary/60 hover:text-primary"
              >
                Command palette (⌘K)
              </button>
            </div>
          </div>
          <div className="grid w-full max-w-md gap-4 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-sm text-navy/80">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Quick filters</h2>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
                >
                  {filter}
                </button>
              ))}
            </div>
            <p className="text-xs text-navy/60">Use filters or the command palette to jump straight to what matters.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {moduleGroups.map((group) => (
          <article key={group.title} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-navy">{group.title}</h2>
              <p className="text-sm text-navy/70">{group.description}</p>
            </div>
            <ul className="space-y-3 text-sm text-navy/80">
              {group.modules.map((module) => (
                <li key={module.name} className="rounded-2xl border border-slate-100 bg-sand p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-navy/60">
                    <span>{module.name}</span>
                    <span>{module.status}</span>
                  </div>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
                  >
                    {module.cta}
                  </button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-dashed border-primary/40 bg-gradient-to-br from-white via-primary/5 to-primary/10 p-8 text-sm text-navy/80">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-navy">Premium boosts when you are ready</h2>
            <p className="text-sm text-navy/70">
              WalletHabit stays honest — upgrades appear only when they unlock clear value for your habits.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {premiumUpsells.map((offer) => (
              <div key={offer.name} className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
                <p className="text-sm font-semibold text-primary">{offer.name}</p>
                <p className="mt-1 text-xs text-navy/70">{offer.detail}</p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary transition hover:text-primary-dark"
                >
                  Learn more →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
