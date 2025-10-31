import { registerSW } from 'virtual:pwa-register'

export const initPwa = () => {
  if (typeof window === 'undefined') {
    return
  }

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      console.info('[WalletHabit] New version ready — refresh to update.')
    },
    onOfflineReady() {
      console.info('[WalletHabit] App cached for offline use.')
    },
  })

  return updateSW
}
