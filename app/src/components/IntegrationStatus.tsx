import type { ReactNode } from 'react'

type IntegrationStatusProps = {
  icon?: ReactNode
  label: string
  ready: boolean
  description: string
  guidance: string[]
}

export default function IntegrationStatus({ icon, label, ready, description, guidance }: IntegrationStatusProps) {
  return (
    <article className="rounded-3xl border border-sand-darker/60 bg-white/80 p-6 shadow-sm backdrop-blur">
      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon ?? <span className="text-lg">•</span>}
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-navy/60">{label}</p>
          <p className="text-base font-semibold text-navy">{ready ? 'Ready for secrets' : 'Waiting on secrets'}</p>
          <p className="text-sm text-navy/70">{description}</p>
        </div>
      </header>
      <ul className="mt-4 space-y-2 text-xs text-navy/60">
        {guidance.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-light" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
