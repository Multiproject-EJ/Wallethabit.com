import { useCallback, useEffect, useRef, useState } from 'react'

type InstallOutcome = 'accepted' | 'dismissed' | null

const isStandaloneDisplay = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const matchMedia = window.matchMedia?.('(display-mode: standalone)')
  const navigatorStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone

  return Boolean(matchMedia?.matches || navigatorStandalone)
}

export function usePwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installOutcome, setInstallOutcome] = useState<InstallOutcome>(null)
  const [isStandalone, setIsStandalone] = useState(isStandaloneDisplay())
  const [hasInstalled, setHasInstalled] = useState(isStandaloneDisplay())
  const promptInFlight = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setInstallOutcome(null)
    }

    const handleAppInstalled = () => {
      setHasInstalled(true)
      setDeferredPrompt(null)
      setInstallOutcome('accepted')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    const mediaQuery = window.matchMedia?.('(display-mode: standalone)')

    const handleDisplayModeChange = () => {
      const standalone = isStandaloneDisplay()
      setIsStandalone(standalone)
      if (standalone) {
        setHasInstalled(true)
      }
    }

    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleDisplayModeChange)
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleDisplayModeChange)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)

      if (mediaQuery) {
        if (typeof mediaQuery.removeEventListener === 'function') {
          mediaQuery.removeEventListener('change', handleDisplayModeChange)
        } else if (typeof mediaQuery.removeListener === 'function') {
          mediaQuery.removeListener(handleDisplayModeChange)
        }
      }
    }
  }, [])

  const promptInstall = useCallback(async () => {
    const promptEvent = deferredPrompt

    if (!promptEvent || promptInFlight.current) {
      return null
    }

    promptInFlight.current = true
    setInstallOutcome(null)

    try {
      await promptEvent.prompt()
      const choiceResult = await promptEvent.userChoice
      setInstallOutcome(choiceResult.outcome)

      if (choiceResult.outcome === 'accepted') {
        setHasInstalled(true)
        setDeferredPrompt(null)
      }

      return choiceResult
    } catch (error) {
      console.error('Unable to prompt WalletHabit install', error)
      return null
    } finally {
      promptInFlight.current = false
    }
  }, [deferredPrompt])

  return {
    isInstallable: deferredPrompt !== null,
    promptInstall,
    installOutcome,
    hasInstalled,
    isStandalone,
  }
}
