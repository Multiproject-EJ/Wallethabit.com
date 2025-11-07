import { useCallback, useEffect, useState } from 'react'

import { subscribeToPwaEvents } from './pwaClient'

type UpdateController = (reloadPage?: boolean) => Promise<void>

export function usePwaUpdates() {
  const [updateController, setUpdateController] = useState<UpdateController | null>(null)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToPwaEvents((event) => {
      if (event.type === 'NEED_REFRESH') {
        setUpdateController(() => event.updateServiceWorker)
      }

      if (event.type === 'OFFLINE_READY') {
        setOfflineReady(true)
      }
    })

    return unsubscribe
  }, [])

  const applyUpdate = useCallback(async () => {
    if (!updateController) {
      return
    }

    try {
      await updateController()
    } finally {
      setUpdateController(null)
    }
  }, [updateController])

  const dismissUpdate = useCallback(() => {
    setUpdateController(null)
  }, [])

  const acknowledgeOfflineReady = useCallback(() => {
    setOfflineReady(false)
  }, [])

  return {
    isUpdateAvailable: updateController !== null,
    applyUpdate,
    dismissUpdate,
    isOfflineReady: offlineReady,
    acknowledgeOfflineReady,
  }
}
