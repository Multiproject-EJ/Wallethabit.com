import { useCallback, useEffect, useMemo, useState } from 'react'

import { hasSupabaseConfig, supabase } from './supabaseClient'
import { useSupabaseApp } from './supabaseDataStore'
import {
  statusDemoSnapshot,
  type StatusIncidentRecord,
  type StatusMaintenanceRecord,
  type StatusReleaseRecord,
  type StatusServiceRecord,
  type StatusSnapshot,
} from './statusDemoData'

type StatusFeedState = {
  snapshot: StatusSnapshot
  isLoading: boolean
  error: string | null
  isSupabaseLive: boolean
}

const randomId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `status-${Math.random().toString(36).slice(2, 10)}`
}

const transformServices = (rows: any[] | null | undefined): StatusServiceRecord[] => {
  if (!rows?.length) {
    return []
  }

  return rows.map((row) => ({
    id: row.id ?? randomId(),
    name: row.name ?? 'Unnamed component',
    category: (row.category ?? 'Platform') as StatusServiceRecord['category'],
    description: row.description ?? 'Component description unavailable.',
    regions: Array.isArray(row.regions) ? row.regions : ['global'],
    health: (row.health_status ?? 'operational') as StatusServiceRecord['health'],
    lastCheckedAt: row.last_checked_at ?? new Date().toISOString(),
    supabaseReference: `status_components.id = ${row.id ?? 'unknown'}`,
  }))
}

const transformMaintenance = (rows: any[] | null | undefined): StatusMaintenanceRecord[] => {
  if (!rows?.length) {
    return []
  }

  return rows.map((row) => ({
    id: row.id ?? randomId(),
    title: row.title ?? 'Maintenance window',
    scheduledFor: row.scheduled_for ?? new Date().toISOString(),
    durationMinutes: row.duration_minutes ?? 30,
    components: Array.isArray(row.components) ? row.components : [],
    impact: (row.impact ?? 'minor') as StatusMaintenanceRecord['impact'],
    notes: row.notes ?? 'Impact details pending.',
  }))
}

const transformIncidents = (rows: any[] | null | undefined): StatusIncidentRecord[] => {
  if (!rows?.length) {
    return []
  }

  return rows.map((row) => ({
    id: row.id ?? randomId(),
    title: row.title ?? 'Incident',
    startedAt: row.started_at ?? new Date().toISOString(),
    resolvedAt: row.resolved_at ?? undefined,
    severity: (row.severity ?? 'minor') as StatusIncidentRecord['severity'],
    components: Array.isArray(row.components) ? row.components : [],
    updates: Array.isArray(row.updates)
      ? row.updates.map((update: any) => ({
          id: update.id ?? randomId(),
          status: (update.status ?? 'investigating') as StatusIncidentRecord['updates'][number]['status'],
          postedAt: update.posted_at ?? new Date().toISOString(),
          body: update.body ?? 'Update pending.',
        }))
      : [],
  }))
}

const transformReleases = (rows: any[] | null | undefined): StatusReleaseRecord[] => {
  if (!rows?.length) {
    return []
  }

  return rows.map((row) => ({
    id: row.id ?? randomId(),
    version: row.version ?? '0.0.0',
    publishedAt: row.published_at ?? new Date().toISOString(),
    summary: row.summary ?? 'Release summary pending.',
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
  }))
}

export function useStatusFeed(): StatusFeedState & { refresh: () => Promise<void> } {
  const { isEnabled } = useSupabaseApp()

  const [snapshot, setSnapshot] = useState<StatusSnapshot>(() => ({
    ...statusDemoSnapshot,
    generatedAt: new Date().toISOString(),
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSupabaseLive = useMemo(() => Boolean(isEnabled && hasSupabaseConfig && supabase), [isEnabled])

  const loadSupabaseStatus = useCallback(async () => {
    if (!isSupabaseLive || !supabase) {
      setSnapshot({
        ...statusDemoSnapshot,
        generatedAt: new Date().toISOString(),
      })
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [{ data: componentsData, error: componentsError }, { data: maintenanceData, error: maintenanceError }, { data: incidentsData, error: incidentsError }, { data: releasesData, error: releasesError }] =
        await Promise.all([
          supabase.from('status_components').select('*').order('category').order('name'),
          supabase.from('status_maintenance').select('*').order('scheduled_for'),
          supabase.from('status_incidents').select('*').order('started_at', { ascending: false }),
          supabase.from('status_releases').select('*').order('published_at', { ascending: false }).limit(10),
        ])

      const firstError = componentsError ?? maintenanceError ?? incidentsError ?? releasesError
      if (firstError) {
        throw firstError
      }

      setSnapshot({
        generatedAt: new Date().toISOString(),
        services: transformServices(componentsData),
        maintenance: transformMaintenance(maintenanceData),
        incidents: transformIncidents(incidentsData),
        releases: transformReleases(releasesData),
      })
    } catch (fetchError) {
      console.warn('[WalletHabit] Falling back to demo status data.', fetchError)
      setSnapshot({
        ...statusDemoSnapshot,
        generatedAt: new Date().toISOString(),
      })
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load live status data.')
    } finally {
      setIsLoading(false)
    }
  }, [isSupabaseLive])

  useEffect(() => {
    void loadSupabaseStatus()

    if (!isSupabaseLive) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    const interval = window.setInterval(() => {
      void loadSupabaseStatus()
    }, 1000 * 60 * 5)

    return () => {
      window.clearInterval(interval)
    }
  }, [isSupabaseLive, loadSupabaseStatus])

  const refresh = useCallback(async () => {
    await loadSupabaseStatus()
  }, [loadSupabaseStatus])

  return {
    snapshot,
    isLoading,
    error,
    isSupabaseLive,
    refresh,
  }
}
