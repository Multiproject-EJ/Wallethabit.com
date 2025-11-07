import { registerSW } from 'virtual:pwa-register'

type PwaEvent =
  | { type: 'NEED_REFRESH'; updateServiceWorker: (reloadPage?: boolean) => Promise<void> }
  | { type: 'OFFLINE_READY' }

type Listener = (event: PwaEvent) => void

const listeners = new Set<Listener>()

const emit = (event: PwaEvent) => {
  listeners.forEach((listener) => listener(event))
}

export const subscribeToPwaEvents = (listener: Listener) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

let isRegistered = false

export const initPwa = () => {
  if (typeof window === 'undefined' || isRegistered) {
    return
  }

  isRegistered = true

  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      console.info('[WalletHabit] New version ready — refresh to update.')
      emit({ type: 'NEED_REFRESH', updateServiceWorker })
    },
    onOfflineReady() {
      console.info('[WalletHabit] App cached for offline use.')
      emit({ type: 'OFFLINE_READY' })
    },
  })

  return updateServiceWorker
}

export type { PwaEvent }
