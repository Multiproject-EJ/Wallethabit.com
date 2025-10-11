import { SubscriptionTrackerApp } from './SubscriptionTrackerApp'

type SubscriptionWorkspaceSectionProps = {
  title: string
  description: string
  footnote?: string
  id?: string
}

const highlights = [
  'Daily reminder triggers with enable, disable, and test actions directly from the sheet menu.',
  'Timezone-aware upcoming renewals with configurable lead times and dashboard groupings.',
  'Local caching in the sidebar UI for quick reloads plus demo data seeding helpers.',
  'Theme, currency, and category preferences saved within the sheet Settings tab.',
]

export function SubscriptionWorkspaceSection({ title, description, footnote, id }: SubscriptionWorkspaceSectionProps) {
  return (
    <section id={id} className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary/80">
          Subscription tracker
        </span>
        <h2 className="text-2xl font-semibold text-navy">{title}</h2>
        <p className="max-w-3xl text-sm text-navy/70">{description}</p>
        <ul className="grid gap-2 text-sm text-navy/70 sm:grid-cols-2">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 text-primary">▹</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {footnote ? <p className="text-xs text-navy/60">{footnote}</p> : null}
      </header>

      <div className="rounded-[28px] border border-slate-200 bg-white/95 shadow-lg">
        <SubscriptionTrackerApp />
      </div>
    </section>
  )
}
