import { useEffect, useState } from 'react'

const getIsOnline = () => {
  if (typeof navigator === 'undefined') {
    return true
  }

  if (typeof navigator.onLine === 'boolean') {
    return navigator.onLine
  }

  return true
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(getIsOnline)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline }
}

export type UseOnlineStatus = ReturnType<typeof useOnlineStatus>
