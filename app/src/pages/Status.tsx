import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useStatusFeed } from '../lib/statusFeed'
import type { StatusHealth } from '../lib/statusDemoData'

const HEALTH_LABELS: Record<StatusHealth, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  outage: 'Outage',
  maintenance: 'Maintenance',
}

const HEALTH_CLASSES: Record<StatusHealth, string> = {
  operational: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  degraded: 'border-amber-200 bg-amber-50 text-amber-700',
  outage: 'border-coral/40 bg-coral/10 text-coral',
  maintenance: 'border-sky-200 bg-sky-50 text-sky-700',
}

const formatDateTime = (iso: string) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })

    return formatter.format(new Date(iso))
  } catch (error) {
    console.warn('Unable to format datetime', error)
    return iso
  }
}

const formatRelative = (iso: string) => {
  try {
    const target = new Date(iso)
    const diffMs = target.getTime() - Date.now()
    const diffMinutes = Math.round(diffMs / (1000 * 60))

    if (Math.abs(diffMinutes) < 60) {
      return diffMinutes >= 0 ? `in ${diffMinutes} min` : `${Math.abs(diffMinutes)} min ago`
    }

    const diffHours = Math.round(diffMinutes / 60)
    if (Math.abs(diffHours) < 24) {
      return diffHours >= 0 ? `in ${diffHours} hr` : `${Math.abs(diffHours)} hr ago`
    }

    const diffDays = Math.round(diffHours / 24)
    return diffDays >= 0 ? `in ${diffDays} days` : `${Math.abs(diffDays)} days ago`
  } catch (error) {
    console.warn('Unable to format relative time', error)
    return ''
  }
}

const computeOverallHealth = (healths: StatusHealth[]): StatusHealth => {
  if (healths.some((state) => state === 'outage')) {
    return 'outage'
  }
  if (healths.some((state) => state === 'degraded')) {
    return 'degraded'
  }
  if (healths.some((state) => state === 'maintenance')) {
    return 'maintenance'
  }
  return 'operational'
}

