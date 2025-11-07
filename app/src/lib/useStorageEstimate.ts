import { useEffect, useMemo, useState } from 'react'

type StorageEstimateResult = {
  usage?: number
  quota?: number
}

type StorageState = StorageEstimateResult & {
  isSupported: boolean
  isReady: boolean
}

const isStorageEstimateSupported = () =>
  typeof navigator !== 'undefined' && typeof navigator.storage?.estimate === 'function'

export function useStorageEstimate(pollIntervalMs = 60_000): StorageState {
  const isSupported = useMemo(isStorageEstimateSupported, [])
  const [{ usage, quota }, setEstimate] = useState<StorageEstimateResult>({})

  useEffect(() => {
    if (!isSupported) {
      return
    }

    let isMounted = true
    let pollHandle: number | undefined

    const loadEstimate = async () => {
      try {
        const storageManager = navigator.storage

        if (!storageManager?.estimate) {
          return
        }

        const result = await storageManager.estimate()

        if (isMounted) {
          setEstimate({
            usage: result.usage,
            quota: result.quota,
          })
        }
      } catch (error) {
        console.warn('[WalletHabit] Unable to read storage estimate', error)
      }
    }

    void loadEstimate()

    if (pollIntervalMs > 0) {
      pollHandle = window.setInterval(() => {
        void loadEstimate()
      }, pollIntervalMs)
    }

    return () => {
      isMounted = false

      if (pollHandle) {
        window.clearInterval(pollHandle)
      }
    }
  }, [isSupported, pollIntervalMs])

  return {
    usage,
    quota,
    isSupported,
    isReady: usage !== undefined || quota !== undefined,
  }
}

export type UseStorageEstimate = ReturnType<typeof useStorageEstimate>
