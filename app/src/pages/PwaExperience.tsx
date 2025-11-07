import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useDemoData } from '../lib/demoDataStore'
import { usePwaInstallPrompt } from '../lib/usePwaInstallPrompt'
import { usePwaUpdates } from '../lib/usePwaUpdates'
import { useOnlineStatus } from '../lib/useOnlineStatus'
import { useStorageEstimate } from '../lib/useStorageEstimate'

const DEVICE_GUIDES = [
  {
    title: 'iOS & iPadOS',
    description: 'Safari, Chrome, and Firefox support WalletHabit as an installable app shell.',
    steps: [
      'Open the Share menu and choose “Add to Home Screen”.',
      'Confirm the WalletHabit name and tap “Add”.',
      'Launch from the new icon for the full-screen ritual experience.',
    ],
  },
  {
    title: 'Android',
    description: 'Chrome, Edge, and Firefox show a native install banner when ready.',
    steps: [
      'Accept the “Install app” prompt or open the browser menu.',
      'Tap “Install app” to pin WalletHabit next to your native apps.',
      'Use the bottom tabs and gestures just like any other mobile ritual.',
    ],
  },
  {
    title: 'Desktop browsers',
    description: 'Install WalletHabit for distraction-free planning on macOS, Windows, or Linux.',
    steps: [
      'Look for the “Install” icon in the address bar (Chrome, Edge) or menu (Firefox).',
      'Confirm the installation to open WalletHabit in its own window.',
      'Pin the app to your dock or taskbar to make reviews part of your routine.',
    ],
  },
] as const

const OFFLINE_CAPABILITIES = [
  {
    title: 'Dashboard & Update hub',
    detail: 'Core rituals, summaries, and checklists stay available with cached demo data.',
  },
  {
    title: 'Budget & goals planners',
    detail: 'Envelope balances, habit scores, and milestone charts remain visible offline.',
  },
  {
    title: 'Security & trust centre',
    detail: 'Status narratives and latest change notes cache locally for transparency.',
  },
] as const

const PWA_BENEFITS = [
  {
    emoji: '⚡️',
    title: 'Fast relaunches',
    copy: 'Launch WalletHabit instantly from your home screen or dock without waiting on a network round-trip.',
  },
  {
    emoji: '🛡️',
    title: 'Resilient sync',
    copy: 'Offline caching keeps rituals available; once back online, Supabase syncs live data automatically.',
  },
  {
    emoji: '🔔',
    title: 'Gentle nudges',
    copy: 'Background updates roll out silently and prompt you only when a refresh will unlock new momentum.',
  },
] as const

const INSTALL_STATUS_STYLES = {
  ready: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  standby: 'bg-amber-100 text-amber-700 border border-amber-200',
  installed: 'bg-primary/10 text-primary border border-primary/30',
} as const

type InstallStatusKey = keyof typeof INSTALL_STATUS_STYLES

const DIAGNOSTIC_TONE_CLASSES = {
  positive: 'border-emerald-200 bg-emerald-50/90 text-emerald-900',
  caution: 'border-amber-200 bg-amber-50/90 text-amber-900',
  info: 'border-slate-200 bg-sand text-navy',
} as const

type DiagnosticTone = keyof typeof DIAGNOSTIC_TONE_CLASSES

const formatMegabytes = (value: number) => {
  const megaBytes = value / (1024 * 1024)
  const precision = megaBytes >= 100 ? 0 : 1

  return `${megaBytes.toFixed(precision)} MB`
}

const TROUBLESHOOTING_TOPICS = [
  {
    title: 'Install option not appearing',
    points: [
      'Confirm you opened WalletHabit over HTTPS in a supported browser tab (Chrome, Edge, Safari, or Firefox).',
      'Interact with the page for a moment — browsers wait for a user gesture before surfacing the install UI.',
      'If you previously dismissed the banner, look for the “Install” button in the browser menu to trigger it again.',
    ],
  },
  {
    title: 'Updates seem stuck',
    points: [
      'Use the “Refresh now” button above when a new build is ready — it swaps the service worker instantly.',
      'Hard refresh (Shift + Reload or ⌘⇧R) clears stale caches while keeping your Supabase data intact.',
      'Check the Status hub for any deploy notices if a release is temporarily paused.',
    ],
  },
  {
    title: 'Offline cache missing data',
    points: [
      'Keep WalletHabit open for a few seconds after sign-in so rituals have time to warm the cache.',
      'Storage limits are browser-managed; remove older versions from Settings → Site Data if space is full.',
      'Switching devices? Sign in on each one once while online to seed the offline experience.',
    ],
  },
] as const

