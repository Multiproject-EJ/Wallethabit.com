export type StatusHealth = 'operational' | 'degraded' | 'outage' | 'maintenance'

export type StatusServiceRecord = {
  id: string
  name: string
  category: 'Platform' | 'Data' | 'Integrations'
  description: string
  regions: string[]
  health: StatusHealth
  lastCheckedAt: string
  supabaseReference: string
}

export type StatusMaintenanceRecord = {
  id: string
  title: string
  scheduledFor: string
  durationMinutes: number
  components: string[]
  impact: 'none' | 'minor' | 'major'
  notes: string
}

export type StatusIncidentUpdate = {
  id: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  postedAt: string
  body: string
}

export type StatusIncidentRecord = {
  id: string
  title: string
  startedAt: string
  resolvedAt?: string
  severity: 'minor' | 'major'
  components: string[]
  updates: StatusIncidentUpdate[]
}

export type StatusReleaseRecord = {
  id: string
  version: string
  publishedAt: string
  summary: string
  highlights: string[]
}

export type StatusSnapshot = {
  generatedAt: string
  services: StatusServiceRecord[]
  maintenance: StatusMaintenanceRecord[]
  incidents: StatusIncidentRecord[]
  releases: StatusReleaseRecord[]
}

export const statusDemoSnapshot: StatusSnapshot = {
  generatedAt: '2024-11-04T08:15:00.000Z',
  services: [
    {
      id: 'svc-app-shell',
      name: 'Web app shell',
      category: 'Platform',
      description: 'React + Vite bundle served over GitHub Pages',
      regions: ['global'],
      health: 'operational',
      lastCheckedAt: '2024-11-04T08:14:32.000Z',
      supabaseReference: 'status_components.id = svc-app-shell',
    },
    {
      id: 'svc-auth',
      name: 'Supabase auth & profiles',
      category: 'Data',
      description: 'Supabase auth, profiles, and customer modules tables',
      regions: ['eu-west-1'],
      health: 'operational',
      lastCheckedAt: '2024-11-04T08:13:51.000Z',
      supabaseReference: 'status_components.id = svc-auth',
    },
    {
      id: 'svc-database',
      name: 'Postgres edge APIs',
      category: 'Data',
      description: 'Realtime reads from Supabase PostgREST endpoints',
      regions: ['eu-west-1'],
      health: 'operational',
      lastCheckedAt: '2024-11-04T08:14:05.000Z',
      supabaseReference: 'status_components.id = svc-database',
    },
    {
      id: 'svc-realtime',
      name: 'Realtime channel sync',
      category: 'Platform',
      description: 'Supabase realtime listeners for module unlocks',
      regions: ['global'],
      health: 'maintenance',
      lastCheckedAt: '2024-11-04T08:12:26.000Z',
      supabaseReference: 'status_components.id = svc-realtime',
    },
    {
      id: 'svc-stripe',
      name: 'Stripe Checkout bridge',
      category: 'Integrations',
      description: 'Stripe client + webhook relay for plan upgrades',
      regions: ['global'],
      health: 'degraded',
      lastCheckedAt: '2024-11-04T08:13:02.000Z',
      supabaseReference: 'status_components.id = svc-stripe',
    },
  ],
  maintenance: [
    {
      id: 'mnt-realtime-nov',
      title: 'Supabase realtime maintenance',
      scheduledFor: '2024-11-07T01:00:00.000Z',
      durationMinutes: 45,
      components: ['svc-realtime'],
      impact: 'minor',
      notes:
        'Supabase realtime will restart to adopt the November release. Expect websocket reconnects for up to 2 minutes.',
    },
  ],
  incidents: [
    {
      id: 'inc-stripe-webhook-delay',
      title: 'Stripe webhook delays',
      startedAt: '2024-11-03T18:20:00.000Z',
      resolvedAt: '2024-11-03T19:05:00.000Z',
      severity: 'minor',
      components: ['svc-stripe'],
      updates: [
        {
          id: 'inc-stripe-update-1',
          status: 'investigating',
          postedAt: '2024-11-03T18:28:00.000Z',
          body: 'Engineers noticed delayed webhook acknowledgements from the GitHub Actions relay. Investigation began immediately.',
        },
        {
          id: 'inc-stripe-update-2',
          status: 'identified',
          postedAt: '2024-11-03T18:39:00.000Z',
          body: 'GitHub Actions cache purge caused cold starts on the relay worker. Requests retried automatically.',
        },
        {
          id: 'inc-stripe-update-3',
          status: 'monitoring',
          postedAt: '2024-11-03T18:55:00.000Z',
          body: 'Relay warmed and webhook delivery times returned to < 5s. Monitoring for stability.',
        },
        {
          id: 'inc-stripe-update-4',
          status: 'resolved',
          postedAt: '2024-11-03T19:05:00.000Z',
          body: 'All delayed events processed and no further impact observed. Incident resolved.',
        },
      ],
    },
  ],
  releases: [
    {
      id: 'rel-2024-44',
      version: '2024.44',
      publishedAt: '2024-11-04T07:45:00.000Z',
      summary: 'Installable PWA shell, offline caching, and refreshed security centre copy.',
      highlights: [
        'Vite-powered service worker with offline caching for dashboard routes.',
        'Under-construction banner dismiss state persists across reloads.',
        'Security & Trust centre now links to realtime status updates.',
      ],
    },
    {
      id: 'rel-2024-43',
      version: '2024.43',
      publishedAt: '2024-10-28T09:20:00.000Z',
      summary: 'Goals lab forecasting refinements and updated cash flow insights.',
      highlights: [
        'Goals projection cards now surface pace vs. target deltas.',
        'Dashboard hero insight references the newest savings milestone.',
        'AI copilot prompt starter pack expanded with 12 fresh workflows.',
      ],
    },
  ],
}
