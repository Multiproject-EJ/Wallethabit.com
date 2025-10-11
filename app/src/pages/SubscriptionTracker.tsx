import { SubscriptionWorkspaceSection } from '../components/SubscriptionWorkspaceSection'

function EmptyBillsPlaceholder() {
  return (
    <section className="space-y-4 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-8 text-sm text-navy/70">
      <div className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Bills tracker blueprint
        </span>
        <h2 className="text-2xl font-semibold text-navy">Bills workspace placeholder</h2>
        <p className="max-w-3xl">
          The dedicated bills flow will sit here once the payment cadence and automations are mapped. Drop notes, screenshots,
          or early requirements in your working doc so the section is ready to absorb them.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-slate-500">
        <p className="font-medium text-navy/70">Coming soon</p>
        <p className="mt-2 text-sm">
          Keep this tile handy for future checklists: recurring utilities, annual policies, and the messaging templates you want
          at hand when renegotiating. Once the flow is ready, swap this card for the live content.
        </p>
      </div>
    </section>
  )
}

export default function SubscriptionTracker() {
  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-white px-8 py-12 text-navy shadow-lg sm:px-12">
        <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-primary-dark/20 blur-3xl" aria-hidden />
        <div className="relative space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-dark">
            🧾 Subscription tracker module
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Drop the Apps Script + dialog to launch a polished subscriptions command center
          </h1>
          <p className="max-w-3xl text-base text-navy/70">
            Add the Google Apps Script server file and dialog markup below into your Sheet project to unlock reminders, demo data,
            and dashboard visualisations. Everything is scoped to the <em>Subscriptions</em> and <em>Settings</em> sheets, so you can
            keep iterating without breaking production data.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <a
              href="#subscription-workspace"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-white shadow-sm transition hover:bg-primary-dark"
            >
              Jump to implementation
              <span aria-hidden>→</span>
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs uppercase tracking-wide text-primary/80">
              Version 0.4.3 · Timezone aware
            </span>
          </div>
        </div>
      </section>

      <SubscriptionWorkspaceSection
        id="subscription-workspace"
        title="Subscription tracker workspace"
        description="Copy these files into Apps Script (code.gs) and an HTML file named dialog to run the full subscription tracker experience, complete with reminders, dashboards, and demo data seeds."
        footnote="Tip: in the Apps Script editor add a new script file named code.gs, then create an HTML file called dialog and paste the matching markup."
      />

      <EmptyBillsPlaceholder />
    </div>
  )
}
