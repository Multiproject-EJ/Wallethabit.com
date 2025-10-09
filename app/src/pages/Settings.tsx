import { useMemo, useState } from 'react'

import IntegrationStatus from '../components/IntegrationStatus'
import { hasStripeConfig, stripeEnvGuidance } from '../lib/stripeClient'
import { hasSupabaseConfig, supabaseEnvGuidance } from '../lib/supabaseClient'
import { getPlaidEnvironmentLabel, hasPlaidConfig, plaidEnvGuidance } from '../lib/plaidClient'

const planTiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free forever',
    description: 'For individuals exploring mindful money routines.',
    features: ['Envelope planner', 'Savings goals HQ', 'Community roadmap access'],
    support: 'Email support in two business days',
  },
  {
    id: 'foundation',
    name: 'Foundation',
    price: '$9 / month',
    description: 'Adds automation and richer analytics for growing momentum.',
    features: [
      'Bank import syncing (coming soon)',
      'Automated envelope refills',
      'Monthly insights digest',
    ],
    support: 'Priority support with live office hours',
  },
  {
    id: 'pro',
    name: 'Pro Household',
    price: '$19 / month',
    description: 'Shared finances, deeper simulations, and concierge nudges.',
    features: ['Household sharing', 'Scenario lab with AI guidance', '1:1 onboarding session'],
    support: 'Concierge support with guided onboarding',
  },
]

const localeOptions = [
  {
    id: 'en-US',
    label: 'English — United States',
    currency: 'USD',
    timezone: 'America/New_York',
    startOfWeek: 'Sunday',
  },
  {
    id: 'en-GB',
    label: 'English — United Kingdom',
    currency: 'GBP',
    timezone: 'Europe/London',
    startOfWeek: 'Monday',
  },
  {
    id: 'nb-NO',
    label: 'Norsk — Norge',
    currency: 'NOK',
    timezone: 'Europe/Oslo',
    startOfWeek: 'Monday',
  },
]

const roundingModes = [
  {
    id: 'exact',
    label: 'Exact cents',
    description: 'Show transactions with full precision. Best for reconciliation.',
  },
  {
    id: 'nearest-dollar',
    label: 'Nearest whole amount',
    description: 'Round to the nearest whole currency unit for a calmer overview.',
  },
]

const notificationChannels = [
  {
    id: 'weekly-digest',
    label: 'Weekly progress digest',
    description: 'Highlights top wins and areas to fine-tune every Sunday.',
    defaultEnabled: true,
  },
  {
    id: 'cashflow-alerts',
    label: 'Cashflow alerts',
    description: 'Flag envelope overspending or upcoming bills before they happen.',
    defaultEnabled: true,
  },
  {
    id: 'goal-celebrations',
    label: 'Goal celebrations',
    description: 'Send a note (and maybe confetti) when a savings milestone lands.',
    defaultEnabled: true,
  },
  {
    id: 'product-updates',
    label: 'Product updates',
    description: 'Learn about major launches and roadmap shifts once a quarter.',
    defaultEnabled: false,
  },
]

