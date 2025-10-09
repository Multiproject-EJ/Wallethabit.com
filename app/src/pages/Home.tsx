import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Foundations set',
    description:
      'Routing, layout, and theming ready so future features snap into place.',
  },
  {
    title: 'Bank sync blueprint',
    description:
      'Plaid-powered integration lab lays out partners, guardrails, and rollout milestones.',
  },
  {
    title: 'Debt payoff lab',
    description:
      'Snowball vs. avalanche simulations show how extra boosts shrink timelines and interest.',
  },
  {
    title: 'Income boost lab',
    description:
      'Focus-hour sliders and growth playbooks model how new experiments expand your earnings mix.',
  },
  {
    title: 'Investment autopilot lab',
    description:
      'Risk posture slider, allocation targets, and 10-year projections prep long-term wealth moves.',
  },
  {
    title: 'Retirement readiness lab',
    description:
      'Lifestyle archetypes, glide path projections, and safe-withdrawal coverage cues show work-optional timelines.',
  },
  {
    title: 'Protection safety net lab',
    description:
      'Persona-driven sliders map emergency runways, insurance coverage gaps, and advisor-ready guardrails.',
  },
  {
    title: 'Supabase-ready',
    description:
      'Browser client scaffolded; drop in VITE_SUPABASE_URL + anon key to light up auth.',
  },
  {
    title: 'Personalised settings',
    description:
      'Plan selection, locale preferences, and notifications staged ahead of real profiles.',
  },
  {
    title: 'Copilot assistant',
    description:
      'AI helper lab seeded with prompt scripts for budgeting, savings, and weekly check-ins.',
  },
]

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-16 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-14 shadow-sm sm:px-12">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            Codex-built & cloud-native
          </span>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Money habits that stick — guided by clarity and calm momentum.
          </h1>
          <p className="text-lg text-slate-600">
            WalletHabit orchestrates budgets, goals, and insights so you stay focused on the
            progress that matters. The foundation is now live — next up: auth, data, and payments.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              Preview dashboard
            </Link>
            <Link
              to="/pricing"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand/60 hover:text-brand"
            >
              View pricing plan
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-dashed border-brand/50 bg-brand/5 p-10 text-center">
        <h2 className="text-2xl font-semibold text-brand">Next milestones</h2>
        <p className="mt-3 text-sm text-slate-600">
          Supabase auth bootstrapping, Plaid Link sandbox wiring, Stripe checkout placeholders, protection lab persistence,
          retirement glide path storage, and Copilot insights tied to real transactions are queued up next. Track progress in
          the project TODO.
        </p>
      </section>
    </div>
  )
}
