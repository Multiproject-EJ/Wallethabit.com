import subscriptionCode from '../content/subscription-tracker/code.gs?raw'
import subscriptionDialog from '../content/subscription-tracker/dialog.html?raw'

type SubscriptionWorkspaceSectionProps = {
  title: string
  description: string
  footnote?: string
  id?: string
}

type CodePanelProps = {
  label: string
  filename: string
  code: string
}

const highlights = [
  'Daily reminder triggers with enable, disable, and test actions directly from the sheet menu.',
  'Timezone-aware upcoming renewals with configurable lead times and dashboard groupings.',
  'Local caching in the sidebar UI for quick reloads plus demo data seeding helpers.',
  'Theme, currency, and category preferences saved within the sheet Settings tab.',
]

function CodePanel({ label, filename, code }: CodePanelProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary/70">{label}</span>
          <span className="font-mono text-sm text-navy/80">{filename}</span>
        </div>
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Read only
        </span>
      </div>
      <pre className="max-h-[32rem] overflow-auto rounded-xl bg-navy/90 p-4 text-xs leading-relaxed text-white">
        <code>{code}</code>
      </pre>
    </div>
  )
}

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

      <div className="grid gap-6 lg:grid-cols-2">
        <CodePanel label="Apps Script" filename="code.gs" code={subscriptionCode} />
        <CodePanel label="Tracker dialog" filename="dialog.html" code={subscriptionDialog} />
      </div>
    </section>
  )
}
