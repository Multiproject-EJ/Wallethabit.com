import IntegrationStatus from '../components/IntegrationStatus'
import { hasStripeConfig, stripeEnvGuidance } from '../lib/stripeClient'

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Foundational budgeting tools to build daily momentum.',
    perks: ['Envelope planning basics', 'Savings goal templates', 'Weekly recap emails (upcoming)'],
  },
  {
    name: 'Pro',
    price: '$12/mo',
    description: 'Deep insights, shared budgets, and automations for serious planners.',
    perks: ['Bank sync & rules engine (planned)', 'AI assistant summaries', 'Priority support'],
    highlighted: true,
  },
  {
    name: 'Lifetime',
    price: '$249 one-time',
    description: 'Own the full WalletHabit suite with future updates included.',
    perks: ['All Pro features', 'Lifetime updates', 'VIP roadmap input'],
  },
]

export default function Pricing() {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold">Pricing built on honest upgrades.</h1>
        <p className="mt-3 text-sm text-slate-600">
          Stripe integration will power secure checkout flows soon. For now, explore the tiering and
          upcoming perks so we can validate the packaging.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={`flex flex-col gap-4 rounded-3xl border p-6 shadow-sm transition ${
              tier.highlighted
                ? 'border-brand bg-white'
                : 'border-slate-200 bg-white/80 hover:border-brand/40'
            }`}
          >
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-500">{tier.name}</p>
              <p className="text-3xl font-semibold text-slate-900">{tier.price}</p>
              <p className="text-sm text-slate-600">{tier.description}</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`mt-auto rounded-full px-5 py-2 text-sm font-semibold transition ${
                tier.highlighted
                  ? 'bg-brand text-white hover:bg-brand-dark'
                  : 'border border-slate-300 text-slate-700 hover:border-brand/60 hover:text-brand'
              }`}
              disabled
            >
              Checkout coming soon
            </button>
          </article>
        ))}
      </section>

      <IntegrationStatus
        label="Stripe Checkout"
        ready={hasStripeConfig}
        description={
          hasStripeConfig
            ? 'Publishable key detected. We can wire Checkout + Customer Portal once products are live.'
            : 'Waiting on Stripe publishable key. Once in place we can light up Checkout sessions.'
        }
        guidance={stripeEnvGuidance}
      />
    </div>
  )
}