export default function PwaExperience() {
  const {
    state: { profile },
  } = useDemoData()
  const {
    isInstallable,
    promptInstall,
    installOutcome,
    hasInstalled,
    isStandalone,
  } = usePwaInstallPrompt()
  const {
    isUpdateAvailable,
    applyUpdate,
    dismissUpdate,
    isOfflineReady,
    acknowledgeOfflineReady,
  } = usePwaUpdates()
  const { isOnline } = useOnlineStatus()
  const { usage, quota, isSupported: isStorageSupported, isReady: isStorageReady } = useStorageEstimate(120_000)

  const [isPrompting, setIsPrompting] = useState(false)
  const [promptError, setPromptError] = useState<string | null>(null)
  const [hasDismissedOfflineReady, setHasDismissedOfflineReady] = useState(false)
  const [hasSeenOfflineReady, setHasSeenOfflineReady] = useState(false)

  const skin = profile.skin ?? 'classic'
  const isUltimate = skin === 'ultimate-budget'

  const installStatus = useMemo<{ key: InstallStatusKey; label: string }>(() => {
    if (hasInstalled || isStandalone || installOutcome === 'accepted') {
      return { key: 'installed', label: 'Installed' }
    }

    if (isInstallable) {
      return { key: 'ready', label: 'Install ready' }
    }

    return { key: 'standby', label: 'Browser managed' }
  }, [hasInstalled, isStandalone, installOutcome, isInstallable])

  const outcomeLabel = installOutcome
    ? installOutcome === 'accepted'
      ? 'Thanks for installing WalletHabit!'
      : 'Install dismissed — you can always try again.'
    : null

  const handlePromptInstall = async () => {
    if (!isInstallable) {
      return
    }

    setIsPrompting(true)
    setPromptError(null)

    try {
      await promptInstall()
    } catch (error) {
      console.error('Unable to trigger install prompt', error)
      setPromptError('Unable to trigger the browser install prompt. Please try again or use the manual steps below.')
    } finally {
      setIsPrompting(false)
    }
  }

  useEffect(() => {
    if (isOfflineReady) {
      setHasSeenOfflineReady(true)
    }
  }, [isOfflineReady])

  const showOfflineReady = isOfflineReady && !hasDismissedOfflineReady

  const offlineStatusLabel = showOfflineReady || hasSeenOfflineReady ? 'Ready' : 'Preparing'

  const handleDismissOfflineReady = () => {
    setHasDismissedOfflineReady(true)
    acknowledgeOfflineReady()
  }

  const storageSummary = useMemo(() => {
    if (!isStorageSupported) {
      return {
        label: 'Browser managed',
        detail: 'Your device controls cache size; WalletHabit keeps essentials lean automatically.',
      }
    }

    if (!isStorageReady) {
      return {
        label: 'Estimating…',
        detail: 'We are reading available space to tune offline coverage.',
      }
    }

    if (usage !== undefined && quota !== undefined && quota > 0) {
      const percent = Math.min(100, Math.round((usage / quota) * 100))

      return {
        label: `${formatMegabytes(usage)} of ${formatMegabytes(quota)}`,
        detail: `About ${percent}% of your allotted storage is currently powering offline rituals.`,
      }
    }

    if (usage !== undefined) {
      return {
        label: `${formatMegabytes(usage)} cached`,
        detail: 'We will keep adding modules while space allows.',
      }
    }

    return {
      label: 'Ready',
      detail: 'Your browser will allocate space dynamically.',
    }
  }, [isStorageSupported, isStorageReady, quota, usage])

  const diagnostics = useMemo(
    () => [
      {
        title: 'Connectivity',
        status: isOnline ? 'Online' : 'Offline',
        detail: isOnline
          ? 'Live Supabase sync and update checks are active.'
          : 'Continue planning offline — we will sync once you reconnect.',
        tone: isOnline ? ('positive' as DiagnosticTone) : ('caution' as DiagnosticTone),
      },
      {
        title: 'Install state',
        status: installStatus.label,
        detail:
          installStatus.key === 'installed'
            ? 'Launch WalletHabit from your home screen or dock for the full experience.'
            : installStatus.key === 'ready'
            ? 'Tap the install button above to pin WalletHabit like a native app.'
            : 'Your browser will surface the install option automatically once requirements are met.',
        tone: installStatus.key === 'installed' ? ('positive' as DiagnosticTone) : ('info' as DiagnosticTone),
      },
      {
        title: 'Offline cache',
        status: offlineStatusLabel,
        detail:
          offlineStatusLabel === 'Ready'
            ? 'Core rituals, dashboards, and the trust centre are available without a connection.'
            : 'Stay on this tab for a moment so we can finish caching the essentials.',
        tone: offlineStatusLabel === 'Ready' ? ('positive' as DiagnosticTone) : ('info' as DiagnosticTone),
      },
      {
        title: 'Update channel',
        status: isUpdateAvailable ? 'Refresh suggested' : 'Auto-update',
        detail: isUpdateAvailable
          ? 'A new build is waiting — refresh when you are ready to pick up the latest rituals.'
          : 'Service workers keep WalletHabit current quietly in the background.',
        tone: isUpdateAvailable ? ('caution' as DiagnosticTone) : ('positive' as DiagnosticTone),
      },
      {
        title: 'Storage footprint',
        status: storageSummary.label,
        detail: storageSummary.detail,
        tone:
          storageSummary.label === 'Browser managed' || storageSummary.label === 'Estimating…'
            ? ('info' as DiagnosticTone)
            : ('positive' as DiagnosticTone),
      },
    ], [
      installStatus.key,
      installStatus.label,
      isOnline,
      isUpdateAvailable,
      offlineStatusLabel,
      storageSummary.detail,
      storageSummary.label,
    ],
  )

  return (
    <div className="flex flex-1 flex-col gap-16 pb-20">
      <header
        className={`rounded-3xl border px-8 py-12 shadow-sm sm:px-12 ${
          isUltimate ? 'border-[#e0d1bd]/70 bg-[#fef9f3]' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-5">
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                isUltimate ? 'border-[#e0d1bd] bg-[#f9f1e4] text-[#5b4a39]' : 'border-primary/20 bg-primary/5 text-primary'
              }`}
            >
              PWA experience
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-navy sm:text-5xl">
              Install WalletHabit for a silky, offline-friendly ritual.
            </h1>
            <p className="max-w-2xl text-base text-navy/70">
              WalletHabit ships as a Progressive Web App so you can add it to your home screen, stay productive without a signal,
              and receive calm prompts when a new build is ready.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  void handlePromptInstall()
                }}
                disabled={!isInstallable || isPrompting}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-white shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isUltimate
                    ? 'bg-[#5c7751] hover:bg-[#4f6745] focus-visible:outline-[#5c7751] disabled:bg-[#d0d9cb]'
                    : 'bg-primary hover:bg-primary-dark focus-visible:outline-primary disabled:bg-slate-300'
                } ${!isInstallable ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                {isPrompting ? 'Opening prompt…' : isInstallable ? 'Install WalletHabit' : 'Install prompt unavailable'}
              </button>
              <Link
                to="/mobile"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-navy transition hover:border-primary/60 hover:text-primary"
              >
                Explore mobile module →
              </Link>
            </div>
            {promptError ? (
              <p className="max-w-xl rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral">
                {promptError}
              </p>
            ) : null}
          </div>
          <div className="grid w-full max-w-sm gap-4 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-sm text-navy/80">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                <span>Install status</span>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${INSTALL_STATUS_STYLES[installStatus.key]}`}>
                  {installStatus.label}
                </span>
              </div>
              <p className="text-xs text-navy/60">
                {hasInstalled || isStandalone
                  ? 'Launching from the home screen opens the full-screen PWA instantly.'
                  : isInstallable
                  ? 'Your browser captured the install event. Tap install to add WalletHabit to your device.'
                  : 'We rely on the browser UI to advertise installation when conditions are met.'}
              </p>
              {outcomeLabel ? <p className="text-xs font-semibold text-primary">{outcomeLabel}</p> : null}
            </div>
            <div className="grid gap-2 text-xs text-navy/60">
              <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 p-3">
                <span className="font-semibold uppercase tracking-wide text-slate-500">Offline cache</span>
                <span className="text-sm font-semibold text-navy">{offlineStatusLabel}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 p-3">
                <span className="font-semibold uppercase tracking-wide text-slate-500">Update channel</span>
                <span className="text-sm font-semibold text-navy">{isUpdateAvailable ? 'Refresh suggested' : 'Auto-update'}</span>
              </div>
            </div>
            {showOfflineReady ? (
              <button
                type="button"
                onClick={handleDismissOfflineReady}
                className="rounded-full border border-primary/30 bg-white/80 px-4 py-2 text-xs font-semibold text-primary transition hover:border-primary/50 hover:text-primary-dark"
              >
                Dismiss offline ready toast
              </button>
            ) : null}
            {isUpdateAvailable ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void applyUpdate()
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
                >
                  Refresh now
                </button>
                <button
                  type="button"
                  onClick={dismissUpdate}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-navy transition hover:border-primary/60 hover:text-primary"
                >
                  Later
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-navy">Live PWA diagnostics</h2>
            <p className="text-sm text-navy/70">
              WalletHabit checks the essentials in real-time so you always know whether the app is installable, cached, and
              ready to sync.
            </p>
          </div>
          <Link
            to="/status"
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-navy transition hover:border-primary/60 hover:text-primary"
          >
            View status hub →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {diagnostics.map((item) => (
            <article
              key={item.title}
              className={`flex flex-col gap-2 rounded-2xl border p-5 text-sm leading-relaxed shadow-sm transition ${DIAGNOSTIC_TONE_CLASSES[item.tone]}`}
            >
              <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{item.title}</span>
              <span className="text-lg font-semibold">{item.status}</span>
              <p className="text-sm opacity-80">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-3">
        {PWA_BENEFITS.map((benefit) => (
          <article key={benefit.title} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-sand p-6 text-sm text-navy/80">
            <span className="text-2xl" aria-hidden>
              {benefit.emoji}
            </span>
            <h2 className="text-lg font-semibold text-navy">{benefit.title}</h2>
            <p>{benefit.copy}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {DEVICE_GUIDES.map((guide) => (
          <article key={guide.title} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-navy">{guide.title}</h2>
              <p className="text-sm text-navy/70">{guide.description}</p>
            </div>
            <ol className="space-y-3 text-sm text-navy/80">
              {guide.steps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-slate-100 bg-sand p-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-dashed border-primary/40 bg-gradient-to-br from-white via-primary/5 to-primary/10 p-8 text-sm text-navy/80">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold text-navy">Offline rituals that keep momentum</h2>
            <p className="text-sm text-navy/70">
              WalletHabit pre-caches the essentials so you can review plans and capture updates even while travelling. Once your
              connection returns we sync back to Supabase and surface any fresh prompts.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {OFFLINE_CAPABILITIES.map((capability) => (
              <div key={capability.title} className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{capability.title}</p>
                <p className="mt-1 text-sm text-navy/70">{capability.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-navy">Troubleshooting playbook</h2>
          <p className="text-sm text-navy/70">
            Keep these moves handy if your browser hides install prompts or you need to refresh cached rituals in a hurry.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {TROUBLESHOOTING_TOPICS.map((topic) => (
            <article key={topic.title} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-sand p-6 text-sm text-navy/80">
              <h3 className="text-lg font-semibold text-navy">{topic.title}</h3>
              <ul className="space-y-2 text-sm text-navy/70">
                {topic.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
