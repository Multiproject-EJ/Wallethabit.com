import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useDemoData } from '../lib/demoDataStore'
import { usePwaInstallPrompt } from '../lib/usePwaInstallPrompt'
import { usePwaUpdates } from '../lib/usePwaUpdates'

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

  const [isPrompting, setIsPrompting] = useState(false)
  const [promptError, setPromptError] = useState<string | null>(null)
  const [hasDismissedOfflineReady, setHasDismissedOfflineReady] = useState(false)

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

  const showOfflineReady = isOfflineReady && !hasDismissedOfflineReady

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
                <span className="text-sm font-semibold text-navy">{showOfflineReady ? 'Ready' : 'Preparing'}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 p-3">
                <span className="font-semibold uppercase tracking-wide text-slate-500">Update channel</span>
                <span className="text-sm font-semibold text-navy">{isUpdateAvailable ? 'Refresh suggested' : 'Auto-update'}</span>
              </div>
            </div>
            {showOfflineReady ? (
              <button
                type="button"
                onClick={() => {
                  setHasDismissedOfflineReady(true)
                  acknowledgeOfflineReady()
                }}
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
    </div>
  )
}