export default function Settings() {
  const [selectedPlanId, setSelectedPlanId] = useState(planTiers[0].id)
  const [localeId, setLocaleId] = useState(localeOptions[0].id)
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(localeOptions[0].startOfWeek)
  const [roundingMode, setRoundingMode] = useState(roundingModes[0].id)
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {}
    notificationChannels.forEach((channel) => {
      defaults[channel.id] = channel.defaultEnabled
    })
    return defaults
  })

  const plaidEnvironmentLabel = getPlaidEnvironmentLabel()

  const activePlan = useMemo(
    () => planTiers.find((plan) => plan.id === selectedPlanId) ?? planTiers[0],
    [selectedPlanId],
  )

  const activeLocale = useMemo(
    () => localeOptions.find((option) => option.id === localeId) ?? localeOptions[0],
    [localeId],
  )

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <h1 className="text-3xl font-bold">Profile &amp; preferences</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Tailor WalletHabit to your household. Choose the plan that fits, set your locale, and tune
          the nudges that keep momentum steady. Real auth is coming soon — today we model the future
          experience.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Plan &amp; billing</h2>
          <p className="text-sm text-slate-600">
            Preview the tiers before Stripe checkout goes live. Switching now updates the UI so we
            can test flows while billing is wired up.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {planTiers.map((plan) => {
              const isActive = plan.id === activePlan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  aria-pressed={isActive}
                  className={[
                    'flex h-full flex-col gap-3 rounded-2xl border bg-white p-5 text-left shadow-sm transition',
                    isActive
                      ? 'border-brand bg-brand/5 ring-2 ring-brand/50'
                      : 'border-slate-200 hover:border-brand/60 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{plan.name}</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{plan.price}</p>
                  </div>
                  <p className="text-sm text-slate-600">{plan.description}</p>
                  <ul className="space-y-2 text-xs text-slate-500">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>
        </div>
        <aside className="flex h-full flex-col justify-between rounded-2xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <div>
            <h3 className="text-base font-semibold text-brand-dark">Current selection</h3>
            <p className="mt-2 text-xl font-semibold text-brand-dark">{activePlan.name}</p>
            <p className="mt-1 text-brand-dark/80">{activePlan.price}</p>
            <p className="mt-3 text-brand-dark/80">{activePlan.support}</p>
          </div>
          <div className="mt-6 space-y-2 text-xs text-brand-dark/80">
            <p className="font-semibold uppercase tracking-wide">Next up</p>
            <p>Stripe checkout integration will let you confirm this plan with one click.</p>
            <p>Need an invoice? Drop us a note at hello@wallethabit.com.</p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Regional preferences</h2>
          <p className="mt-2 text-sm text-slate-600">
            These settings will control currency formatting, auto-budget cadence, and how summaries
            are phrased.
          </p>
          <div className="mt-5 space-y-5 text-sm">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Locale</span>
              <select
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                value={localeId}
                onChange={(event) => {
                  const nextLocale = event.target.value
                  setLocaleId(nextLocale)
                  const fallback = localeOptions.find((option) => option.id === nextLocale)
                  if (fallback) {
                    setFirstDayOfWeek(fallback.startOfWeek)
                  }
                }}
              >
                {localeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Currency</span>
                <input
                  readOnly
                  value={activeLocale.currency}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Time zone</span>
                <input
                  readOnly
                  value={activeLocale.timezone}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                />
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Week starts on</span>
              <div className="flex gap-2">
                {['Sunday', 'Monday'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setFirstDayOfWeek(day)}
                    className={[
                      'flex-1 rounded-full border px-3 py-2 text-sm transition',
                      firstDayOfWeek === day
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-slate-200 text-slate-600 hover:border-brand/50 hover:text-brand',
                    ].join(' ')}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </label>
            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Spending display
              </legend>
              {roundingModes.map((mode) => (
                <label
                  key={mode.id}
                  className={[
                    'flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 text-left transition',
                    roundingMode === mode.id
                      ? 'border-brand bg-brand/5'
                      : 'border-slate-200 hover:border-brand/50 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <span className="text-sm font-semibold text-slate-900">
                    <input
                      type="radio"
                      name="rounding"
                      value={mode.id}
                      checked={roundingMode === mode.id}
                      onChange={() => setRoundingMode(mode.id)}
                      className="mr-2"
                    />
                    {mode.label}
                  </span>
                  <span className="text-xs text-slate-500">{mode.description}</span>
                </label>
              ))}
            </fieldset>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Notifications &amp; nudges</h2>
          <p className="mt-2 text-sm text-slate-600">
            Choose the check-ins that help you stay on track. You can adjust anytime from the mobile
            app, too.
          </p>
          <ul className="mt-5 space-y-3">
            {notificationChannels.map((channel) => (
              <li key={channel.id} className="rounded-2xl border border-slate-200 p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={notifications[channel.id]}
                    onChange={() => toggleNotification(channel.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{channel.label}</span>
                    <span className="mt-1 block text-xs text-slate-500">{channel.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Security &amp; connections</h2>
          <p className="mt-2 text-sm text-slate-600">
            WalletHabit will lean on Supabase auth for secure sessions. Until then, track the wiring
            progress and prep any account links you expect to use.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Multi-factor auth</h3>
              <p className="mt-1 text-xs text-slate-500">
                Launching with authenticator app support. We&apos;ll prompt you to opt-in on day one.
              </p>
              <button
                type="button"
                className="mt-3 w-full rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand/60 hover:text-brand"
              >
                Prepare device
              </button>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Linked accounts</h3>
              <p className="mt-1 text-xs text-slate-500">
                Bank aggregation arrives with the Foundation plan rollout. Start your checklist early.
              </p>
              <ul className="mt-3 space-y-1 text-xs text-slate-500">
                <li>• Checking &amp; savings</li>
                <li>• Credit cards</li>
                <li>• Investments</li>
              </ul>
            </div>
          </div>
        </div>
        <aside className="rounded-3xl border border-brand/40 bg-brand/10 p-6 text-sm text-brand-dark">
          <h3 className="text-base font-semibold text-brand-dark">Household profile tips</h3>
          <p className="mt-2">
            Add partner or roommate access from here once sharing unlocks. You&apos;ll be able to invite
            them securely with granular permissions per envelope.
          </p>
          <p className="mt-2">
            Prefer another language? Toggle locale above. We&apos;re prioritising Spanish and French next.
          </p>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <IntegrationStatus
          label="Supabase auth"
          ready={hasSupabaseConfig}
          description={
            hasSupabaseConfig
              ? 'Anon key detected. Settings will hydrate with your actual profile soon.'
              : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to preview live profile data.'
          }
          guidance={supabaseEnvGuidance}
        />
        <IntegrationStatus
          label="Stripe billing"
          ready={hasStripeConfig}
          description={
            hasStripeConfig
              ? 'Publishable key ready. Next step is to wire checkout to confirm plan upgrades.'
              : 'Set VITE_STRIPE_PUBLISHABLE_KEY so upgrade confirmations can go live.'
          }
          guidance={stripeEnvGuidance}
        />
        <IntegrationStatus
          label="Plaid bank sync"
          ready={hasPlaidConfig}
          description={
            hasPlaidConfig
              ? `${plaidEnvironmentLabel}. Hook up the Integrations lab to edge functions next.`
              : 'Add Plaid sandbox credentials so the bank sync lab can demo Link hand-offs.'
          }
          guidance={plaidEnvGuidance}
        />
      </section>

      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        <h2 className="text-base font-semibold">Danger zone</h2>
        <p className="mt-2">
          Account deletion will be available post-auth launch. We&apos;ll provide exports and a cool-off
          period to keep you in control of your data.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-300 px-4 py-2 text-sm font-semibold transition hover:border-red-400 hover:text-red-800"
        >
          Request account removal
        </button>
      </section>
    </div>
  )
}