export default function Status() {
  const { snapshot, isLoading, error, refresh, isSupabaseLive } = useStatusFeed()

  const groupedServices = useMemo(() => {
    return snapshot.services.reduce(
      (groups, service) => {
        if (!groups[service.category]) {
          groups[service.category] = []
        }
        groups[service.category]?.push(service)
        return groups
      },
      {
        Platform: [],
        Data: [],
        Integrations: [],
      } as Record<'Platform' | 'Data' | 'Integrations', typeof snapshot.services>,
    )
  }, [snapshot.services])

  const overallHealth = useMemo(
    () => computeOverallHealth(snapshot.services.map((service) => service.health)),
    [snapshot.services],
  )

  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm sm:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${HEALTH_CLASSES[overallHealth]}`}>
                {HEALTH_LABELS[overallHealth]}
              </span>
              Platform status
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-navy sm:text-5xl">Status & changelog</h1>
            <p className="text-base text-navy/70">
              Follow live health across WalletHabit systems and see what shipped recently. Supabase-backed environments load the latest data automatically; without Supabase we surface rich demo data so the story stays cohesive.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  void refresh()
                }}
                className="rounded-full bg-primary px-5 py-2.5 text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing…' : 'Refresh status'}
              </button>
              <Link
                to="/security"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-navy transition hover:border-primary/60 hover:text-primary"
              >
                Visit security centre
              </Link>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 text-sm text-navy/80">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-primary">
              <span>Data source</span>
              <span>{isSupabaseLive ? 'Supabase live' : 'Demo snapshot'}</span>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last generated</p>
              <p className="text-sm font-medium text-navy">{formatDateTime(snapshot.generatedAt)}</p>
              <p className="text-xs text-navy/60">{formatRelative(snapshot.generatedAt)}</p>
              {error ? (
                <p className="mt-3 rounded-xl border border-coral/40 bg-coral/10 px-3 py-2 text-xs text-coral">
                  {error}
                </p>
              ) : null}
            </div>
            <p className="text-xs text-navy/60">
              When Supabase credentials are present we poll dedicated status tables every 5 minutes. Otherwise this demo mirrors the live structure so switching to production data is seamless.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {Object.entries(groupedServices).map(([category, services]) => (
          <article key={category} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-navy">{category}</h2>
              <p className="text-sm text-navy/70">{category === 'Platform' ? 'Frontend shell, realtime sync, and client experience' : category === 'Data' ? 'Supabase Postgres, auth, and storage surfaces' : 'Third-party integrations the suite depends on'}</p>
            </div>
            <ul className="space-y-4 text-sm text-navy/80">
              {services.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-slate-200 bg-sand/60 p-4 text-xs text-navy/60">
                  No components configured yet.
                </li>
              ) : (
                services.map((service) => (
                  <li key={service.id} className="rounded-2xl border border-slate-100 bg-sand p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-navy">{service.name}</p>
                        <p className="text-xs text-navy/60">{service.description}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${HEALTH_CLASSES[service.health]}`}>
                        {HEALTH_LABELS[service.health]}
                      </span>
                    </div>
                    <dl className="mt-3 grid gap-1 text-xs text-navy/60">
                      <div className="flex items-center justify-between">
                        <dt className="uppercase tracking-wide">Regions</dt>
                        <dd>{service.regions.join(', ')}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="uppercase tracking-wide">Last check</dt>
                        <dd>{formatRelative(service.lastCheckedAt)}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="uppercase tracking-wide">Supabase ref</dt>
                        <dd>{service.supabaseReference}</dd>
                      </div>
                    </dl>
                  </li>
                ))
              )}
            </ul>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-navy">Incident timeline</h2>
            <p className="text-sm text-navy/70">Postmortems and in-flight updates for production-impacting events.</p>
          </header>
          {snapshot.incidents.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-sand/60 p-4 text-xs text-navy/60">
              No recorded incidents. We will document any disruption here with clear timestamps and status labels.
            </p>
          ) : (
            <ul className="space-y-4">
              {snapshot.incidents.map((incident) => (
                <li key={incident.id} className="rounded-2xl border border-slate-100 bg-sand p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-navy">{incident.title}</p>
                      <p className="text-xs text-navy/60">{formatDateTime(incident.startedAt)} · {incident.severity === 'major' ? 'Major' : 'Minor'} impact</p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-navy/60">{incident.components.join(', ') || 'All systems'}</span>
                  </div>
                  <ul className="mt-3 space-y-3 border-l-2 border-primary/30 pl-4 text-xs text-navy/70">
                    {incident.updates.map((update) => (
                      <li key={update.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary">{update.status}</span>
                          <span>{formatDateTime(update.postedAt)}</span>
                        </div>
                        <p className="text-navy/80">{update.body}</p>
                      </li>
                    ))}
                  </ul>
                  {incident.resolvedAt ? (
                    <p className="mt-3 text-xs text-emerald-700">Resolved {formatDateTime(incident.resolvedAt)}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-navy">Scheduled maintenance</h2>
            <p className="text-sm text-navy/70">Upcoming changes that may briefly impact availability.</p>
          </header>
          <ul className="space-y-3 text-sm text-navy/80">
            {snapshot.maintenance.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-slate-200 bg-sand/60 p-4 text-xs text-navy/60">
                No upcoming maintenance.
              </li>
            ) : (
              snapshot.maintenance.map((window) => (
                <li key={window.id} className="rounded-2xl border border-slate-100 bg-sand p-4">
                  <p className="text-sm font-semibold text-navy">{window.title}</p>
                  <p className="text-xs text-navy/60">{formatDateTime(window.scheduledFor)} ({formatRelative(window.scheduledFor)})</p>
                  <p className="text-xs text-navy/60">Duration · {window.durationMinutes} min · Impact {window.impact}</p>
                  <p className="mt-2 text-xs text-navy/70">{window.notes}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-navy/50">Components: {window.components.join(', ')}</p>
                </li>
              ))
            )}
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-navy">Release highlights</h2>
          <p className="text-sm text-navy/70">Changelog feed that mirrors the Supabase `status_releases` table so production data drops straight in.</p>
        </header>
        <ul className="mt-4 space-y-4">
          {snapshot.releases.map((release) => (
            <li key={release.id} className="rounded-2xl border border-slate-100 bg-sand p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy">{release.version}</p>
                  <p className="text-xs text-navy/60">{formatDateTime(release.publishedAt)}</p>
                </div>
                <p className="max-w-xl text-sm text-navy/80">{release.summary}</p>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-navy/80">
                {release.highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
