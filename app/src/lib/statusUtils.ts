import type {
  StatusHealth,
  StatusIncidentRecord,
  StatusMaintenanceRecord,
  StatusServiceRecord,
} from './statusDemoData'

export type ServicesHealthSummary = {
  total: number
  byHealth: Record<StatusHealth, number>
  supabaseReference: string
}

export type MaintenanceSummary = {
  upcomingCount: number
  nextWindow:
    | (Pick<StatusMaintenanceRecord, 'id' | 'title' | 'scheduledFor' | 'durationMinutes' | 'components'> & {
        supabaseReference: string
      })
    | null
}

export type IncidentSummary = {
  openCount: number
  recentlyResolvedCount: number
  latestIncident:
    | (Pick<StatusIncidentRecord, 'id' | 'title' | 'startedAt' | 'resolvedAt' | 'severity' | 'components'> & {
        supabaseReference: string
      })
    | null
  supabaseReference: string
}

const HEALTH_ORDER: StatusHealth[] = ['operational', 'maintenance', 'degraded', 'outage']

export const computeOverallHealth = (healths: StatusHealth[]): StatusHealth => {
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

export const summarizeServiceHealth = (services: StatusServiceRecord[]): ServicesHealthSummary => {
  const byHealth: Record<StatusHealth, number> = {
    operational: 0,
    maintenance: 0,
    degraded: 0,
    outage: 0,
  }

  services.forEach((service) => {
    byHealth[service.health] += 1
  })

  return {
    total: services.length,
    byHealth,
    supabaseReference: 'status_components.health_status distribution',
  }
}

const isUpcomingWindow = (window: StatusMaintenanceRecord, now: Date) => {
  const scheduled = new Date(window.scheduledFor).getTime()
  const horizon = now.getTime() - 30 * 60 * 1000
  return Number.isFinite(scheduled) ? scheduled >= horizon : false
}

export const summarizeMaintenance = (
  maintenanceWindows: StatusMaintenanceRecord[],
  now: Date = new Date(),
): MaintenanceSummary => {
  if (!maintenanceWindows.length) {
    return {
      upcomingCount: 0,
      nextWindow: null,
    }
  }

  const sorted = [...maintenanceWindows].sort(
    (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime(),
  )

  const upcoming = sorted.filter((window) => isUpcomingWindow(window, now))
  const nextWindow = upcoming[0] ?? sorted[0] ?? null

  if (!nextWindow) {
    return {
      upcomingCount: 0,
      nextWindow: null,
    }
  }

  return {
    upcomingCount: upcoming.length,
    nextWindow: {
      id: nextWindow.id,
      title: nextWindow.title,
      scheduledFor: nextWindow.scheduledFor,
      durationMinutes: nextWindow.durationMinutes,
      components: nextWindow.components,
      supabaseReference: `status_maintenance.id = ${nextWindow.id}`,
    },
  }
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export const summarizeIncidents = (
  incidents: StatusIncidentRecord[],
  now: Date = new Date(),
): IncidentSummary => {
  if (!incidents.length) {
    return {
      openCount: 0,
      recentlyResolvedCount: 0,
      latestIncident: null,
      supabaseReference: 'status_incidents (no rows)',
    }
  }

  const openIncidents = incidents.filter((incident) => !incident.resolvedAt)
  const recentlyResolved = incidents.filter((incident) => {
    if (!incident.resolvedAt) {
      return false
    }
    const resolvedAt = new Date(incident.resolvedAt)
    if (Number.isNaN(resolvedAt.getTime())) {
      return false
    }
    return now.getTime() - resolvedAt.getTime() <= THIRTY_DAYS_MS
  })

  const latestIncident = [...incidents].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )[0]

  if (!latestIncident) {
    return {
      openCount: openIncidents.length,
      recentlyResolvedCount: recentlyResolved.length,
      latestIncident: null,
      supabaseReference: 'status_incidents (invalid rows)',
    }
  }

  return {
    openCount: openIncidents.length,
    recentlyResolvedCount: recentlyResolved.length,
    latestIncident: {
      id: latestIncident.id,
      title: latestIncident.title,
      startedAt: latestIncident.startedAt,
      resolvedAt: latestIncident.resolvedAt,
      severity: latestIncident.severity,
      components: latestIncident.components,
      supabaseReference: `status_incidents.id = ${latestIncident.id}`,
    },
    supabaseReference: 'status_incidents severity + resolution rollup',
  }
}

export const sortHealthStates = (healths: StatusHealth[]): StatusHealth[] => {
  return [...healths].sort((a, b) => HEALTH_ORDER.indexOf(a) - HEALTH_ORDER.indexOf(b))
}
