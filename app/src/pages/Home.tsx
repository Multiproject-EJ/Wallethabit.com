import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-20 py-6">
      <section className="rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-sm">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              Start free today
            </span>
            <h2 className="text-3xl font-semibold text-navy">Create your freemium WalletHabit account</h2>
            <p className="text-sm text-navy/70">
              Unlock the update hub, log unlimited wins, and preview premium modules. Freemium members can invite a partner and keep
              everything synced at no cost.
            </p>
            <ul className="grid gap-3 text-sm text-navy/80 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                </svg>
                Update hub + dashboard
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                </svg>
                Weekly ritual reminders
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                </svg>
                Partner collaboration seats
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                </svg>
                Upgrade when ready
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-inner">
            <label className="text-sm font-semibold text-navy/80" htmlFor="freemium-email">
              Email address
            </label>
            <input
              id="freemium-email"
              type="email"
              required
              placeholder="you@example.com"
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-navy/80 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <label className="text-sm font-semibold text-navy/80" htmlFor="freemium-purpose">
              What do you want to build momentum around?
            </label>
            <textarea
              id="freemium-purpose"
              rows={3}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-navy/80 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="Share the habit, project, or goal you want to protect."
            />
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-navy/60">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/40" />
                Send me early access invites
              </label>
              <Link to="/privacy" className="font-semibold text-brand hover:text-brand-dark">
                Privacy notice
              </Link>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark"
            >
              Activate freemium access
            </button>
            <p className="text-xs text-navy/60">
              Already have an account?{' '}
              <Link to="/auth" className="font-semibold text-primary hover:text-primary-dark">
                Log in here
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
