import { useEffect, useMemo, useState } from 'react'

import { useDemoData } from '../lib/demoDataStore'
import { usePwaInstallPrompt } from '../lib/usePwaInstallPrompt'
import { usePwaUpdates } from '../lib/usePwaUpdates'

const INSTALL_DISMISS_STORAGE_KEY = 'wallethabit-pwa-install-dismissed'

export default function PwaPromptHub() {
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
  const {
    state: { profile },
  } = useDemoData()

  const [hasDismissedInstall, setHasDismissedInstall] = useState(false)
  const [isPrompting, setIsPrompting] = useState(false)
  const [showInstallSuccess, setShowInstallSuccess] = useState(false)
  const [hasSeenOfflineToast, setHasSeenOfflineToast] = useState(false)

  const isUltimate = profile.skin === 'ultimate-budget'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const storedValue = window.localStorage.getItem(INSTALL_DISMISS_STORAGE_KEY)
      setHasDismissedInstall(storedValue === 'true')
    } catch (error) {
      console.error('Unable to read install prompt preference', error)
    }
  }, [])

  useEffect(() => {
    if (installOutcome === 'accepted' || hasInstalled || isStandalone) {
      setShowInstallSuccess(true)
      setHasDismissedInstall(true)

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(INSTALL_DISMISS_STORAGE_KEY, 'true')
        } catch (error) {
          console.error('Unable to persist install prompt preference', error)
        }
      }
    }
  }, [installOutcome, hasInstalled, isStandalone])

  useEffect(() => {
    if (showInstallSuccess) {
      const timeout = window.setTimeout(() => {
        setShowInstallSuccess(false)
      }, 6000)

      return () => {
        window.clearTimeout(timeout)
      }
    }
  }, [showInstallSuccess])

  useEffect(() => {
    if (isOfflineReady) {
      setHasSeenOfflineToast(false)
    }
  }, [isOfflineReady])

  const showInstallCta =
    isInstallable && !hasDismissedInstall && !hasInstalled && !isStandalone

  const showOfflineToast = isOfflineReady && !hasSeenOfflineToast

  useEffect(() => {
    if (!showInstallCta) {
      setIsPrompting(false)
    }
  }, [showInstallCta])

  const cardBaseClass = useMemo(
    () =>
      [
        'pointer-events-auto rounded-3xl border p-5 shadow-[0_20px_45px_rgba(31,42,68,0.16)] backdrop-blur-lg transition',
        isUltimate
          ? 'border-[#e0d1bd]/80 bg-[#fef9f3]/90 text-[#3f2a1e]'
          : 'border-slate-200/70 bg-white/90 text-navy',
      ].join(' '),
    [isUltimate],
  )

  const primaryButtonClass = useMemo(
    () =>
      [
        'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        isUltimate
          ? 'bg-[#5c7751] text-white hover:bg-[#4f6745] focus-visible:outline-[#5c7751]'
          : 'bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary',
      ].join(' '),
    [isUltimate],
  )

  const ghostButtonClass = useMemo(
    () =>
      [
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        isUltimate
          ? 'text-[#5b4a39]/80 hover:text-[#4a3c2d] focus-visible:outline-[#d1bea5]'
          : 'text-navy/70 hover:text-navy focus-visible:outline-slate-300',
      ].join(' '),
    [isUltimate],
  )

  if (!showInstallCta && !showOfflineToast && !isUpdateAvailable && !showInstallSuccess) {
    return null
  }

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-40 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-4 sm:right-8 sm:bottom-8">
      {isUpdateAvailable && (
        <section className={cardBaseClass} role="alert" aria-live="polite">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                isUltimate ? 'bg-[#efe2cc]' : 'bg-primary/10'
              }`}
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 ${isUltimate ? 'text-[#5c7751]' : 'text-primary'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4" />
                <path d="m16 6-4-4-4 4" />
                <path d="M21 12a9 9 0 1 1-9-9" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="font-semibold">Fresh update ready</p>
                <p className="mt-1 text-sm leading-relaxed text-current/80">
                  Reload to switch to the latest WalletHabit build with new fixes and features.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={primaryButtonClass} onClick={applyUpdate}>
                  Refresh now
                </button>
                <button type="button" className={ghostButtonClass} onClick={dismissUpdate}>
                  Later
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {showInstallCta && (
        <section className={cardBaseClass} role="dialog" aria-modal="false" aria-live="polite">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                isUltimate ? 'bg-[#efe2cc]' : 'bg-primary/10'
              }`}
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 ${isUltimate ? 'text-[#5c7751]' : 'text-primary'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v14" />
                <path d="m16 11-4 4-4-4" />
                <path d="M5 19h14" />
              </svg>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="font-semibold">Install WalletHabit</p>
                <p className="mt-1 text-sm leading-relaxed text-current/80">
                  Add WalletHabit to your home screen for one-tap access, offline rituals, and faster launches.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={primaryButtonClass}
                  onClick={async () => {
                    setIsPrompting(true)
                    try {
                      await promptInstall()
                    } finally {
                      setIsPrompting(false)
                    }
                  }}
                  disabled={isPrompting}
                >
                  {isPrompting ? 'Opening…' : 'Install app'}
                </button>
                <button
                  type="button"
                  className={ghostButtonClass}
                  onClick={() => {
                    setHasDismissedInstall(true)
                    if (typeof window !== 'undefined') {
                      try {
                        window.localStorage.setItem(INSTALL_DISMISS_STORAGE_KEY, 'true')
                      } catch (error) {
                        console.error('Unable to persist install prompt preference', error)
                      }
                    }
                  }}
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {showInstallSuccess && (
        <section className={cardBaseClass} role="status" aria-live="polite">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                isUltimate ? 'bg-[#efe2cc]' : 'bg-primary/10'
              }`}
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 ${isUltimate ? 'text-[#5c7751]' : 'text-primary'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="font-semibold">Ready on your home screen</p>
                <p className="mt-1 text-sm leading-relaxed text-current/80">
                  WalletHabit is installed. Launch it anytime without the browser chrome.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  className={ghostButtonClass}
                  onClick={() => setShowInstallSuccess(false)}
                >
                  Nice!
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {showOfflineToast && (
        <section className={cardBaseClass} role="status" aria-live="polite">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                isUltimate ? 'bg-[#efe2cc]' : 'bg-primary/10'
              }`}
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 ${isUltimate ? 'text-[#5c7751]' : 'text-primary'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v5h.01M7 3v9h.01M11 3v5h.01M15 3v9h.01M19 3v5h.01" />
                <path d="M3 13h18" />
                <path d="M5 17h14" />
                <path d="M9 21h6" />
              </svg>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="font-semibold">Offline cache ready</p>
                <p className="mt-1 text-sm leading-relaxed text-current/80">
                  Key routes are cached locally. You can keep planning budgets even without a connection.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  className={ghostButtonClass}
                  onClick={() => {
                    setHasSeenOfflineToast(true)
                    acknowledgeOfflineReady()
                  }}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
