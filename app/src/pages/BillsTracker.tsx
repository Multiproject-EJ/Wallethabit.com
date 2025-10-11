import { SubscriptionWorkspaceSection } from '../components/SubscriptionWorkspaceSection'

function BillsEmptyState() {
  return (
    <section className="space-y-4 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-8 text-sm text-navy/70">
      <div className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Bills tracker workspace
        </span>
        <h2 className="text-2xl font-semibold text-navy">Draft canvas awaiting payment flows</h2>
        <p className="max-w-3xl">
          This section will host the full bills cadence—think utilities, rent, council tax, and annual policies. Keep it handy
          for storyboard notes or embed the workflows once they are mapped.
        </p>
      </div>
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 text-slate-500 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="font-medium text-navy/70">Ideas to capture later</p>
          <ul className="list-disc pl-5 text-sm">
            <li>Monthly payment checklist and due date timeline.</li>
            <li>Comparison tracker for renewals and renegotiations.</li>
            <li>Zapier or Make hooks once automation flows are drafted.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <p className="font-semibold text-navy/70">Working tip</p>
          <p className="mt-2 text-slate-600">
            When the bills experience is ready, drop the content in above this card so the subscription embed stays just below as
            a quick reference.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function BillsTracker() {
  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-primary/5 to-primary/10 px-8 py-12 text-navy shadow-sm sm:px-12">
        <div className="pointer-events-none absolute -left-20 top-12 h-60 w-60 rounded-full bg-primary/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-primary-dark/15 blur-3xl" aria-hidden />
        <div className="relative space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-dark">
            🧾 Bills tracker module
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Stage the bills cockpit now—drop in the flows once the content lands
          </h1>
          <p className="max-w-3xl text-base text-navy/70">
            Use this module to keep planning momentum while the bills workspace is being produced. The subscription tracker lives
            just below so you can borrow UI patterns, reminders logic, or embed the same code until bespoke bills tooling is ready.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs uppercase tracking-wide text-primary/80">
              Bills canvas · Preview
            </span>
            <a
              href="#subscription-embed"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-primary transition hover:bg-primary hover:text-white"
            >
              Jump to embedded subscription tracker
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      <BillsEmptyState />

      <SubscriptionWorkspaceSection
        id="subscription-embed"
        title="Subscription tracker embedded for reference"
        description="Until the bills workspace ships, reuse the subscription tracker implementation below. Swap in bills-specific logic once the upstream requirements are ready."
        footnote="When the dedicated bills tooling is complete, replace this embed with the live bills experience and keep subscriptions as a separate module."
      />
    </div>
  )
}
